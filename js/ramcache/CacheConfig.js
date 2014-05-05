

var InitCacheType = (function () {
    function InitCacheType() {
    }
    InitCacheType.NOT = "NOT";
    InitCacheType.ALL = "ALL";
    InitCacheType.QUERY = "QUERY";
    return InitCacheType;
})();

var DefaultInitCacheConfig = (function () {
    function DefaultInitCacheConfig() {
    }
    DefaultInitCacheConfig.valueOf = function (initType, queryValue) {
        if (typeof initType === "undefined") { initType = InitCacheType.NOT; }
        var config = {
            initType: initType,
            queryValue: queryValue
        };
        return config;
    };
    return DefaultInitCacheConfig;
})();
var DefaultCacheConfig = (function () {
    function DefaultCacheConfig() {
    }
    DefaultCacheConfig.valueOf = function (initCacheConfig, maxQueueLength, timeTirgger) {
        var config = {
            maxQueueLength: maxQueueLength || 5000,
            timeTirgger: timeTirgger || 15 * 1000,
            initCacheConfig: (initCacheConfig || DefaultInitCacheConfig.valueOf())
        };
        return config;
    };
    return DefaultCacheConfig;
})();
DefaultCacheConfig.config = DefaultCacheConfig.valueOf();

module.exports = DefaultCacheConfig;
