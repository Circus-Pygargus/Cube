document.addEventListener('DOMContentLoaded', () => {
    const gameInterfaceDiv = document.querySelector('#game-interface');
    const spinningLoader = document.querySelector('#loader');

    let isTouchScreen;

    gameInterfaceDiv.addEventListener('touchstart', screenTouched);

    // Events delegation management
    gameInterfaceDiv.addEventListener('click', async (event) => {
        if (isTouchScreen === undefined) {
            isTouchScreen = false;
            gameInterfaceDiv.removeEventListener('touchstart', screenTouched);
        }

        if (event.target.matches('#cube-scramble')) {
            event.preventDefault();

            const cubeForm = document.querySelector('#cube_form');
            const cubeFormTypeSelect = cubeForm.querySelector('select#cube_form_type');
            const selectedCubeType = cubeFormTypeSelect.value;

            // Absolutely not needed !
            if (isTouchScreen) {
                const isTouchScreenSelect = cubeForm.querySelector('input#cube_form_isUsingTouchScreen');
                isTouchScreenSelect.checked = true;
            }

            if (selectedCubeType === '') {
                /** @todo Afficher un message explicatif à l'utilisateur */
                return;
            }

            const token = cubeForm.querySelector('input[name="cube_form[_token]"]').value;

            const data = {
                'cube_form': {
                    'type': selectedCubeType,
                },
                'isUsingTouchScreen': isTouchScreen,
                '_token': token
            };

            try {
                spinningLoader.classList.remove('hidden');
                const response = await fetch('/game/scramble', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();
                if (json.isOk === true) {
                    gameInterfaceDiv.innerHTML = json.render;
                    spinningLoader.classList.add('hidden');
                } else {
                    /** @todo afficher un message explicatif à l'utilisateur */
                    console.error('Erreur dans la réponse du serveur:', json.message);
                }
            } catch (error) {
                /** @todo afficher un message explicatif à l'utilisateur */
                console.error('Une erreur est survenue lors de la requête:', error);
            }
        }
    });


    function screenTouched(event) {
        isTouchScreen = true;
        gameInterfaceDiv.removeEventListener('touchstart', screenTouched);
    }
});
