
var MysqlQuerier = (function () {
    function MysqlQuerier() {
    }
    MysqlQuerier.valueOf = function (connection) {
        var result = new MysqlQuerier();
        result.connection = connection;
        return result;
    };

    MysqlQuerier.prototype.save = function (name, entity, callback) {
        var sql = MysqlQuerier.sql_save;
        var params = [name, entity];
        this._find(sql, params, callback);
    };
    MysqlQuerier.prototype.findOne = function (name, id, callback) {
        var sql = MysqlQuerier.sql_one;
        var params = [name, "id", id];
        this.connection.query(sql, params, function (err, results) {
            if (err)
                throw err;

            //  console.log("find one : ",results);
            results = results.length == 0 ? null : results[0];
            callback != null && callback(results);
        });
    };
    MysqlQuerier.prototype.findAll = function (name, callback) {
        var sql = MysqlQuerier.sql_all;
        var params = [name];
        console.log("params", params, "sql : ", sql);
        this._find(sql, params, callback);
    };
    MysqlQuerier.prototype.find = function (name, sql, queryParams, callback) {
        this._find(sql, queryParams, callback);
    };
    MysqlQuerier.prototype.remove = function (name, ids, callback) {
        var params = [name, "id", ids];
        var sql = MysqlQuerier.sql_remove_bat;

        // if (ids.length == 1) {
        //     sql = MysqlQuerier.sql_remove;
        // }
        this._find(sql, params, callback);
    };

    //private
    MysqlQuerier.prototype._find = function (sql, params, callback) {
        this.connection.query(sql, params, function (err, results) {
            if (err)
                throw err;

            callback != null && callback(results);
        });
    };
    MysqlQuerier.sql_all = "SELECT * FROM ??";
    MysqlQuerier.sql_one = "SELECT * FROM ?? WHERE ??= ? ";
    MysqlQuerier.sql_remove = "DELETE FROM ?? WHERE ??= ? ";
    MysqlQuerier.sql_remove_bat = "DELETE FROM ?? WHERE ?? in ? ";

    MysqlQuerier.sql_save = "REPLACE INTO ?? SET ?";
    return MysqlQuerier;
})();

module.exports = MysqlQuerier;
