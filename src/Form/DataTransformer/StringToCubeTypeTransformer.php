<?php

namespace App\Form\DataTransformer;

use App\Enum\CubeType;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class StringToCubeTypeTransformer implements DataTransformerInterface
{
    public function transform(mixed $cubeType): mixed
    {
        if (!$cubeType instanceof CubeType) {
            return null;
        }

        return $cubeType->value;
    }

    public function reverseTransform(mixed $cubeTypeString): mixed
    {
        if (!$cubeTypeString || !is_string($cubeTypeString)) {
            throw new TransformationFailedException('La chaîne cubeType est vide ou invalide.');
        }

        try {
            return CubeType::from($cubeTypeString);
        } catch (\ValueError $e) {
            throw new TransformationFailedException("'$cubeTypeString' n'est pas une valeur valide pour CubeType.");
        }
    }
}
