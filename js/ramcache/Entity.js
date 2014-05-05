;


/***实体映射表*/
var EntityName = (function () {
    function EntityName() {
    }
    EntityName.user = "user";
    EntityName.test = "test";
    return EntityName;
})();

var EntityConfig = (function () {
    function EntityConfig() {
    }
    EntityConfig.valueOf = function (entityName, entity, cacheConfig) {
        var result = {
            entityName: entityName,
            entity: entity,
            cacheConfig: cacheConfig
        };
        return result;
    };
    EntityConfig.valueOfEntity = function (data, entity) {
        for (var key in entity) {
            data[key] = entity[key];
        }
        return entity;
    };
    return EntityConfig;
})();

module.exports = EntityConfig;

global.EntityName = EntityName;
