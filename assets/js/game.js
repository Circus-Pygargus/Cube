import './collapsable.js';
import './record-chrono.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameInterfaceDiv = document.querySelector('#game-interface');
    const spinningLoader = document.querySelector('#loader');
    const chronoSubmitBtn = document.querySelector('#chrono_submit');

    let isTouchScreen;

    let canUseChrono = false;
    let isLeftButtonPressed = false;
    let isRightButtonPressed = false;
    let timer;
    let isChronoReadytoBegin = false;
    let isChronoRunning = false;
    let interval;
    let duration;

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
                    canUseChrono = true;
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

    document.addEventListener('keydown', (event) => {
        if (canUseChrono) {
            if (event.code === 'ControlLeft' && isLeftButtonPressed === false) {
                isLeftButtonPressed = true;
                checkForBothBtns();
            } else if (event.code === 'ControlRight' && isRightButtonPressed === false) {
                isRightButtonPressed = true;
                checkForBothBtns();
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (canUseChrono) {
            if (event.code === 'ControlLeft') {
                const circle = document.querySelector("#timer-circle");
                circle.classList.remove('filling');
                isLeftButtonPressed = false;
                if (isChronoReadytoBegin) {
                    isChronoReadytoBegin = false;
                    startChrono();
                }
            } else if (event.code === 'ControlRight') {
                const circle = document.querySelector("#timer-circle");
                circle.classList.remove('filling');
                isRightButtonPressed = false;
                if (isChronoReadytoBegin) {
                    isChronoReadytoBegin = false;
                    startChrono();
                }
            }
        }
    });

    gameInterfaceDiv.addEventListener('touchstart', (event) => {
        if (canUseChrono) {
            if (event.target && event.target.matches('#chrono-btn-1') && isLeftButtonPressed === false) {
                isLeftButtonPressed = true;
                checkForBothBtns();
            } else if (event.target && event.target.matches('#chrono-btn-2') && isRightButtonPressed === false) {
                isRightButtonPressed = true;
                checkForBothBtns();
            }
        }
    });

    gameInterfaceDiv.addEventListener('touchend', (event) => {
        if (canUseChrono) {
            if (event.target && event.target.matches('#chrono-btn-1')) {
                const circle = document.querySelector("#timer-circle");
                circle.classList.remove('filling');
                isLeftButtonPressed = false;
                if (isChronoReadytoBegin) {
                    isChronoReadytoBegin = false;
                    startChrono();
                }
            } else if (event.target && event.target.matches('#chrono-btn-2')) {
                const circle = document.querySelector("#timer-circle");
                circle.classList.remove('filling');
                isRightButtonPressed = false;
                if (isChronoReadytoBegin) {
                    isChronoReadytoBegin = false;
                    startChrono();
                }
            }
        }
    });

    function screenTouched(event) {
        isTouchScreen = true;
        gameInterfaceDiv.removeEventListener('touchstart', screenTouched);
    }

    function checkForBothBtns() {
        const scrambleContainer = document.querySelector('#scramble-moves');
        const circle = document.querySelector("#timer-circle");
        scrambleContainer.classList.add('hidden');
        if (!isChronoRunning) {
            circle.classList.remove('hidden');
        }
        if (isLeftButtonPressed && isRightButtonPressed) {
            if (isChronoRunning) {
                stopChrono();
            } else {
                circle.classList.add('filling');
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (isLeftButtonPressed && isRightButtonPressed) {
                        isChronoReadytoBegin = true;
                        circle.querySelector('#go-text').classList.remove('hidden');
                    }
                }, 500);
            }
        }
    }

    function startChrono() {
        document.querySelector('#chrono-start-hint').classList.add('hidden');
        document.querySelector('#chrono-stop-hint').classList.remove('hidden');
        const clockContainer = document.querySelector('#clock-container');
        const clock = clockContainer.querySelector('#clock');
        const circle = document.querySelector("#timer-circle");
        circle.classList.add('hidden');
        circle.querySelector('#go-text').classList.add('hidden');
        clockContainer.classList.remove('hidden');
        let startTime = Date.now();
        interval = setInterval(() => {
            let currentTime = Date.now();
            duration = currentTime - startTime;
            clock.innerHTML = formatChrono(duration);
        }, 1);
        isChronoRunning = true;
    }

    function stopChrono() {
        document.querySelector('#chrono-stop-hint').classList.add('hidden');
        clearInterval(interval);
        isChronoRunning = false;
        canUseChrono = false;
        document.querySelector('#chrono_duration').value = duration;
        document.querySelector('#readable-duration').innerHTML = formatChrono(duration);
        document.querySelector('#chrono-form-container').classList.remove('hidden');
        document.querySelector('#clock-container').classList.add('hidden');
        chronoSubmitBtn.classList.remove('hidden');
        chronoSubmitBtn.disabled = false;
    }

    function formatChrono(durationToFormat) {
        const hours = Math.floor(durationToFormat / 3600000);
        let remaining = durationToFormat - (hours * 3600000);
        const minutes = Math.floor(remaining / 60000);
        remaining = remaining - (minutes * 60000);
        const seconds = Math.floor(remaining / 1000);
        const millisecs = remaining - (seconds * 1000);

        const formattedMillisecs = String(millisecs).padStart(3, '0');
        let result = '';

        if (hours) {
            result += hours + ':';
            if (minutes < 10) {
                result += '0';
            }
        }
        if (minutes) {
            result += minutes + ':';
            if (seconds < 10) {
                result += '0';
            }
        }
        result += seconds + '.' + formattedMillisecs;

        return result;
    }
});
