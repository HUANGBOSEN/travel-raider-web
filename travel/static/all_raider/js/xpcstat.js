(function(w, doc, $) {
    function Stat(stat, properties) {
        var _this = this;
        _this.stat = stat;
        _this._clickEventStat();
        if (properties) {
            _this.setProfile(properties);
        }
    }

    Stat.prototype._clickEventStat = function() {
        var _this = this;
        $(doc).on('click', '.xpc-stat', function() {
            var $elem = $(this),
                pageClickEvent = $elem.data('event'),
                strKey  = $elem.data('key'),
                strValue = $elem.data('value'),
                properties = {};

            if (strKey) {
                var arrKey = strKey.split(' '),
                    arrValue = strValue.split(' ');
                arrKey.forEach(function(value, index) {
                    properties[value] = arrValue[index];
                });
            }

            _this.track(pageClickEvent, properties);

        });
    }

    Stat.prototype.registerPage = function(properties) {
        this.stat.registerPage(properties);
    }

    Stat.prototype.track = function(event, properties) {
        this.stat.track(event, properties);
    }

    Stat.prototype.setProfile = function(properties, callback) {
        this.stat.setProfile(properties, callback);
    }

    Stat.prototype.registerEvent = function(event, fn) {
        fn && fn();
    }

    w.Stat = Stat;

})(window, document, jQuery);