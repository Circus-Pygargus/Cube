document.addEventListener('DOMContentLoaded', () => {

    const chronoSubmitBtn = document.querySelector('#chrono_submit');
    if (chronoSubmitBtn) {
        chronoSubmitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const cubeType = document.querySelector('#chrono_cubeType').value;
            const actualRecordsDiv = document.querySelector(`.session-records[data-cube-type="${cubeType}"]`);

            const newChronoDiv = document.createElement('DIV');
            newChronoDiv.classList.add('session-record');
            newChronoDiv.dataset.value = document.querySelector('#chrono_duration').value;
            newChronoDiv.innerHTML = document.querySelector('#readable-duration').innerHTML;
            actualRecordsDiv.appendChild(newChronoDiv);
        });
    }
});
