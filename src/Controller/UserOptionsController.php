<?php

namespace App\Controller;

use App\Entity\UserOptions;
use App\Repository\UserOptionsRepository;
use App\Form\Type\UserOptionsType;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserOptionsController extends AbstractController
{
    #[Route('/user/options', name: 'app_user_options')]
    public function index(
        Request $request,
        UserOptionsRepository $userOptionsRepository,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger,
    ): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $userOptions = $userOptionsRepository->findOneBy(['user' => $this->getUser()]) ?? new UserOptions();
        $userOptionsForm = $this->createForm(UserOptionsType::class, $userOptions);
        $userOptionsForm->handleRequest($request);

        if ($userOptionsForm->isSubmitted()) {
            if ($userOptionsForm->isValid()) {
                try {
                    if ($userOptions->getUser() === null) {
                        $userOptions->setUser($this->getUser());
                    }
                    $entityManager->persist($userOptions);
                    $entityManager->flush();
                    /** @todo informer l'utilisateur que ses options sont enregistrées (une seule pour l'instant ...)(flashMessage ?)*/
                } catch (\Exception $e) {
                    $logger->warning('Problème pendant la sauvegarde des options !');
                    $logger->error($e->getMessage());
                    /** @todo donner l'info au user !! */
                }

                return $this->redirectToRoute('app_home');
            }
        }

        return $this->render('options/index.html.twig', [
            'userOptionsForm' => $userOptionsForm,
        ]);
    }
}