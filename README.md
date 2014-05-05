nodejsrawcache 高速缓存
============


如果觉得还行，请我喝瓶水
[![Gittip](https://img.alipay.com/sys/personalprod/style/mc/btn-index.png)](http://me.alipay.com/solq)

作者 : solq

blog : 
* http://www.cnblogs.com/solq/
* http://www.jiaotuhao.com/
* http://www.springnodejs.com/
* http://example.springnodejs.com/
* http://rawcache.springnodejs.com/

git : https://github.com/solq360/springnodejs
	https://github.com/solq360/springnodejsExample.git

QQ群:9547527

```
RamCacheService.ts 缓存层服务
Accessor.ts 持久化处理器
Querier.ts 数据查询器
Entity.ts 元数据信息 未完成
```

TestRamCache.js 
```
_find();

function _find() {
    var startTime = new Date().getTime();
    timerAccessor.load(EntityName.test, 1, function (res) {
        return { id: 1 };
    }, function (res) {
        var endTime = new Date().getTime();
        console.log("find  time : ", (endTime - startTime));
        console.log(res);

        cache_find();
    });
}

function cache_find() {
    var startTime = new Date().getTime();
    timerAccessor.load(EntityName.test, 1, function (res) {
        return { id: 1 };
    }, function (res) {
        var endTime = new Date().getTime();
        console.log("find cache time : ", (endTime - startTime));
        console.log(res);
    });
}
```

Show Result
```
find  time :  9
{ id: 1, body: '2121' }
find cache time :  1
{ id: 1, body: '2121' }
```

至于ts 是什么有兴趣请看
* http://www.csdn.net/article/2012-10-11/2810645-Thoughts-on-TypeScript
* 请支持 www.springnodejs.com

如果觉得还行，请我喝瓶水
[![Gittip](https://img.alipay.com/sys/personalprod/style/mc/btn-index.png)](http://me.alipay.com/solq)