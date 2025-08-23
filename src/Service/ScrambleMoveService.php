<?php

namespace App\Service;

use App\Enum\CubeType;
use App\Entity\ScrambleMove;
use App\Repository\ScrambleMoveRepository;

class ScrambleMoveService
{
    public function __construct(
        private ScrambleMoveRepository $scrambleMoveRepository,
        private ScramblerService $scramblerService,
    )
    {
    }

    public function getNextScrambleMove(
        CubeType $cubeType,
    ): ScrambleMove
    {
        $unresolvedScramble = $this->scrambleMoveRepository->findFirstUnresolvedByCubeTypeOrNull($cubeType);
        if ($unresolvedScramble !== Null) {
            $result = $unresolvedScramble;
        } else {
            $result = $this->buildNewScrambleMove($cubeType);
        }

        return $result;
    }

    private function buildNewScrambleMove(
        CubeType $cubeType,
    ): ScrambleMove
    {
        // Generate a new scramble
        $moves = $this->scramblerService->generateScramble($cubeType);

        // Create scrambleMove
        $scrambleMove = new ScrambleMove();
        $scrambleMove->setCubeType($cubeType);
        $scrambleMove->setMoves($moves);

        return $scrambleMove;
    }
}
