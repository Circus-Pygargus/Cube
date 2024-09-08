<?php

namespace App\Entity;

use App\CubeType\CubeType;
use App\Repository\ChronoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

#[ORM\Entity(repositoryClass: ChronoRepository::class)]
class Chrono
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $duration = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comment = null;

    #[ORM\Column(length: 255)]
    private ?CubeType $cubeType = null;

    #[ORM\ManyToOne(inversedBy: 'chronos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ScrambleMove $scrambleMove = null;

    #[ORM\ManyToOne(inversedBy: 'chronos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var \DateTimeImmutable|null The creation datetime
     */
    #[Gedmo\Timestampable(on: 'create')]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * @var \DateTimeMutable|null The update datetime
     */
    #[Gedmo\Timestampable(on: 'update')]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(?int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

        return $this;
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

    public function getScrambleMove(): ?ScrambleMove
    {
        return $this->scrambleMove;
    }

    public function setScrambleMove(?ScrambleMove $scrambleMove): static
    {
        $this->scrambleMove = $scrambleMove;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
