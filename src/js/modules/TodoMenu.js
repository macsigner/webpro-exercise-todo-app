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

        this._applyDragEvents();

        this.todoList.addEventListener('click', Tools.delegate('[value=checked]', (e) => {
            this.todos[this._getParentIndex(e.target)].completed = e.target.checked ? 1 : 0 ;

            this.save();

            this.render();
        }));

        this.el.addEventListener(
            'click',
            Tools.delegate('[data-todo-action=clearCompleted]', this.clearCompleted.bind(this)),
        );

        this.el.addEventListener(
            'click',
            Tools.delegate('[data-todo-filter]', this._filterListener.bind(this))
        );

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
     * Insert item at specified index.
     * @param {*} obj
     * @param {number} index
     */
    insert(obj, index = this.todos.length) {
        this.todos.splice(index, 0, obj);

        this.save();

        this._createItem(obj);
    }

    /**
     * Save current state.
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
        this.todos = this.todos.filter(item => item.completed === 0);

        this.save();

        this.render();
    }

    /**
     * Handle click event on filter buttons.
     * @param e
     * @private
     */
    _filterListener(e) {
        let filterButton = e.target.closest('[data-todo-filter]');

        // Todo: Check matching filters. Eg. what filters are set?
        this.el.querySelectorAll('[data-todo-filter]')
            .forEach(el => el.classList.remove('active'));

        filterButton.classList.add('active');

        switch (filterButton.dataset.todoFilter) {
            case '*':
                delete this.filter.completed;
                break;
            case 'complete':
                this.filter.completed = 1;
                break;
            case 'active':
                this.filter.completed = 0;
        }

        this.render();
    }
    /**
     * Handle drop event on todo item.
     * @param e
     * @private
     */
    _todoItemDropListener(e) {
        e.preventDefault();

        let targetItem = e.target.closest('[data-todo-item-dropzone]');
        targetItem.classList.remove('dragover');

        if(targetItem === this.dragged) {
            this.render();

            return;
        }

        e.stopPropagation();

        let targetTodo = this.todos[this._getParentIndex(targetItem)];
        let draggedTodo = this.todos.splice(this._getParentIndex(this.dragged), 1)[0];
        let targetIndex = this.todos.indexOf(targetTodo);

        if(targetItem.dataset.todoItemDropzone === 'after') {
            targetIndex += 1;
        }

        this.todos.splice(targetIndex, 0, draggedTodo);

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
            completed: false,
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
     * Apply drag events to todo list.
     * @private
     */
    _applyDragEvents() {
        this.todoList.addEventListener('mouseover', Tools.delegate('[data-todo-item-action=drag]', (e) => {
            e.target.closest('[data-todo-item]').draggable = true;
        }));

        this.todoList.addEventListener('mouseout', Tools.delegate('[data-todo-item-action=drag]', (e) => {
            e.target.closest('[data-todo-item]').draggable = false;
        }));

        this.todoList.addEventListener('dragstart', Tools.delegate('[data-todo-item]', (e) => {
            this.dragged = e.target.closest('[data-todo-item]');

            let clone = this.dragged.cloneNode(true);
            let cloneWrapper = document.createElement('div');

            clone.classList.add('clone');
            cloneWrapper.appendChild(clone);

            this.dragged.appendChild(cloneWrapper);

            e.dataTransfer.setData('text/plain', this.dragged.dataset.todoIndex);

            e.dataTransfer.setDragImage(cloneWrapper, 4, 4);
            setTimeout(() => cloneWrapper.remove(), 1);

            if (this.dragged.previousElementSibling) {
                this.dragged.previousElementSibling.classList.add('prev-drop-sibling');
            }

            if (this.dragged.nextElementSibling) {
                this.dragged.nextElementSibling.classList.add('next-drop-sibling');
            }

            this.dragged.classList.add('dragged');
        }));

        this.todoList.addEventListener('dragend', Tools.delegate('[data-todo-item]', (e) => {
            this.render();
        }));

        this.todoList.addEventListener('dragover', Tools.delegate('[data-todo-item-dropzone]', (e) => {
            e.preventDefault();
        }));

        this.todoList.addEventListener('dragenter', Tools.delegate('[data-todo-item-dropzone]', (e) => {
            e.preventDefault();

            let todoItem = e.target.closest('[data-todo-item]');
            let dropzone = e.target.closest('[data-todo-item-dropzone]');

            if(todoItem === this.dragged) {
                return;
            }

            this.menu.querySelectorAll('[data-todo-item]')
                .forEach(el => el.classList.remove('dragover'));

            this.menu.querySelectorAll('[data-todo-item-dropzone]')
                .forEach(el => el.classList.remove('dragover'));

            todoItem.classList.add('dragover');
            dropzone.classList.add('dragover');
        }));

        this.todoList.addEventListener('dragleave', Tools.delegate('[data-todo-item-dropzone]', (e) => {
        }));

        document.addEventListener(
            'drop',
            Tools.delegate('[data-todo-item-dropzone]', this._todoItemDropListener.bind(this))
        );
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

        todo.querySelector('input[value=checked]').checked = item.completed ? true : false;
        item.completed ? todo.firstElementChild.classList.add('checked') : '';

        todo.firstElementChild.dataset.todoIndex = index;

        this.todoList.appendChild(todo);
    }

    /**
     * Check if given item matches current filter.
     * @param item
     * @returns {boolean}
     * @private
     */
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
        fetch('http://localhost:3000/todos')
            .then(response => {
                if (!response.ok) {
                    throw response;
                }

                return response.json()
            })
            .then(this._setTodos.bind(this))
            .catch((error) => {
                this._readItemsFromLocalStorage();
            });
    }

    _readItemsFromLocalStorage() {
        let localItems = window.localStorage.getItem('todos');

        // Check for larger than 2 => empty array in json string
        if (localItems !== null && localItems.length > 2) {
            this._setTodos(JSON.parse(localItems));
        } else {
            fetch('./data/todos.json')
                .then(response => response.json())
                .then(this._setTodos.bind(this));
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
