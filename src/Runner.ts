/// <reference path="typings/tsd.d.ts" />

import 'reflect-metadata';
import * as fs from 'fs';
import * as Decorators from './Decorators';
import annotest from './index';
import IModuleMocks from './IModuleMocks';
import * as path from 'path';
import * as _ from 'lodash';
import * as Promise from 'bluebird';
import ITestReport from './ITestReport';
import * as glob from 'glob';
var Module = require('module');

process.argv.forEach(function(val, index, array) {
   console.log(index + ': ' + val);
});

var testDir: string;

if (!process.argv[2]) {
  throw new Error('You must provide a path to the test directory.');
} else if (!fs.existsSync(testDir = path.join(process.cwd(), process.argv[2]))) {
  var error = `Directory ${process.argv[2]} does not exist in ${process.cwd()}.`;
  throw new Error(error);
}

var testMocks: { [name: string]: any } = {};
var requireOverride = <any>function(targetModule: any, name: string): any {
  if (testMocks[name] === undefined) {
    var returnObj = Module._load(name, targetModule);
    return returnObj;
  } else {
    return testMocks[name];
  }
};

var testReport: ITestReport = {};
var runComplete = false;

(function wait() {
  if (!runComplete) setTimeout(wait, 100);
})();

glob(`${testDir}/**/*Test.js`, (err, files) => {
  if (error) throw error;
  
  var initialPromise: Promise<any> = Promise.resolve();
  
  files.forEach(file => {
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
    
    var testReportResults = testReport[testName] = <any>{tests: []};
    var undoExtensionsOverride = (testMocks) ? overrideExtensions() : () => {};

    initialPromise = initialPromise.then(function() {
      var initialTestPromise: Promise<any> = Promise.resolve();;

      if (beforeMethods) {
        beforeMethods.forEach((beforeMethod: string) => testClass[beforeMethod]());
      }
      
      if (testAsyncMethods) {        
        Object.keys(testAsyncMethods).forEach((method) => {
          if (testAsyncMethods.hasOwnProperty(method)) {
            initialTestPromise = initialTestPromise.then(scheduleTest(testClass, method, testAsyncMethods[method], true, testReportResults, beforeEachMethods, afterEachMethods));
          }
        });
      }
      
      if (testMethods) {
        Object.keys(testMethods).forEach((method) => {
          if (testMethods.hasOwnProperty(method)) {
            initialTestPromise = initialTestPromise.then(scheduleTest(testClass, method, testMethods[method], false, testReportResults, beforeEachMethods, afterEachMethods));
          }
        });
      }

      initialTestPromise = initialTestPromise.then(function() {
        if (afterMethods) {
          afterMethods.forEach((afterMethod: string) => testClass[afterMethod]());
          undoExtensionsOverride();
        }
      });
      
      return initialTestPromise;
    });
  });
  
  initialPromise.done(() => {
    console.log(JSON.stringify(testReport, null, '  '));
    runComplete = true;
  });
});

function scheduleTest(testClass: any, method: string, testDescription: string, isAsync: boolean, testReportResults: any, beforeEachMethods: string[], afterEachMethods: string[]): () => Promise<any> {
  return function() {
    if (beforeEachMethods) {
      beforeEachMethods.forEach((beforeEachMethod: string) => testClass[beforeEachMethod]());
    }
  
    var startTime = new Date().getTime();
    return executeTest(testClass, method, isAsync)
      .then(function() {
        if (afterEachMethods) {
          afterEachMethods.forEach((afterEachMethod: string) => testClass[afterEachMethod]());
        }
        testReportResults.tests.push({
          name: testDescription,
          isSuccess: true,
          duration: new Date().getTime() - startTime
        });
      })
      .error((error) => {testReportResults.tests.push({
          name: testDescription,
          error: error,
          isSuccess: false,
          duration: new Date().getTime() - startTime
        });
      });
  }
}

function overrideExtensions() {
  var originalExtensions: { [name: string]: any } = {};
  Object.keys(require.extensions).forEach(function(extension) {
    // Store the original so we can restore it later
    if (!originalExtensions[extension]) {
      originalExtensions[extension] = require.extensions[extension];
    }
  
    // Override the default handler for the requested file extension
    require.extensions[extension] = function(targetModule: any, filename: any) {
      // Override the require method for this module
      targetModule.require = requireOverride.bind(this, targetModule);

      return originalExtensions[extension](targetModule, filename);
    };
  });

  return function() {
    Object.keys(originalExtensions).forEach(function(extension) {
      require.extensions[extension] = originalExtensions[extension];
    });
  };
}

function executeTest(
  testClass: any,
  testMethod: string,
  isAsync: boolean): Promise<any> {
  var deferred = Promise.defer();

  if (isAsync) {
    try {
      testClass[testMethod](() => {
        deferred.resolve();
      });
    } catch (error) {
      deferred.reject(error);
    }
  } else {
    try {
      testClass[testMethod]();
      deferred.resolve();
    } catch (error) {
      deferred.reject(error);
    }
  }

  return deferred.promise;
}