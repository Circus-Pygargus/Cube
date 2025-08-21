<?php

namespace App\Controller;

use App\CubeType\CubeType;
use App\Entity\Chrono;
use App\Form\Type\ChronoType;
use App\Form\Type\CubeFormType;
use App\Service\ScrambleMoveService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class GameController extends AbstractController
{
    #[Route('/game', name: 'app_game')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $cubeTypeForm = $this->createForm(CubeFormType::class);

        return $this->render('game/index.html.twig', [
            'cubeTypeForm' => $cubeTypeForm,
        ]);
    }

    #[Route('/game/scramble', name: 'app_game_scramble', methods: ['POST'], format: 'json')]
    public function scramble(
        Request $request,
        EntityManagerInterface $entityManager,
        ScrambleMoveService $scrambleMoveService,
        FormFactoryInterface $formFactory,
        LoggerInterface $logger,
    ): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // read JSON content from request
        $content = json_decode($request->getContent(), true);

        if (!$content || !isset($content['cube_form']['type'])) {
            return new JsonResponse(['isOk' => false, 'message' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $wantedCubeType = $content['cube_form']['type'];
        $csrfToken = $content['_token'];

        // Check CSRF Token
        if (!$this->isCsrfTokenValid('cube_form', $csrfToken)) {
            return new JsonResponse(['isOk' => false, 'message' => 'Invalid CSRF token'], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Convert wanted cube type (string) to a CubeType instance
            $cubeType = CubeType::from($wantedCubeType);
        } catch (\ValueError $e) {
            return new JsonResponse(['isOk' => false, 'message' => 'Invalid cube type'], Response::HTTP_BAD_REQUEST);
        }

        try{
            $scrambleMove = $scrambleMoveService->getNextScrambleMove($cubeType);

            // Create chrono
            $chrono = new Chrono();
            $chrono->setCubeType($cubeType);
            $chrono->setScrambleMove($scrambleMove);
            $chrono->setUser($this->getUser());

            // Save scrambleMove in db
            $entityManager->persist($scrambleMove);
            // $entityManager->persist($chrono);
            $entityManager->flush();
        } catch (\Exception $e) {
            $logger->warning('Problème pendant la récupération d\'un mélange !');
            $logger->error($e->getMessage());
            return new JsonResponse(['isOk' => false, 'message' => 'Un problème est survenu !'], Response::HTTP_BAD_REQUEST);
        }

        // Create needed forms for view
        $cubeTypeForm = $formFactory->create(CubeFormType::class, [
            'type' => $cubeType,
        ]);
        $chronoForm = $this->createForm(ChronoType::class, $chrono, [
            'action' => $this->generateUrl('app_game_chrono'),
        ]);

        // Check if user is using a touch screen
        $isUsingTouchScreen = $content['isUsingTouchScreen'] ?? false;

        // Render partial HTML template
        $view = $this->renderView('layout/game/_game-interface.html.twig', [
            'cubeTypeForm' => $cubeTypeForm,
            'scrambleMoves' => $scrambleMove->getMoves(),
            'chronoForm' => $chronoForm,
            'isUsingTouchScreen' => $isUsingTouchScreen,
        ]);

        return new JsonResponse([
            'isOk' => true,
            'render' => $view,
        ]);
    }

    #[Route('/game/chrono', name: 'app_game_chrono', methods: ['POST'])]
    public function recordChrono(
        Request $request,
    ): Response
    {
        return $this->render('game/chrono.html.twig', [
        ]);
    }
}
