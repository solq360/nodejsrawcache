/***
高速缓存服务
不考虑加锁情况下
*/
class RamCacheService {
    //    constructor() {
    //        throw new Error("Cannot new this class");
    //    }
    private entityMetadata: EntityMetadata;

    private accessor: Accessor;
    private querier: Querier;

    private cacheData: { [id: string]: Entity; } = {};

    private initCacheData(): void {
        var name = this.entityMetadata.entityName;
        var cacheConfig: CacheConfig = this.entityMetadata.cacheConfig;
        if (cacheConfig.initCacheConfig != null) {
            var initCacheConfig: InitCacheConfig = cacheConfig.initCacheConfig;
            switch (initCacheConfig.initType) {
                case InitCacheType.ALL:
                    this.querier.findAll(name, function(res) {
                        for (var entity in res) {
                            this.addCacheData(entity);
                        }
                    });
                    break;
                case InitCacheType.QUERY:
                    this.querier.find(name, initCacheConfig.queryValue, [], function(res) {
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
    }

    /**公开方法 */
    /**构造 服务  */
    public static valueOf(accessor: Accessor, querier: Querier, entityMetadata: EntityMetadata): RamCacheService {
        var result: RamCacheService = new RamCacheService();
        result.accessor = accessor;
        result.querier = querier;
        result.entityMetadata = entityMetadata;
        result.initCacheData();
        return result;
    }
    /**加载或者创建实体 */
    public loadOrCreate(id: any, createFn: (id: any) => Entity, callback: (data: Entity) => void): void {
        //cache > db 
        var resultEntity: Entity = this.getCacheData(id);
        if (resultEntity == null) {
            var $this = this;
            var name = this.entityMetadata.entityName;
            this.accessor.load(name, id, function(loadEntity) {
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
    }

    /**保存实体 */
    public save(entity: Entity): void {
        var name = this.entityMetadata.entityName;
        this.accessor.save(name, entity);
        this.addCacheData(entity);
    }
    /**更新实体 */
    public update(entity: Entity): void {
        this.save(entity);
    }
    /**删除实体 */
    public remove(entity: Entity): void {
        var name = this.entityMetadata.entityName;
        this.accessor.remove(name, entity);
        this.removeCacheData(entity);
    }
    /**获取实体元数据 */
    public getEntityMetadata(): EntityMetadata {
        return this.entityMetadata;
    }

    //private

    private addCacheData(entity: Entity) {
        var id: string = entity.getId();
        this.cacheData[id] = entity;
    }

    private getCacheData(id: any): Entity {
        return this.cacheData[id];
    }

    private removeCacheData(entity: Entity) {
        var id: string = entity.getId();
        delete this.cacheData[id];
    }
}

declare var module: any;
module.exports = RamCacheService;