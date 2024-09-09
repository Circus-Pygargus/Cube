<?php

namespace App\Service;

use App\CubeType\CubeType;
use RobinIngelbrecht\TwistyPuzzleScrambler\RandomScramble;

class ScramblerService
{
    /**
     * Use library to generate a scramble according to given CubeType
     *
     * @param CubeType $cubeType
     * @return array
     */
    public function generateScramble(CubeType $cubeType): array
    {
        // Map cube types to scrambler methods
        $scramblerMethods = [
            CubeType::CUBE_2X2->value => 'twoByTwo',
            CubeType::CUBE_3X3->value => 'threeByThree',
            CubeType::CUBE_4X4->value => 'FourByFour',
            CubeType::CUBE_5X5->value => 'fiveByFive',
            CubeType::CUBE_6X6->value => 'sixBySix',
            CubeType::CUBE_7X7->value => 'sevenBySeven',
        ];

        // Check method exist for asked cube type
        if (!array_key_exists($cubeType->value, $scramblerMethods)) {
            throw new \InvalidArgumentException('Scrambler method not found for cube type : ' . $cubeType->value);
        }

        // Call scrambler's method
        $scrambleMethod = $scramblerMethods[$cubeType->value];
        $scramble = RandomScramble::$scrambleMethod();

        // Extract scramble moves
        $moves = [];
        foreach ($scramble->getTurns() as $turn) {
            $moves[] = $turn->getNotation();
        }

        return $moves;
    }
}
