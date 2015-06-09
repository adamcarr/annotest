#!/usr/bin/env node 

/// <reference path="typings/tsd.d.ts" />
require('reflect-metadata');
var fs = require('fs');
var Decorators = require('./Decorators');
var path = require('path');
var Promise = require('bluebird');
var glob = require('glob');
var Module = require('module');
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});
var testDir;
if (!process.argv[2]) {
    throw new Error('You must provide a path to the test directory.');
}
else if (!fs.existsSync(testDir = path.join(process.cwd(), process.argv[2]))) {
    var error = "Directory " + process.argv[2] + " does not exist in " + process.cwd() + ".";
    throw new Error(error);
}
var testMocks = {};
var requireOverride = function (targetModule, name) {
    if (testMocks[name] === undefined) {
        var returnObj = Module._load(name, targetModule);
        return returnObj;
    }
    else {
        return testMocks[name];
    }
};
var testReport = {};
var runComplete = false;
(function wait() {
    if (!runComplete)
        setTimeout(wait, 100);
})();
glob(testDir + "/**/*Test.js", function (err, files) {
    if (error)
        throw error;
    var initialPromise = Promise.resolve();
    files.forEach(function (file) {
        var testClass = require(file)['default'];
        var testName = Reflect.getMetadata(Decorators.Names.ModuleDecoratorName, testClass);
        testMocks = Reflect.getMetadata(Decorators.Names.ModuleDecoratorMocks, testClass) || {};
        var testMethods = Reflect.getMetadata(Decorators.Names.TestDecoratorCollection, testClass);
        var testAsyncMethods = Reflect.getMetadata(Decorators.Names.TestAsyncDecoratorCollection, testClass);
        var beforeMethods = Reflect.getMetadata(Decorators.Names.BeforeDecoratorName, testClass);
        var beforeEachMethods = Reflect.getMetadata(Decorators.Names.BeforeEachDecoratorName, testClass);
        var afterMethods = Reflect.getMetadata(Decorators.Names.AfterDecoratorName, testClass);
        var afterEachMethods = Reflect.getMetadata(Decorators.Names.AfterEachDecoratorName, testClass);
        if (!testName || (!testMethods || !testAsyncMethods)) {
            return;
        }
        var testReportResults = testReport[testName] = { tests: [] };
        var undoExtensionsOverride = (testMocks) ? overrideExtensions() : function () { };
        initialPromise = initialPromise.then(function () {
            var initialTestPromise = Promise.resolve();
            ;
            if (beforeMethods) {
                beforeMethods.forEach(function (beforeMethod) { return testClass[beforeMethod](); });
            }
            if (testAsyncMethods) {
                Object.keys(testAsyncMethods).forEach(function (method) {
                    if (testAsyncMethods.hasOwnProperty(method)) {
                        initialTestPromise = initialTestPromise.then(scheduleTest(testClass, method, testAsyncMethods[method], true, testReportResults, beforeEachMethods, afterEachMethods));
                    }
                });
            }
            if (testMethods) {
                Object.keys(testMethods).forEach(function (method) {
                    if (testMethods.hasOwnProperty(method)) {
                        initialTestPromise = initialTestPromise.then(scheduleTest(testClass, method, testMethods[method], false, testReportResults, beforeEachMethods, afterEachMethods));
                    }
                });
            }
            initialTestPromise = initialTestPromise.then(function () {
                if (afterMethods) {
                    afterMethods.forEach(function (afterMethod) { return testClass[afterMethod](); });
                    undoExtensionsOverride();
                }
            });
            return initialTestPromise;
        });
    });
    initialPromise.done(function () {
        console.log(JSON.stringify(testReport, null, '  '));
        runComplete = true;
    });
});
function scheduleTest(testClass, method, testDescription, isAsync, testReportResults, beforeEachMethods, afterEachMethods) {
    return function () {
        if (beforeEachMethods) {
            beforeEachMethods.forEach(function (beforeEachMethod) { return testClass[beforeEachMethod](); });
        }
        var startTime = new Date().getTime();
        return executeTest(testClass, method, isAsync)
            .then(function () {
            if (afterEachMethods) {
                afterEachMethods.forEach(function (afterEachMethod) { return testClass[afterEachMethod](); });
            }
            testReportResults.tests.push({
                name: testDescription,
                isSuccess: true,
                duration: new Date().getTime() - startTime
            });
        })
            .error(function (error) {
            testReportResults.tests.push({
                name: testDescription,
                error: error,
                isSuccess: false,
                duration: new Date().getTime() - startTime
            });
        });
    };
}
function overrideExtensions() {
    var originalExtensions = {};
    Object.keys(require.extensions).forEach(function (extension) {
        // Store the original so we can restore it later
        if (!originalExtensions[extension]) {
            originalExtensions[extension] = require.extensions[extension];
        }
        // Override the default handler for the requested file extension
        require.extensions[extension] = function (targetModule, filename) {
            // Override the require method for this module
            targetModule.require = requireOverride.bind(this, targetModule);
            return originalExtensions[extension](targetModule, filename);
        };
    });
    return function () {
        Object.keys(originalExtensions).forEach(function (extension) {
            require.extensions[extension] = originalExtensions[extension];
        });
    };
}
function executeTest(testClass, testMethod, isAsync) {
    var deferred = Promise.defer();
    if (isAsync) {
        try {
            testClass[testMethod](function () {
                deferred.resolve();
            });
        }
        catch (error) {
            deferred.reject(error);
        }
    }
    else {
        try {
            testClass[testMethod]();
            deferred.resolve();
        }
        catch (error) {
            deferred.reject(error);
        }
    }
    return deferred.promise;
}
