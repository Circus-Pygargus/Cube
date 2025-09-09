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

            if (!actualRecordsDiv.hasChildNodes()) {
                actualRecordsDiv.innerHTML = 'Session';
            }

            const newChronoValue = parseInt(document.querySelector('#chrono_duration').value);
            const newreadableChrono = document.querySelector('#readable-duration').innerHTML;
            const newChronoDiv = document.createElement('DIV');
            newChronoDiv.classList.add('session-record');
            newChronoDiv.dataset.value = newChronoValue;
            newChronoDiv.innerHTML = newreadableChrono;
            actualRecordsDiv.appendChild(newChronoDiv);

            // apply whitish color to old records if beaten
            const siteRecordDiv = actualRecordsDiv.parentElement.querySelector('.site-record');
            const personalBestDiv = actualRecordsDiv.parentElement.querySelector('.personal-best');
            if (newChronoValue < siteRecordDiv.dataset.value) {
                siteRecordDiv.dataset.value = newChronoValue;
                siteRecordDiv.innerHTML = newreadableChrono;
                siteRecordDiv.classList.add('whitish');
            }
            if (newChronoValue < personalBestDiv.dataset.value) {
                personalBestDiv.dataset.value = newChronoValue;
                personalBestDiv.innerHTML = newreadableChrono;
                personalBestDiv.classList.add('whitish');
            }

            // Apply green or red color to best and worst session chronos if enough chronos
            const recordsDivs = Array.from(actualRecordsDiv.children).sort(function (a, b) { return parseInt(a.getAttribute('data-value'), 10) - parseInt(b.getAttribute('data-value'), 10); })
            recordsDivs.forEach(recordDiv => {
                recordDiv.classList.remove('green', 'red');
            });
            if (recordsDivs.length >= 3) {
                recordsDivs[0].classList.add('green');
                recordsDivs[recordsDivs.length - 1].classList.add('red');
            } else if (recordsDivs.length >= 2) {
                recordsDivs[0].classList.add('green');
            }

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


