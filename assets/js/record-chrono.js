document.addEventListener('DOMContentLoaded', () => {
    const spinningLoader = document.querySelector('#loader');

    let chronoSubmitBtn;
    document.addEventListener('click', async (event) => {
        if (event.target.matches('#chrono_submit')) {
            chronoSubmitBtn = document.querySelector('#chrono_submit');
            chronoSubmitBtn.disabled = true;

            event.preventDefault();

            const cubeType = document.querySelector('#chrono_cubeType').value;
            const actualRecordsDiv = document.querySelector(`.session-records[data-cube-type="${cubeType}"]`);

            const newChronoDiv = document.createElement('DIV');
            newChronoDiv.classList.add('session-record');
            newChronoDiv.dataset.value = document.querySelector('#chrono_duration').value;
            newChronoDiv.innerHTML = document.querySelector('#readable-duration').innerHTML;
            actualRecordsDiv.appendChild(newChronoDiv);

            /** @Todo Vérifier si le nouveau chrono est meilleur que le siteRecord et le personalBest (début de réfexion ci-dessous) */
            // let bestRecDiv, worstRecDiv;
            // console.log(bestRecDiv);

            // Array.from(actualRecordsDiv).sort(function (a, b) { return parseInt(a.getAttribute('data-value'), 10) - parseInt(b.getAttribute('data-value'), 10); })
            // console.log(actualRecordsDiv);
            // Array.from(actualRecordsDiv).forEach(recordDiv => {
            //     // if ()
            // });

            /** @Todo si plus de 2 chronos de session (même cubeType) ajout css class green au meileur */
            /** @Todo si plus de 3 chronos de session (même cubeType) ajout css class red au pire */

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
                    document.querySelector('#chrono-form-container').classList.add('hidden');
                    chronoSubmitBtn.classList.add('hidden');
                } else {
                    /** @todo afficher un message explicatif à l'utilisateur */
                    console.error('Erreur dans la réponse du serveur:', json.message);
                    chronoSubmitBtn.disabled = false;
                }
            } catch (error) {
                /** @todo afficher un message explicatif à l'utilisateur */
                console.error('Une erreur est survenue lors de la requête:', error);
                chronoSubmitBtn.disabled = false;
            }
            spinningLoader.classList.add('hidden');
        }
    });
});


