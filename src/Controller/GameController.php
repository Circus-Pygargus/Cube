<?php

namespace App\Controller;

use App\Form\Type\CubeFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
}
