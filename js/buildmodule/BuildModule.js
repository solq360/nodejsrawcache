/**实现类*/
var BuildModule = (function () {
    function BuildModule(config) {
        this.packName = config.packName;
        this.moduleName = config.moduleName;
        this.moduleType = config.moduleType;
        this.extendClassNames = config.extendClassNames;
        this.callback = config.callback;
        this.dir = config.dir;
        this.buildClassProcessors = config.buildClassProcessors;
        this.author = config.author;
        this.name = config.name;
    }
    /**构建所有**/
    BuildModule.prototype.buildAll = function () {
        this.buildExtendClass();
    };

    //////////////////////////////////private////////////////////////////////
    /**构建包头**/
    BuildModule.prototype.buildPackHead = function () {
        return this.packName + "." + this.moduleName + "." + this.moduleType;
    };

    /**构建扩展类**/
    BuildModule.prototype.buildExtendClass = function () {
        var packName = this.buildPackHead();
        var moduleName = this.moduleName.charAt(0).toUpperCase() + this.moduleName.substring(1);

        for (var i in this.extendClassNames) {
            var config = this.extendClassNames[i], fileName = this.bulidFileName(config.className);

            var processor = this.buildClassProcessors[config.classType];
            var ctx = {
                className: config.className.replace(/\.java/mg, ''),
                packName: packName,
                fileName: fileName,
                author: this.author,
                name: this.name,
                moduleName: moduleName,
                moduleType: this.moduleType
            };

            var body = processor.processor(ctx);
            this.createFile(this.dir + fileName, body);
        }
    };

    /**创建文件*/
    BuildModule.prototype.createFile = function (fileName, body) {
        this.callback(fileName, body);
    };

    /**生成文件名*/
    BuildModule.prototype.bulidFileName = function (className) {
        var pack = this.buildPackHead();
        return (pack + ".").replace(/\./img, "/").toLowerCase() + className;
    };

    //构造方法
    BuildModule.valueOf = function (config) {
        var buildModule = new BuildModule(config);
        return buildModule;
    };
    return BuildModule;
})();

module.exports = BuildModule;
