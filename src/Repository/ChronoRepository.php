<?php

namespace App\Repository;

use App\Entity\Chrono;
use App\Entity\User;
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

    public function findUserChronoStatsByCubeType(User $user, CubeType $cubeType): array
    {
        // Yearly data
        $yearlyResults = $this->createQueryBuilder('c')
            ->select('YEAR(c.createdAt) AS year')
            ->addSelect('COUNT(c.id) AS totalYearlyResolutions')
            ->addSelect('MIN(c.duration) AS bestTime')
            ->addSelect('MAX(c.duration) AS worstTime')
            ->addSelect('AVG(c.duration) AS avgTime')
            ->andWhere('c.cubeType = :cubeType')
            ->andWhere('c.user = :user')
            ->setParameter('cubeType', $cubeType->value)
            ->setParameter('user', $user)
            ->groupBy('year')
            ->getQuery()
            ->getResult();

        $yearlyData = [];
        foreach ($yearlyResults as $row) {
            $yearlyData[$row['year']] = [
                'nbChronos' => $row['totalYearlyResolutions'],
                'bestTime' => $row['bestTime'],
                'worstTime' => $row['worstTime'],
                'avgTime' => round($row['avgTime']),
            ];
        }

        // Monthly data
        $monthlyResults = $this->createQueryBuilder('c')
            ->select('YEAR(c.createdAt) AS year')
            ->addSelect('MONTH(c.createdAt) AS month')
            ->addSelect('COUNT(c.id) AS nbChronos')
            ->addSelect('MIN(c.duration) AS bestTime')
            ->addSelect('MAX(c.duration) AS worstTime')
            ->addSelect('AVG(c.duration) AS avgTime')
            ->andWhere('c.cubeType = :cubeType')
            ->andWhere('c.user = :user')
            ->setParameter('cubeType', $cubeType->value)
            ->setParameter('user', $user)
            ->groupBy('year', 'month')
            ->orderBy('year', 'ASC')
            ->orderBy('month', 'ASC')
            ->getQuery()
            ->getResult();

        // Fusion
        $return = [];

        foreach ($monthlyResults as $row) {
            $year = $row['year'];
            if (!isset($return[$year])) {
                $return[$year] = $yearlyData[$year];
                $return[$year]['months'] = [];
            }
            // Only pick up wanted data, no need to repeat years
            $return[$year]['months'][] = [
                'month' => $row['month'],
                'nbChronos' => $row['nbChronos'],
                'bestTime' => $row['bestTime'],
                'worstTime' => $row['worstTime'],
                'avgTime' => round($row['avgTime']),
            ];
        }   

        return $return;
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
