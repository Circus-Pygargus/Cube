<?php

namespace App\Controller;

use App\CubeType\CubeType;
use App\Entity\ScrambleMove;
use App\Form\Type\CubeFormType;
use App\Service\ScramblerService;
use Doctrine\ORM\EntityManagerInterface;
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
        ScramblerService $scramblerService,
        FormFactoryInterface $formFactory,
    ): JsonResponse {
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

        // Generate a new scramble scramble
        $moves = $scramblerService->generateScramble($cubeType);

        // Create and save scrambleMove
        $scrambleMove = new ScrambleMove();
        $scrambleMove->setCubeType($cubeType);
        $scrambleMove->setMoves($moves);
        $entityManager->persist($scrambleMove);
        $entityManager->flush();

        $cubeTypeForm = $formFactory->create(CubeFormType::class, [
            'type' => $cubeType,
        ]);

        // Render partial HTML template
        $view = $this->renderView('layout/game/_game-interface.html.twig', [
            'cubeTypeForm' => $cubeTypeForm,
            'scrambleMoves' => $moves,
        ]);

        return new JsonResponse([
            'isOk' => true,
            'render' => $view,
        ]);
    }
}
