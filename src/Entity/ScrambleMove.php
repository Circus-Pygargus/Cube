<?php

namespace App\Entity;

use App\CubeType\CubeType;
use App\Repository\ScrambleMoveRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    /**
     * @var Collection<int, Chrono>
     */
    #[ORM\OneToMany(targetEntity: Chrono::class, mappedBy: 'scrambleMove', orphanRemoval: true)]
    private Collection $chronos;

    public function __construct()
    {
        $this->chronos = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Chrono>
     */
    public function getChronos(): Collection
    {
        return $this->chronos;
    }

    public function addChrono(Chrono $chrono): static
    {
        if (!$this->chronos->contains($chrono)) {
            $this->chronos->add($chrono);
            $chrono->setScrambleMove($this);
        }

        return $this;
    }

    public function removeChrono(Chrono $chrono): static
    {
        if ($this->chronos->removeElement($chrono)) {
            // set the owning side to null (unless already changed)
            if ($chrono->getScrambleMove() === $this) {
                $chrono->setScrambleMove(null);
            }
        }

        return $this;
    }

    public function __toString(): string
    {
        return implode(' ', $this->getMoves());
    }
}
