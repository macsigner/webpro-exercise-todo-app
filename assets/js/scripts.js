'use strict';

const nlModeToggles = document.querySelectorAll('[data-mode-switch]');

nlModeToggles.forEach(el => el.addEventListener('click', e => {
    document.documentElement.classList.toggle('dark-mode');
}));

const nlDeleteTodoItem = document.querySelectorAll('[data-todo-item-delete]');

nlDeleteTodoItem.forEach(el => el.addEventListener('click', e => {
    e.preventDefault();

    e.target.closest('.todo-item').remove();
}));
