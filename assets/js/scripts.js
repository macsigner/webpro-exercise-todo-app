'use strict';

const deleteItem = function(e) {
    e.preventDefault();

    e.target.closest('.todo-item').remove();
}

let itemId = 10;
const addTodoItem = function(el) {
    let todoList = document.querySelector('.app-container > ul');

    let todoItem = document.createElement('li');

    todoItem.innerHTML = `<li class="todo-item">
                          <input class="todo-item__checkbox" type="checkbox" id="todo-item-id-${itemId}">
                          <label for="todo-item-id-${itemId}" class="todo-item__label">
                          ${el.value}
                          <span class="todo-item__actions"> <button class="todo-item__delete" data-todo-item-delete="">Delete</button></span>
                          </label>
                          </li>`

    itemId++;

    el.value = '';
    todoItem.querySelector('[data-todo-item-delete]').addEventListener('click', deleteItem);
    todoList.appendChild(todoItem);
}

const nlModeToggles = document.querySelectorAll('[data-mode-switch]');

nlModeToggles.forEach(el => el.addEventListener('click', e => {
    document.documentElement.classList.toggle('switch-mode');
}));

const nlDeleteTodoItem = document.querySelectorAll('[data-todo-item-delete]');

nlDeleteTodoItem.forEach(el => el.addEventListener('click', deleteItem));

const elTodoItemAdd = document.querySelector('[data-todo-item-add]');

if (elTodoItemAdd) {
    elTodoItemAdd.addEventListener('keyup', e => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            addTodoItem(e.target);
        }
    })
}
