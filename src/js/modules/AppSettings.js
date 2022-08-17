import BaseModule from './BaseModule';

/**
 * App settings.
 */
class AppSettings extends BaseModule {
    /**
     * Construct.
     * @param settings
     */
    constructor(settings) {
        super();

        this._defaultSettings = {
            namespace: 'appSettings',
            remotePath: '',
        }
        this._customSettings = settings;
        this._settings = this.mapOptions(this._defaultSettings, this._customSettings);
    }

    /**
     * Set specified property to value.
     * @param property
     * @param value
     */
    set(property, value) {
        this._settings[property] = value;

        AppSettings.dispatchEvent(new CustomEvent(this.getNamespace('afterSet'), {
            detail: {
                AppSettings: this,
                property,
                value,
            }
        }));
    }

    /**
     * Get value of set property.
     * @param property
     * @returns {*}
     */
    get(property) {
        return this._settings[property];
    }
}

export default AppSettings;

