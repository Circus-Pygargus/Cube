<?php

namespace App\Form\DataTransformer;

use App\Entity\ScrambleMove;
use App\Repository\ScrambleMoveRepository;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class StringToScrambleMoveTransformer implements DataTransformerInterface
{
    public function __construct(
        private ScrambleMoveRepository $scrambleMoveRepository,
    )
    {
    }

    public function transform(mixed $scrambleMove): ?string
    {
        if (!$scrambleMove instanceof ScrambleMove) {
            return null;
        }

        return implode(' ', $scrambleMove->getMoves());
    }

    public function reverseTransform(mixed $scrambleMovesString): ?ScrambleMove
    {
        if (!$scrambleMovesString || !is_string($scrambleMovesString)) {
            throw new TransformationFailedException('La chaîne scrambleMove est vide ou invalide.');
        }

        $scrambleMove = $this->scrambleMoveRepository->findOneByMovesAsString($scrambleMovesString);

        if (!$scrambleMove) {
            throw new TransformationFailedException('Aucun ScrambleMove correspondant n\'a été trouvé en base de données.');
        }

        return $scrambleMove;
    }
}
