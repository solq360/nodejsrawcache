var mysql = require('mysql');
var entity = require('./Entity');
var querier = require('./Querier');
var accessor = require('./Accessor');
var ramCacheService = require('./RamCacheService');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 8585,
    database: 'test',
    user: 'root',
    password: 'kwgkwg'
});
connection.connect();

//抽象示例
var mysqlQuerier = querier.valueOf(connection);
var timerAccessor = accessor.valueOf(mysqlQuerier);

mysqlQuerier.findAll(EntityName.test, function (res) {
    // console.log(res);
});

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
//connection.end();
/*
var testEntity: Entity = {
getId(): any{
return this.id;
}
};
var testObj: EntityMetadata = EntityConfig.valueOf(EntityName.user, testEntity);
*/
