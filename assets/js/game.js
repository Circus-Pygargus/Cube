document.addEventListener('DOMContentLoaded', () => {
    const gameInterfaceDiv = document.querySelector('#game-interface');

    // Events delegation management
    gameInterfaceDiv.addEventListener('click', async (event) => {
        if (event.target.matches('#cube-scramble')) {
            event.preventDefault();

            const cubeForm = document.querySelector('#cube_form');
            const cubeFormTypeSelect = cubeForm.querySelector('select#cube_form_type');
            const selectedCubeType = cubeFormTypeSelect.value;

            if (selectedCubeType === '') {
                /** @todo Afficher un message explicatif à l'utilisateur */
                return;
            }

            const token = cubeForm.querySelector('input[name="cube_form[_token]"]').value;

            const data = {
                'cube_form': {
                    'type': selectedCubeType,
                },
                '_token': token
            };

            try {
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
                } else {
                    /** @todo afficher un message explicatif à l'utilisateur */
                    console.error('Erreur dans la réponse du serveur:', json.message);
                }
            } catch (error) {
                /** @todo afficher un message explicatif à l'utilisateur */
                console.error('Une erreur est survenue lors de la requête:', error);
            }
        }
    })
});
