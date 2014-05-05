/***
高速缓存服务
不考虑加锁情况下
*/
var RamCacheService = (function () {
    function RamCacheService() {
        this.cacheData = {};
    }
    RamCacheService.prototype.initCacheData = function () {
        var name = this.entityMetadata.entityName;
        var cacheConfig = this.entityMetadata.cacheConfig;
        if (cacheConfig.initCacheConfig != null) {
            var initCacheConfig = cacheConfig.initCacheConfig;
            switch (initCacheConfig.initType) {
                case InitCacheType.ALL:
                    this.querier.findAll(name, function (res) {
                        for (var entity in res) {
                            this.addCacheData(entity);
                        }
                    });
                    break;
                case InitCacheType.QUERY:
                    this.querier.find(name, initCacheConfig.queryValue, [], function (res) {
                        for (var entity in res) {
                            this.addCacheData(entity);
                        }
                    });
                    break;
                default:
                    break;
            }
        }

        //注册持久化监听器
        this.accessor.persister(name);
    };

    /**公开方法 */
    /**构造 服务  */
    RamCacheService.valueOf = function (accessor, querier, entityMetadata) {
        var result = new RamCacheService();
        result.accessor = accessor;
        result.querier = querier;
        result.entityMetadata = entityMetadata;
        result.initCacheData();
        return result;
    };

    /**加载或者创建实体 */
    RamCacheService.prototype.loadOrCreate = function (id, createFn, callback) {
        //cache > db
        var resultEntity = this.getCacheData(id);
        if (resultEntity == null) {
            var $this = this;
            var name = this.entityMetadata.entityName;
            this.accessor.load(name, id, function (loadEntity) {
                if (loadEntity == null) {
                    resultEntity = createFn(id);
                } else {
                    resultEntity = loadEntity;
                }

                $this.save(resultEntity);
                $this.addCacheData(resultEntity);
                return resultEntity;
            }, callback);
        }
    };

    /**保存实体 */
    RamCacheService.prototype.save = function (entity) {
        var name = this.entityMetadata.entityName;
        this.accessor.save(name, entity);
        this.addCacheData(entity);
    };

    /**更新实体 */
    RamCacheService.prototype.update = function (entity) {
        this.save(entity);
    };

    /**删除实体 */
    RamCacheService.prototype.remove = function (entity) {
        var name = this.entityMetadata.entityName;
        this.accessor.remove(name, entity);
        this.removeCacheData(entity);
    };

    /**获取实体元数据 */
    RamCacheService.prototype.getEntityMetadata = function () {
        return this.entityMetadata;
    };

    //private
    RamCacheService.prototype.addCacheData = function (entity) {
        var id = entity.getId();
        this.cacheData[id] = entity;
    };

    RamCacheService.prototype.getCacheData = function (id) {
        return this.cacheData[id];
    };

    RamCacheService.prototype.removeCacheData = function (entity) {
        var id = entity.getId();
        delete this.cacheData[id];
    };
    return RamCacheService;
})();

module.exports = RamCacheService;
