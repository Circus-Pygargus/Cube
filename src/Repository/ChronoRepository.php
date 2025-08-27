<?php

namespace App\Repository;

use App\Entity\Chrono;
use App\Enum\CubeType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @extends ServiceEntityRepository<Chrono>
 */
class ChronoRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,        
        private Security $security,
    )
    {
        parent::__construct($registry, Chrono::class);
    }

    public function findSiteRecordByCubeType(CubeType $cubeType): ?Chrono
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.cubeType = :cubeType')
            ->setParameter('cubeType', $cubeType->value)
            ->orderBy('c.duration', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findPersonalBestByCubeType(CubeType $cubeType): ?Chrono
    {
        return $this->createQuerybuilder('c')
            ->andWhere('c.cubeType = :cubeType')
            ->andWhere('c.user = :user')
            ->orderBy('c.duration', 'ASC')
            ->setParameter('cubeType', $cubeType)
            ->setParameter('user', $this->security->getUser())
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return Chrono[] Returns an array of Chrono objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Chrono
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
