import BaseModule from './BaseModule';

/**
 * App settings.
 */
class AppSettings extends BaseModule {
    /**
     * Construct.
     * @param settings
     */
    constructor(settings = {}) {
        super();

        this._defaultSettings = {
            namespace: 'appSettings',
            remotePath: '',
        }
        this._customSettings = settings;
        this._settings = this.mapOptions(this._defaultSettings, this._customSettings);

        let instance = this.getInstance(this.getNamespace());
        if (instance) {
            return instance;
        }

        this.addToInstances();
    }

    /**
     * Set specified property to value.
     * @param property
     * @param value
     */
    set(property, value) {
        this._settings[property] = value;

        window.dispatchEvent(new CustomEvent(this.getNamespace('AfterSet'), {
            detail: {
                AppSettings: this,
                property,
                value,
            },
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

    /**
     * Get all _settings.
     * @returns {*}
     */
    getAll() {
        return this._settings;
    }

    getNamespace(strSuffix = '') {
        return this._settings.namespace + strSuffix;
    }
}

/**
 *
 * @type {Set<any>}
 */
AppSettings.prototype.instances = new Set();

AppSettings.prototype.addToInstances = function () {
    AppSettings.prototype.instances.add(this);
};

AppSettings.prototype.getInstance = function (namespace) {
    console.log(namespace);
    for (let set = AppSettings.prototype.instances.values(), val = null; val = set.next().value;) {
        if (val.getNamespace() === namespace) {
            return val;
        }
    }

    return false;
};

export default AppSettings;

