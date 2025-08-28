<?php

namespace App\Service;

use App\Enum\CubeType;
use App\Repository\ChronoRepository;
use Symfony\Bundle\SecurityBundle\Security;

class ChronosService
{
    public function __construct(
        private ChronoRepository $chronoRepository,
        private Security $security,
    )
    {        
    }

    public function getBestChronos(): Array
    {
        $result = [];
        $cubeTypes = CubeType::getAsArray();
        $userOptions = null;
        if ($this->security->getUser()->getUserOptions()) {
            $userOptions = $this->security->getUser()->getUserOptions();
        }
        foreach (CubeType::cases() as $cubeType) {
            $cubeTypeResult = [
                'cubeType' => $cubeType->value,
                'personalBest' => $this->chronoRepository->findPersonalBestByCubeType($cubeType)
            ];
            // Default value for displaying site records is false, so only add them if user has already set option to true
            if ($userOptions !== null && $userOptions->isDisplaySiteRecords()) {
                $siteRecords = $this->chronoRepository->findSiteRecordByCubeType($cubeType);
                $cubeTypeResult['siteRecord'] = $siteRecords;
            }
            array_push($result, $cubeTypeResult);
        }

        return $result;
    }
}
