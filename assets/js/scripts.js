'use strict';

import TodoMenu from './modules/TodoMenu.js';

const nlTodoList = document.querySelectorAll('[data-todo-app=menu]');

nlTodoList.forEach(el => new TodoMenu(el));

const deleteItem = function(e) {
    e.preventDefault();

    e.target.closest('.todo-item').remove();
}

const nlModeToggles = document.querySelectorAll('[data-mode-switch]');

nlModeToggles.forEach(el => el.addEventListener('click', e => {
    document.documentElement.classList.toggle('switch-mode');
}));

const nlDeleteTodoItem = document.querySelectorAll('[data-todo-item-delete]');

nlDeleteTodoItem.forEach(el => el.addEventListener('click', deleteItem));
