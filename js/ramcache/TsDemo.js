//http://blog.csdn.net/jilongliang/article/details/21942911
//动态类
var Greeter2 = (function () {
    function Greeter2(message) {
        this.greeting = message;
    }
    Greeter2.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter2;
})();

//模块 + 静态类
var ExampleModule;
(function (ExampleModule) {
    var MyClass = (function () {
        function MyClass() {
            throw new Error("Cannot new this class");
        }
        MyClass.doSomething = function () {
            return "World";
        };
        return MyClass;
    })();
    ExampleModule.MyClass = MyClass;
})(ExampleModule || (ExampleModule = {}));
