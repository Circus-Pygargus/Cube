document.addEventListener('DOMContentLoaded', () => {
    const collapsables = document.querySelectorAll('.collapsable');

    if (collapsables) {
        const collapsableTriggers = document.querySelectorAll('.collapsable-trigger');
        Array.from(collapsableTriggers).forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.target.nextElementSibling.classList.toggle('collapse');
            });
        });
    }
});