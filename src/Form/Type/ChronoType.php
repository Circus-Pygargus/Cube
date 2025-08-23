<?php

namespace App\Form\Type;

use App\Enum\CubeType;
use App\Entity\Chrono;
use App\Entity\ScrambleMove;
use App\Form\DataTransformer\StringToCubeTypeTransformer;
use App\Form\DataTransformer\StringToScrambleMoveTransformer;
use App\Repository\ScrambleMoveRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class ChronoType extends AbstractType
{
    public function __construct(
        private ScrambleMoveRepository $scrambleMoveRepository,
    )
    {

    }
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
                'row_attr' => [
                    'class' => 'hidden',
                ],
            ])
            ->add('comment', TextareaType::class, [
                'label' => 'Commentaire',
                'required' => false,
                'trim' => true,
            ])
            ->add('cubeType', HiddenType::class, [
                'required' => true,
            ])
            ->add('scrambleMove', HiddenType::class, [
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Enregistrer',
            ])
            ;

        $builder->get('cubeType')
                ->addModelTransformer(new StringToCubeTypeTransformer());

        $builder->get('scrambleMove')
                ->addModelTransformer(new StringToScrambleMoveTransformer($this->scrambleMoveRepository));
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Chrono::class,
            // 'cubeTypeValue' => null,
            'action' => null,
            'method' => 'POST',
        ]);
    }
}
