document.addEventListener('DOMContentLoaded', () => {
    const spinningLoader = document.querySelector('#loader');

    const chronoSubmitBtn = document.querySelector('#chrono_submit');
    if (chronoSubmitBtn) {
        chronoSubmitBtn.addEventListener('click', async (event) => {
            chronoSubmitBtn.disabled = true;
            event.preventDefault();
            const cubeType = document.querySelector('#chrono_cubeType').value;
            const actualRecordsDiv = document.querySelector(`.session-records[data-cube-type="${cubeType}"]`);

            const newChronoDiv = document.createElement('DIV');
            newChronoDiv.classList.add('session-record');
            newChronoDiv.dataset.value = document.querySelector('#chrono_duration').value;
            newChronoDiv.innerHTML = document.querySelector('#readable-duration').innerHTML;
            actualRecordsDiv.appendChild(newChronoDiv);

            const chronoForm = document.querySelector('form[name="chrono"]');
            const formData = new FormData(chronoForm);

            try {
                spinningLoader.classList.remove('hidden');
                const response = await fetch('/game/chrono/record', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();
                if (json.isOk === true) {
                    const msgDiv = document.querySelector('#record-msg');
                    msgDiv.innerHTML = json.message;
                } else {
                    /** @todo afficher un message explicatif à l'utilisateur */
                    console.error('Erreur dans la réponse du serveur:', json.message);
                }
            } catch (error) {
                /** @todo afficher un message explicatif à l'utilisateur */
                console.error('Une erreur est survenue lors de la requête:', error);
            }
            spinningLoader.classList.add('hidden');
            chronoSubmitBtn.disabled = false;
        });
    }
});

