/// <reference path="../typings/tsd.d.ts" />
var assert = require('assert');
var IsEighteenOrOlder_1 = require('./IsEighteenOrOlder');
var Person = (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
        assert(this.age >= 0, "age must be a positive value. [age: " + this.age + "]");
    }
    Object.defineProperty(Person.prototype, "canVote", {
        get: function () {
            return IsEighteenOrOlder_1.default(this.age);
        },
        enumerable: true,
        configurable: true
    });
    return Person;
})();
exports.default = Person;
