document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        // using closest() instead of matches() because of svg in #user-menu
        const trigger = event.target.closest('.collapsable-trigger');
        if (trigger) {
            trigger.nextElementSibling.classList.toggle('collapse');
        }
    });
});