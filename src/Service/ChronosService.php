<?php

namespace App\Service;

use App\Enum\CubeType;
use App\Repository\ChronoRepository;

class ChronosService
{
    public function __construct(
        private ChronoRepository $chronoRepository,
    )
    {        
    }

    public function getBestChronos(): Array
    {
        $result = [];
        $cubeTypes = CubeType::getAsArray();
        foreach (CubeType::cases() as $cubeType) {
            $cubeTypeResult = [
                'cubeType' => $cubeType->value,
                'siteRecord' => $this->chronoRepository->findSiteRecordByCubeType($cubeType),
                'personalBest' => $this->chronoRepository->findPersonalBestByCubeType($cubeType)
            ];
            array_push($result, $cubeTypeResult);
        }

        return $result;
    }
}
