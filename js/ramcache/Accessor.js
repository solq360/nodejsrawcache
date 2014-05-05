
/**定时 数据持久化处理器*/
var TimerAccessor = (function () {
    function TimerAccessor() {
        //保存队列
        this.saveQueue = {};
    }
    //删除队列
    // private removeQueue: { [id: string]: { [id: string]: any; } } = {};
    TimerAccessor.prototype.save = function (name, entity) {
        this.addSaveQueue(name, entity);
    };

    /***更新实体*/
    TimerAccessor.prototype.update = function (name, entity) {
        this.addSaveQueue(name, entity);
    };

    /***加载实体*/
    TimerAccessor.prototype.load = function (name, id, loadCallback, resultCallBack) {
        this.querier.findOne(name, id, function (res) {
            if (res == null) {
                res = loadCallback(res);
            }

            resultCallBack(res);
        });
    };

    /***删除实体*/
    TimerAccessor.prototype.remove = function (name, entity) {
        var $this = this;

        //直接删除
        this.querier.remove(name, entity.getId(), function () {
            $this.addDelQueue(name, entity);
        });
    };

    /***执行持久化*/
    TimerAccessor.prototype.persister = function (name) {
        var key = name + '';

        /*
        var removeIds: { [id: string]: any; } = this.removeQueue[key];
        this.removeQueue[key] = {};
        for (var id in removeIds) {
        this.querier.remove(name, id);
        }
        removeIds = null;
        */
        var saveIds = this.saveQueue[key];
        this.saveQueue[key] = {};
        for (var data in saveIds) {
            this.querier.save(name, data);
        }
        saveIds = null;
    };

    /**注册实体持久化监听器*/
    TimerAccessor.prototype.registerListener = function (name, cacheConfig) {
        var key = name + '';
        var persisterListener = this.persisterListeners[key];
        var $this = this;
        if (persisterListener == null) {
            var value = name;
            persisterListener = setInterval(function () {
                $this.persister(value);
            }, cacheConfig.timeTirgger);
            console.log("register  persister : ", name);
        }
    };
    TimerAccessor.prototype.removeListener = function (name) {
        var key = name + '';
        var persisterListener = this.persisterListeners[key];
        if (persisterListener != null) {
            clearInterval(persisterListener);
            delete this.persisterListeners[key];
        }
    };

    /***构造方法*/
    TimerAccessor.valueOf = function (querier) {
        var result = new TimerAccessor();
        result.querier = querier;
        return result;
    };

    //private
    TimerAccessor.prototype.addSaveQueue = function (name, entity) {
        var key = name + "";
        var id = entity.getId();
        if (this.saveQueue[key] == null) {
            this.saveQueue[key] = {};
        }
        this.saveQueue[key][id] = entity;
    };

    TimerAccessor.prototype.addDelQueue = function (name, entity) {
        var key = name + "";
        var id = entity.getId();

        if (this.saveQueue[key] == null) {
            return;
        }
        delete this.saveQueue[key][id];
        /*
        if (this.removeQueue[key] == null) {
        this.removeQueue[key] = {};
        }
        this.removeQueue[key][id] = 1;
        */
    };
    return TimerAccessor;
})();

module.exports = TimerAccessor;
