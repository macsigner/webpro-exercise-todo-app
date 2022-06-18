import BaseModule from './BaseModule.js';
import * as Tools from '../tools.js';
/**
 * Todomenu.
 */
class TodoMenu extends BaseModule {
    /**
     * Construct the object.
     * @param el
     */
    constructor(el) {
        super();

        this.el = el;
        this.menu = this.el.querySelector('[data-todo-list]');
        this.todoList = this.menu;
        this.itemTemplate = this._getTemplate();
        this.menu.addEventListener('itemsReady', this.render.bind(this));
        this.filter = {};

        this.todoList.addEventListener('click', Tools.delegate('[data-todo-item-action=remove]', (e) => {
            this.remove(this._getParentIndex(e.target));
        }));

        this.todoList.addEventListener('mouseover', Tools.delegate('[data-todo-item-action=drag]', (e) => {
            e.target.closest('[data-todo-item]').draggable = true;
        }));

        this.todoList.addEventListener('mouseout', Tools.delegate('[data-todo-item-action=drag]', (e) => {
            e.target.closest('[data-todo-item]').draggable = false;
        }));

        this.todoList.addEventListener('dragstart', Tools.delegate('[data-todo-item]', (e) => {
            this.dragged = e.target.closest('[data-todo-item]');

            this.dragged.classList.add('dragged');
        }));

        this.todoList.addEventListener('dragend', Tools.delegate('[data-todo-item]', (e) => {
            this.dragged.classList.add('dragged');
        }));

        this.todoList.addEventListener('dragover', Tools.delegate('[data-todo-item]', (e) => {
            e.preventDefault();

            let todoItem = e.target.closest('[data-todo-item]');

            if(todoItem === this.dragged) {
                return;
            }

            todoItem.classList.add('dragover');
        }));

        this.todoList.addEventListener('dragleave', Tools.delegate('[data-todo-item]', (e) => {
            e.target.closest('[data-todo-item]').classList.remove('dragover');
        }));

        document.addEventListener('drop', Tools.delegate('[data-todo-item]', (e) => {
            e.preventDefault();

            let targetItem = e.target.closest('[data-todo-item]');
            targetItem.classList.remove('dragover');

            if(targetItem === this.dragged) {
                this.render();

                return;
            }

            let draggedTodo = this.todos.splice(this._getParentIndex(this.dragged), 1);
            let targetIndex = this.todos.indexOf(this.todos[this._getParentIndex(targetItem)]);

            this.todos.splice(targetIndex, 0, draggedTodo[0]);

            this.render();
        }));

        this.todoList.addEventListener('click', Tools.delegate('[value=checked]', (e) => {
            this.todos[this._getParentIndex(e.target)].checked = e.target.checked;
            this.save();
            this.render();
        }));

        this.el.addEventListener(
            'click',
            Tools.delegate('[data-todo-action=clearCompleted]', this.clearCompleted.bind(this)),
        );

        // Todo: Exchange anonymous function with named one.
        this.el.addEventListener('click', Tools.delegate('[data-todo-filter]', (e) => {
            let filterButton = e.target.closest('[data-todo-filter]');

            // Todo: Check matching filters. Eg. what filters are set?
            this.el.querySelectorAll('[data-todo-filter]')
                .forEach(el => el.classList.remove('active'));

            filterButton.classList.add('active');

            switch (filterButton.dataset.todoFilter) {
                case '*':
                    delete this.filter.checked;
                    break;
                case 'complete':
                    this.filter.checked = true;
                    break;
                case 'active':
                    this.filter.checked = false;
            }

            this.render();
        }));

        this.form = this.el.querySelector('[data-todo-form]');
        this.form.addEventListener('submit', this._todoFormListener.bind(this));

        this._readItems();
    }

    /**
     * Add single todo item via object.
     * @param obj
     */
    add(obj) {
        this.insert(obj);
    }

    /**
     * Isert item at specified index.
     * @param obj
     */
    insert(obj, index = this.todos.length) {
        this.todos.splice(index, 0, obj);

        this.save();

        this._createItem(obj);
    }

    /**
     * Save current State.
     */
    save() {
        window.localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    /**
     * Remove item at specified index.
     * @param index
     */
    remove(index) {
        this.todos.splice(index, 1);

        this.save();

        this.render();
    }

    /**
     * Remove completed items from todo list.
     */
    clearCompleted() {
        this.todos = this.todos.filter(item => {
            if (!item.checked) {
                return item;
            }
        });

        this.save();

        this.render();
    }

    /**
     * Listener on todo form.
     * @param e
     * @private
     */
    _todoFormListener(e) {
        e.preventDefault();

        let todo = {
            checked: false,
        }

        let formData = new FormData(this.form);

        for (let entry of formData.entries()) {
            todo[entry[0]] = entry[1];
            formData.delete(entry[0]);
        }

        if (todo.task.trim().length) {
            this.add(todo);

            this.form.reset();
        }
    }

    /**
     * Get template of the item
     * @returns {string | DocumentFragment}
     * @private
     */
    _getTemplate() {
        if (this.itemTemplate) {
            return this.itemTemplate;
        }

        let template = this.menu.querySelector('[data-todo-item-template]');

        return document.importNode(template.content, true);
    }

    /**
     * Create single entry from object.
     * @param item
     * @param index
     * @private
     */
    _createItem(item, index = this.todos.length - 1) {
        if(!this._matchesFilter(item)) {
            return;
        }

        let todo = document.importNode(this.itemTemplate, true);

        todo.querySelectorAll('[data-todo-item-content]').forEach((el) => {
            let key = el.dataset.todoItemContent;

            if (item[key]) {
                el.innerHTML = item[key];
            } else {
                el.remove();
            }
        });

        todo.querySelector('input[value=checked]').checked = item.checked;
        item.checked ? todo.firstElementChild.classList.add('checked') : '';

        todo.firstElementChild.dataset.todoIndex = index;

        this.todoList.appendChild(todo);
    }

    _matchesFilter(item) {
        if(Object.keys(this.filter).length === 0) {
            return true;
        }

        let matches = true;

        for (let key in this.filter) {
            matches = matches && this.filter[key] === item[key];
        }

        return matches;
    }

    /**
     * Get parent index of item.
     * @param el
     * @returns {number}
     * @private
     */
    _getParentIndex(el) {
        return parseInt(el.closest('[data-todo-index]').dataset.todoIndex);
    }

    /**
     * Read items. When empty some default items will be returned.
     * @private
     */
    _readItems() {
        let localItems = window.localStorage.getItem('todos');

        // Check for larger than 2 => empty array in json string
        if (localItems !== null && localItems.length > 2) {
            this._setTodos(JSON.parse(localItems));
        } else {
            fetch('./assets/data/todos.json')
                .then(response => response.json())
                .then(this._setTodos.bind(this));
            // Todo: Handle errors
        }
    }

    /**
     * Set Todos
     * @param data
     * @private
     */
    _setTodos(data) {
        this.todos = data;

        this.save();

        this.menu.dispatchEvent(new CustomEvent('itemsReady', {
            detail: {
                TodoMenu: this,
            },
        }));
    }

    /**
     * Render current items in this.todos.
     */
    render() {
        this.todoList.innerHTML = '';

        for (let key in this.todos) {
            this._createItem(this.todos[key], key);
        }
    }
}

export default TodoMenu;