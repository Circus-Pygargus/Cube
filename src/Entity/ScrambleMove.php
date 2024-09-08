<?php

namespace App\Entity;

use App\CubeType\CubeType;
use App\Repository\ScrambleMoveRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

#[ORM\Entity(repositoryClass: ScrambleMoveRepository::class)]
class ScrambleMove
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?CubeType $cubeType = null;

    /**
     * @var list<string> The moves used to scramble the cube
     */
    #[ORM\Column]
    private array $moves = [];

    /**
     * @var \DateTimeImmutable|null The creation datetime
     */
    #[Gedmo\Timestampable(on: 'create')]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCubeType(): ?CubeType
    {
        return $this->cubeType;
    }

    public function setCubeType(CubeType $cubeType): static
    {
        $this->cubeType = $cubeType;

        return $this;
    }

    public function getMoves(): array
    {
        return $this->moves;
    }

    public function setMoves(array $moves): static
    {
        $this->moves = $moves;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }
}
