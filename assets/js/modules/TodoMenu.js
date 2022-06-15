import BaseModule from './BaseModule.js';
import * as Tools from './tools.js';
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

        this.todoList.addEventListener('click', Tools.delegate('[data-todo-item-delete]', (e) => {
            this.remove(this._getParentIndex(e.target));
        }));
        this.todoList.addEventListener('click', Tools.delegate('[value=checked]', (e) => {
            this.todos[this._getParentIndex(e.target)].checked = e.target.checked;
            this.save();
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
        this.el.dispatchEvent(new CustomEvent('todoAdd', {
            detail: this,
            item: obj,
        }));

        this.todos.push(obj);

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
    _createItem(item, index = this.todos.length) {
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

        Object.keys(this.todos).forEach(key => {
            this._createItem(this.todos[key], key);
        });
    }
}

export default TodoMenu;
