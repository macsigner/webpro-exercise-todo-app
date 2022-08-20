import AppSettings from './AppSettings.js';
import BaseModule from './BaseModule.js';
import * as Tools from '../tools';

/**
 * Settings menu.
 */
class SettingsMenu extends BaseModule {
    /**
     * Construct.
     */
    constructor(settings = {}) {
        super();

        this._defaultSettings = {
            namespace: 'todo-settings',
        }
        this._customSettings = settings;
        this.settings = this.mapOptions(this._defaultSettings, this._customSettings);
        this._appSettings = new AppSettings({
            namespace: 'todoSettings',
        });

        this.menu = document.createElement('div');
        this.menu.classList.add(this.getNamespace('-menu'));
        document.addEventListener('click', Tools.delegate(
            `[data-todo-settings-menu-toggle="${this.getNamespace()}"]`,
            () => {
                this.menu.classList.toggle(this.getNamespace('-menu--is-active'));
            }));

        this.menu.innerHTML = `<button class="${this.getNamespace('-menu__close')}" data-todo-settings-menu-toggle="${this.getNamespace()}"></button>`
        document.body.appendChild(this.menu);

        this._appSettings.set('saveToRemote', true);

        this.menu.addEventListener('change', Tools.delegate('select, input, textarea', (e) => {
            if (this._appSettings.get(e.target.name) === undefined) {
                return;
            }

            switch (e.target.type) {
                case 'checkbox':
                case 'radio':
                    this._appSettings.set(e.target.name, e.target.checked);
                default:
                    this._appSettings.set(e.target.name, e.target.value);
            }
        }))

        let appSettings = this._appSettings.getAll();
        for (let key of Object.keys(appSettings)) {
            switch (key) {
                case 'namespace':
                    break;
                default:
                    let item = this._createSettingItem(key, appSettings[key]);

                    this.menu.appendChild(item);
            }
        }
    }

    _createSettingItem(key, value) {
        let el = document.createElement('div');
        switch (typeof value) {
            case 'string':
                el.classList.add(this.getNamespace('__text-field'));
                el.innerHTML = `<label>${key}<br><input type="text" name="${key}" value="${value}"></label>`
                break;
            case 'boolean':
                el.classList.add(this.getNamespace('__text-field'));
                el.innerHTML = `
                    <label>
                        <input type="checkbox" name="${key}" value="${value}" class="${this.getNamespace('__checkbox')}">
                        <span class="${this.getNamespace('__label')}">
                            <span class="${this.getNamespace('__pseudo-checkbox')}"></span>
                            <span class="${this.getNamespace('__text')}">${key}</span>
                        </span>
                    </label>`;
                break;
            default:
                console.log('none');
        }
        return el;
    }
}

export default SettingsMenu;
