'use strict';

import TodoMenu from './modules/TodoMenu.js';

const nlTodoList = document.querySelectorAll('[data-todo-app=menu]');

nlTodoList.forEach(el => new TodoMenu(el));

const nlModeToggles = document.querySelectorAll('[data-mode-switch]');

nlModeToggles.forEach(el => el.addEventListener('click', e => {
    document.documentElement.classList.toggle('switch-mode');
}));
