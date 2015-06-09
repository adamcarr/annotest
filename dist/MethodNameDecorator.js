/// <reference path="typings/tsd.d.ts" />
require('reflect-metadata');
var _ = require('lodash');
function MethodNameDecorator(metadataName) {
    return function (target, propertyKey) {
        var propertyNames = [];
        if (Reflect.hasMetadata(metadataName, target)) {
            propertyNames = Reflect.getMetadata(metadataName, target);
        }
        if (!_.contains(propertyNames, propertyKey)) {
            propertyNames.push(propertyKey);
        }
        Reflect.defineMetadata(metadataName, propertyNames, target);
    };
}
exports.default = MethodNameDecorator;
