<?php

namespace App\Form\Type;

use App\CubeType\CubeType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\FormBuilderInterface;

class CubeFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            -> add('type', EnumType::class, [
                'label' => 'Type de cube',
                'placeholder' => 'Choisis',
                'class' => CubeType::class,
                'choice_label' => fn (CubeType $choice) => $choice->value,
            ])
        ;
    }
}
