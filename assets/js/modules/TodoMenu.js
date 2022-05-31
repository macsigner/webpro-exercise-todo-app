import BaseModule from './BaseModule.js';

class TodoMenu extends BaseModule {
    constructor(el) {
        super();

        this.el = el;
        this.menu = this.el.querySelector('[data-todo-list]');
        this.todoList = this.menu;
        this.itemTemplate = this._getTemplate();
        this.menu.addEventListener('itemsReady', this.render.bind(this));

        this.todoList.addEventListener('click', this._listEventDelegation.bind(this));

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

        this.save();

        this._createItem(obj);
    }

    save() {
        window.localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    remove(index) {
        this.el.dispatchEvent(new CustomEvent('todoDelete', {
            detail: this,
            task: this.todos[index],
        }));

        this.todos.splice(index, 1);

        this.save();

        this.render();
    }

    clearCompleted() {

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

    _createItem(item, index = this.todos.length) {
        let todo = document.importNode(this.itemTemplate, true);

        todo.querySelector('.todo-item__text').innerHTML = item.task;
        todo.querySelector('input[type=checkbox]').checked = item.state === 'complete';
        todo.firstElementChild.dataset.todoIndex = index;

        this.todoList.appendChild(todo);

    }

    _listEventDelegation(e) {
        if (e.target.matches('[data-todo-item-delete]')) {
            this.remove(parseInt(e.target.closest('[data-todo-index]').dataset.todoIndex));
        }
    }

    _readItems() {
        let localItems = window.localStorage.getItem('todos');

        // Check for larger than 2 => empty array in json string
        console.log()
        if (localItems !== null && localItems.length > 2) {
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
            this._createItem(this.todos[key], key);
        });
    }
}

export default TodoMenu;
