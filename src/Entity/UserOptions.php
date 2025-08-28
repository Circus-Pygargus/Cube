<?php

namespace App\Entity;

use App\Repository\UserOptionsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserOptionsRepository::class)]
class UserOptions
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'userOptions', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;


    #[ORM\Column(type: Types::BOOLEAN, nullable: false, options: ['default' => false])]
    private ?bool $displaySiteRecords = null;
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function isDisplaySiteRecords(): ?bool
    {
        return $this->displaySiteRecords;
    }

    public function setDisplaySiteRecords(bool $displaySiteRecords): static
    {
        $this->displaySiteRecords = $displaySiteRecords;

        return $this;
    }
}
