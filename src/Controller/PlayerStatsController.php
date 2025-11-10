<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PlayerStatsController extends AbstractController
{
    #[Route('/player-stats', name: 'app_player_stat')]
    #[Route('/player-stats/{year}', name: 'app_player_stat_year', requirements: ['year' => '\d{4}'])]
    #[Route('/player-stats/{year}/{month}', name: 'app_player_stat_month', requirements: ['year' => '\d{4}', 'month' => '\d{1,2}'])]
    #[Route('/player-stats/{year}/{month}/{day}', name: 'app_player_stat_day', requirements: ['year' => '\d{4}', 'month' => '\d{1,2}', 'day' => '\d{1,2}'])]
    public function index(
        int $year = null,
        int $month = null,
        int $day = null,
    ):Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        /* Par défaut, afficher les chronos par années,
            si enregistrement sur une seule année, afficher par mois
            si enregistrement sur un seul mois, afficher par jours
        */        

        return $this->render('player-stats/index.html.twig', [
        ]);
    }
}