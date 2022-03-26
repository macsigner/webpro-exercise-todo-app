class BaseModule {
    /**
     * Map options method.
     * @param objSettings
     * @param options
     * @returns {*}
     */
    mapOptions(objSettings, options) {
        let settings = Object.assign({}, objSettings);
        if (Array.isArray(objSettings)) {
            settings = objSettings.map((x) => x);
        } else {
            settings = Object.assign({}, objSettings);
        }

        Object.keys(options).forEach((strKey) => {
            if (typeof options[strKey] === 'object'
                && !(options[strKey] instanceof Node)
                && !(options[strKey] instanceof Function)
            ) {
                settings[strKey] = this.mapOptions(settings[strKey], options[strKey]);
            } else {
                settings[strKey] = options[strKey];
            }
        });

        return settings;
    }

    /**
     * Get anchor id from url string.
     * @param strUrl
     * @returns {*}
     */
    getAnchorIdFromUrl(strUrl) {
        return strUrl.split('#')[1];
    }

    /**
     * Get Module namespace.
     * @param strSuffix
     * @returns {string}
     */
    getNamespace(strSuffix = '') {
        return this.settings.namespace + strSuffix;
    }

    /**
     * Get namespace base class.
     * @param strSuffix
     * @returns {string}
     */
    getNamespaceClass(strSuffix) {
        return '.' + this.getNamespace(strSuffix);
    }

    /**
     * Map media options.
     * @private
     */
    _mapMediaOptions() {
        this.settings = this.mapOptions(this._defaultSettings, this._customSettings);

        if (this.settings.medias) {
            this.settings.medias.forEach(function(item) {
                if (window.matchMedia(item.media).matches) {
                    this.settings = this.mapOptions(this.settings, item.settings);
                }
            });
        }
    };

    /**
     * Resize listener.
     * @private
     */
    _windowResizeListener() {
        clearTimeout(this._windowResizeTimeout);

        this._windowResizeTimeout = setTimeout(function() {
            this._mapMediaOptions();

            if (this._constructPrivates) {
                this._constructPrivates();
            }
        }, this.settings.windowResizeDelay);
    };
}

export default BaseModule;
