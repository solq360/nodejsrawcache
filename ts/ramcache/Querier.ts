/***查询器*/
interface Querier {

    /**保存数据**/
    save(name: EntityName, entity: Entity, callback?: (results: any) => void): void;
    /**查询指定数据**/
    findOne(name: EntityName, id: any, callback: (results: any) => void): void;
    /**查询所有数据**/
    findAll(name: EntityName, callback: (results: any) => void): void;
    /**查询指定数据**/
    find(name: EntityName, sql: string, queryParams: Array<any>, callback: (results: any) => void): void;
    /**删除数据**/
    remove(name: EntityName, ids: Array<any>, callback: (results: any) => void): void;


    ////////////////////////////////sync
    /*
     saveSync(name: EntityName, entity: Entity): void;
     findOneSync(name: EntityName, id: any): Entity;
     findAllSync(name: EntityName): Array<Entity>;
     findSync(name: EntityName, sql: string, ...queryParams: Array<any>): Array<Entity>;
     removeSync(name: EntityName, ...ids: Array<any>): void;*/
}
/***mysql*/
interface MySqlIConnection {
    query(sql: string, callback: (err: any, rows: any, fields: any) => void): any;
    query(sql: string, params: Array<any>, callback: (err: any, results: any) => void): any;
}
class MysqlQuerier implements Querier {
    /**查询SQL模板*/
    private static sql_all: string = "SELECT * FROM ??";
    private static sql_one: string = "SELECT * FROM ?? WHERE ??= ? ";
    private static sql_remove: string = "DELETE FROM ?? WHERE ??= ? ";
    private static sql_remove_bat: string = "DELETE FROM ?? WHERE ?? in ? ";

    private static sql_save: string = "REPLACE INTO ?? SET ?";

    /**数据库连接对象*/
    private connection: MySqlIConnection;

    public static valueOf(connection: MySqlIConnection): Querier {
        var result: MysqlQuerier = new MysqlQuerier();
        result.connection = connection;
        return result;
    }

    save(name: EntityName, entity: Entity, callback: (results: any) => void): void {
        var sql: string = MysqlQuerier.sql_save;
        var params = [name, entity];
        this._find(sql, params, callback);
    }
    findOne(name: EntityName, id: any, callback: (results: any) => void): void {
        var sql: string = MysqlQuerier.sql_one;
        var params = [name, "id", id];
        this.connection.query(sql, params, function(err, results) {
            if (err) throw err;
            //  console.log("find one : ",results);
            results = results.length == 0 ? null : results[0];
            callback != null && callback(results);
        });
    }
    findAll(name: EntityName, callback: (results: any) => void): void {
        var sql: string = MysqlQuerier.sql_all;
        var params = [name];
        console.log("params", params, "sql : ", sql);
        this._find(sql, params, callback);
    }
    find(name: EntityName, sql: string, queryParams: Array<any>, callback: (results: any) => void): void {
        this._find(sql, queryParams, callback);
    }
    remove(name: EntityName, ids: Array<any>, callback: (results: any) => void): void {
        var params = [name, "id", ids];
        var sql: string = MysqlQuerier.sql_remove_bat;
        // if (ids.length == 1) {
        //     sql = MysqlQuerier.sql_remove;
        // }
        this._find(sql, params, callback);
    }
    //private 
    private _find(sql: string, params: Array<any>, callback: (results: any) => void): void {
        this.connection.query(sql, params, function(err, results) {
            if (err) throw err;

            callback != null && callback(results);
        });
    }

}

declare var module: any;
module.exports = MysqlQuerier;