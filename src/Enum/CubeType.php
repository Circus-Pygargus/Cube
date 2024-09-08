<?php

declare(strict_types=1);

namespace App\CubeType;

enum CubeType: string
{
    case CUBE_2X2 = "2x2";
    case CUBE_3X3 = '3x3';
    case CUBE_4X4 = '4x4';
    case CUBE_5X5 = '5x5';
    case CUBE_6X6 = '6x6';
    case CUBE_7X7 = '7x7';

    /**
     * Returns all accepted cube types as array
     *
     * @return array<string,string>
     */
    public static function getAsArray(): array
    {
        return array_reduce(
            self::cases(),
            static fn (array $choices, CubeType $type) => $choices + [$type->name => $type->value],
            [],
        );
    }
}
