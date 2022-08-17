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
                console.log('click');
                this.menu.classList.toggle(this.getNamespace('-menu--is-active'));
            }));

        this.menu.innerHTML = `<button class="${this.getNamespace('-menu__close')}" data-todo-settings-menu-toggle="${this.getNamespace()}"></button>`
        document.body.appendChild(this.menu);
    }
}

export default SettingsMenu;
