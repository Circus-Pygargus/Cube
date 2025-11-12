<?php

namespace App\Controller;

use App\Enum\CubeType;
use App\Repository\ChronoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\EnumRequirement;

class PlayerStatsController extends AbstractController
{
    #[Route('/user-stats/{cubeType}', name: 'app_user_stats', requirements: ['cubeType' => new EnumRequirement(CubeType::class)])]
    public function index(
        ChronoRepository $chronoRepository,
        CubeType $cubeType = CubeType::CUBE_3X3,
    ):Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        
        $chronoStats = $chronoRepository->findUserChronoStatsByCubeType($this->getUser(), $cubeType);

        return $this->render('player-stats/index.html.twig', [
            'chronoStats' => $chronoStats,
            'chronoStatsJson' => json_encode($chronoStats, JSON_THROW_ON_ERROR | JSON_PRESERVE_ZERO_FRACTION),
        ]);
    }

    // #[Route('/user-stats/{cubeType}/{year}/{month}', name: 'app_user_stats_month', requirements: ['cubeType' => new EnumRequirement(CubeType::class), 'year' => '\d{4}', 'month' => '\d{1,2}'])]
    // public function userStatsByMonth(
    //     ChronoRepository $chronoRepository,
    //     CubeType $cubeType = CubeType::CUBE_3X3,
    //     int $year,
    //     int $month,
    // ):Response
    // {
    //     $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        
    //     $bestsChronos = $chronoRepository->findPersonalBestTimesByYears($cubeType);

    //     return $this->render('player-stats/index.html.twig', [
    //         'chronos' => $bestsChronos,
    //     ]);
    // }
    
    // #[Route('/user-stats/{cubeType}/{year}/{month}/{day}', name: 'app_user_stats_day', requirements: ['cubeType' => new EnumRequirement(CubeType::class), 'year' => '\d{4}', 'month' => '\d{1,2}', 'day' => '\d{1,2}'])]
    // public function userStatsByDay(
    //     ChronoRepository $chronoRepository,
    //     CubeType $cubeType = CubeType::CUBE_3X3,
    //     int $year,
    //     int $month,
    //     int $day,
    // ):Response
    // {
    //     $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        
    //     $bestsChronos = $chronoRepository->findPersonalBestTimesByYears($cubeType);

    //     return $this->render('player-stats/index.html.twig', [
    //         'chronos' => $bestsChronos,
    //     ]);
    // }
}