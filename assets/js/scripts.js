'use strict';

const nlModeToggles = document.querySelectorAll('[data-mode-switch]');

nlModeToggles.forEach(el => el.addEventListener('click', e => {
    document.documentElement.classList.toggle('dark-mode');
}));
