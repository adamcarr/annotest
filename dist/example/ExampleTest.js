/// <reference path="../typings/tsd.d.ts" />
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
if (typeof __metadata !== "function") __metadata = function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var assert = require('assert');
var index_1 = require('../index');
var name = 'Adam';
var age = 34;
var MyCustomTest = (function () {
    function MyCustomTest() {
    }
    MyCustomTest.before = function () {
        var personConstructor = require('./Person')['default'];
        MyCustomTest.Person = new personConstructor(name, age);
    };
    MyCustomTest.testConstructor = function (done) {
        assert.equal(MyCustomTest.Person.name, name);
        assert.equal(MyCustomTest.Person.age, age, 'Ages should match');
        setTimeout(function () {
            done();
        }, 200);
    };
    MyCustomTest.testCanVote = function () {
        MyCustomTest.Person.age = 18;
        assert(MyCustomTest.Person.canVote, "Person is " + MyCustomTest.Person.age + " and is 18 or older and should be able to vote.");
    };
    Object.defineProperty(MyCustomTest, "before",
        __decorate([
            index_1.default.BeforeEach, 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', Object)
        ], MyCustomTest, "before", Object.getOwnPropertyDescriptor(MyCustomTest, "before")));
    Object.defineProperty(MyCustomTest, "testConstructor",
        __decorate([
            index_1.default.TestAsync('Testing person constructor'), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', [Function]), 
            __metadata('design:returntype', Object)
        ], MyCustomTest, "testConstructor", Object.getOwnPropertyDescriptor(MyCustomTest, "testConstructor")));
    Object.defineProperty(MyCustomTest, "testCanVote",
        __decorate([
            index_1.default.Test('Testing person canVote'), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', Object)
        ], MyCustomTest, "testCanVote", Object.getOwnPropertyDescriptor(MyCustomTest, "testCanVote")));
    MyCustomTest = __decorate([
        index_1.default.TestModule('Person tests', { './IsEighteenOrOlder': { default: function (age) { return age >= 18; } } }), 
        __metadata('design:paramtypes', [])
    ], MyCustomTest);
    return MyCustomTest;
})();
exports.default = MyCustomTest;
