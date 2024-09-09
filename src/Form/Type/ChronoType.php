<?php

namespace App\Form\Type;

use App\CubeType\CubeType;
use App\Entity\Chrono;
use App\Entity\ScrambleMove;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class ChronoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('duration', IntegerType::class, [
                'required' => true,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Tu ne peux pas enregistrer un temps vide ...',
                    ]),
                ],
                'row_attr' => ['class' => 'hidden'],
            ])
            ->add('comment', TextareaType::class, [
                'label' => 'Commentaire',
                'required' => false,
                'trim' => true,
                'row_attr' => ['class' => 'hidden'],
            ])
            ->add('cubeType', EnumType::class, [
                'class' => CubeType::class,
                'required' => true,
                'disabled' => true,
                'row_attr' => ['class' => 'hidden'],
            ])
            ->add('scrambleMove', EntityType::class, [
                'class' => ScrambleMove::class,
                'required' => true,
                'disabled' => true,
                'row_attr' => ['class' => 'hidden'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Chrono::class
        ]);
    }
}
