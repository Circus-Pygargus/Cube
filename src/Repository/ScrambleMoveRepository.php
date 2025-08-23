<?php

namespace App\Repository;

use App\Enum\CubeType;
use App\Entity\Chrono;
use App\Entity\ScrambleMove;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @extends ServiceEntityRepository<ScrambleMove>
 */
class ScrambleMoveRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        private Security $security,
        private LoggerInterface $logger,
    )
    {
        parent::__construct($registry, ScrambleMove::class);
    }

    public function findFirstUnresolvedByCubeTypeOrNull(
        CubeType $cubeType,
    )
    {
        try {
            $qb = $this->createQueryBuilder('s')
                ->where('s.cubeType = :cubeType');

            $subQuery = $this->createQueryBuilder('sub')
                ->select('1')
                ->from(Chrono::class, 'c')
                ->where('c.scrambleMove = s.id')
                ->andWhere('c.user = :user');

            $qb->andWhere(
                $qb->expr()->not(
                    $qb->expr()->exists($subQuery->getDQL())
                )
            )
                ->setParameter('cubeType', $cubeType->value)
                ->setParameter('user', $this->security->getUser())
                ->orderBy('s.createdAt', 'ASC')
                ->setMaxResults(1);

            return $qb->getQuery()->getOneOrNullResult();
        } catch (\Exception $e) {
            $this->logger->warning('Problème pendant la récupération d\'un mélange en bdd !');
            $this->logger->error($e->getMessage());
            return null;
        }
    }

    public function findOneByMovesAsString(string $moves): ?ScrambleMove
    {
        $movesArray = explode(' ', trim($moves));

        return $this->createQueryBuilder('sm')
            ->where('sm.moves = :moves')
            ->setParameter('moves', json_encode($movesArray))
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return ScrambleMove[] Returns an array of ScrambleMove objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ScrambleMove
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
