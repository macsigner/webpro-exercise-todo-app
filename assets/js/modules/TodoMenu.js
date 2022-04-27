import BaseModule from './BaseModule.js';

class TodoMenu extends BaseModule {
    constructor(el) {
        super();

        this.el = el;
        this.menu = this.el.querySelector('[data-todo-list]');
        this.todoList = this.menu;
        this.itemTemplate = this._getTemplate();
        this.menu.addEventListener('itemsReady', this._buildMenu.bind(this));

        this.form = this.el.querySelector('[data-todo-form]');
        this.form.addEventListener('submit', this._todoFormListener.bind(this));

        this._readItems();
    }

    add(obj) {
        this._createItem(obj);
    }

    remove(task) {

    }

    clear(callback) {

    }

    filter(fn) {

    }

    _todoItemDeleteClickListener(e) {
        e.preventDefault();

        e.target.closest('.todo-item').remove();
    }

    _todoFormListener(e) {
        e.preventDefault();

        let todo = {
            state: 'active',
        }

        let formData = new FormData(this.form);

        for (let entry of formData.entries()) {
            todo[entry[0]] = entry[1];
            formData.delete(entry[0]);
        }

        this.add(todo);

        this.form.reset();
    }

    _getTemplate() {
        let template = this.menu.querySelector('#todo-item-template');
        template.remove();

        return document.importNode(template.content, true);
    }

    _clickListener() {
    }

    _createItem(item) {
        let todo = document.importNode(this.itemTemplate, true);

        todo.querySelector('.todo-item__text').innerHTML = item.task;
        todo.querySelector('input[type=checkbox]').checked = item.state === 'complete';

        let todoDelete = todo.querySelector('[data-todo-item-delete]');
        todoDelete.addEventListener('click', this._todoItemDeleteClickListener.bind(this));

        this.todoList.appendChild(todo);
    }

    _readItems() {
        fetch('./assets/data/todos.json')
            .then(this._parseResponse.bind(this))
            .then(this._setTodos.bind(this));
    }

    _parseResponse(response) {
        return response.json();
    }

    _setTodos(data) {
        this.todos = data;

        this.menu.dispatchEvent(new CustomEvent('itemsReady', {
            detail: {
                TodoMenu: this,
            },
        }));
    }

    _buildMenu() {
        Object.keys(this.todos).forEach(key => {
            this._createItem(this.todos[key]);
        });
    }
}

export default TodoMenu;
