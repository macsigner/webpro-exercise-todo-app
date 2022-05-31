import BaseModule from './BaseModule.js';

class TodoMenu extends BaseModule {
    constructor(el) {
        super();

        this.el = el;
        this.menu = this.el.querySelector('[data-todo-list]');
        this.todoList = this.menu;
        this.itemTemplate = this._getTemplate();
        this.menu.addEventListener('itemsReady', this.render.bind(this));

        this.form = this.el.querySelector('[data-todo-form]');
        this.form.addEventListener('submit', this._todoFormListener.bind(this));

        this._readItems();
    }

    add(obj) {
        this.el.dispatchEvent(new CustomEvent('todoAdd', {
            detail: this,
            item: obj,
        }));

        this.todos.push(obj);

        window.localStorage.setItem('todos', JSON.stringify(this.todos));

        this._createItem(obj);
    }

    remove(el) {
        let task = el.querySelector('.todo-item__text').innerHTML;

        this.el.dispatchEvent(new CustomEvent('todoDelete', {
            detail: this,
            task: task,
        }));

        for (let [key, val] of this.todos.entries()) {
            if (this.todos[key].task === task) {
                this.todos.splice(key, 1);

                break;
            }
        }

        this.render();
    }

    clearCompleted() {

    }

    _todoItemDeleteClickListener(e) {
        e.preventDefault();

        let todoItem = e.target.closest('.todo-item');

        this.remove(todoItem);
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

    _createItem(item) {
        let todo = document.importNode(this.itemTemplate, true);

        todo.querySelector('.todo-item__text').innerHTML = item.task;
        todo.querySelector('input[type=checkbox]').checked = item.state === 'complete';

        let todoDelete = todo.querySelector('[data-todo-item-delete]');
        todoDelete.addEventListener('click', this._todoItemDeleteClickListener.bind(this));

        this.todoList.appendChild(todo);
    }

    _readItems() {
        let localItems = window.localStorage.getItem('todos');
        if (localItems) {
            this._setTodos(JSON.parse(localItems));
        } else {
            fetch('./assets/data/todos.json')
                .then(this._parseResponse.bind(this))
                .then(this._setTodos.bind(this));
        }
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

    render() {
        this.todoList.innerHTML = '';

        Object.keys(this.todos).forEach(key => {
            this._createItem(this.todos[key]);
        });
    }
}

export default TodoMenu;
