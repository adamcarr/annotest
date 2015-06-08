/// <reference path="typings/tsd.d.ts" />

import 'reflect-metadata';
import * as fs from 'fs';
import * as Decorators from './Decorators';
import annotest from './index';
import IModuleMocks from './IModuleMocks';
import * as path from 'path';
import * as _ from 'lodash';
var Module = require('module');

// process.argv.forEach(function(val, index, array) {
//    console.log(index + ': ' + val);
// });

var testMocks: {[name:string]: any} = {};
var newrequire = <any>function (targetModule: any, name: string): any {
  if(testMocks[name] === undefined) {
    var returnObj = Module._load(name, targetModule);
    return returnObj;
  } else {
    return testMocks[name];
  }
};

fs.readdir('./dist/example', (err, files) => {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (/Test\.js$/.exec(file)) {
      var testClass = require(`./example/${file}`)['default'];
      var testName = Reflect.getMetadata(Decorators.Names.ModuleDecoratorName, testClass);
      testMocks = Reflect.getMetadata(Decorators.Names.ModuleDecoratorMocks, testClass) || {};
      var testMethods = Reflect.getMetadata(Decorators.Names.TestMethodDecoratorCollection, testClass);
      var beforeMethods = Reflect.getMetadata(Decorators.Names.BeforeDecoratorName, testClass);
      var beforeEachMethods = Reflect.getMetadata(Decorators.Names.BeforeEachDecoratorName, testClass);
      var afterMethods = Reflect.getMetadata(Decorators.Names.AfterDecoratorName, testClass);
      var afterEachMethods = Reflect.getMetadata(Decorators.Names.AfterEachDecoratorName, testClass);

      if (!testName || !testMethods) {
        continue;
      }
      
      console.log(testName);
      var undoExtensionsOverride = overrideExtensions();
      
      if (beforeMethods) {
        beforeMethods.forEach((beforeMethod: string) => testClass[beforeMethod]());
      }
      
      for (var method in testMethods) {
        if (testMethods.hasOwnProperty(method)) {
          
          if (beforeEachMethods) {
            beforeEachMethods.forEach((beforeEachMethod: string) => testClass[beforeEachMethod]());
          }
          
          console.log(`  ${testMethods[method]}`);

          try {
            testClass[method]();
          } catch (error) {
            console.error(`  Error: ${error}`)
          }
          
          if (afterEachMethods) {
            afterEachMethods.forEach((afterEachMethod: string) => testClass[afterEachMethod]());
          }
        }
      }
      
      if (afterMethods) {
        afterMethods.forEach((afterMethod: string) => testClass[afterMethod]());
      }

      undoExtensionsOverride();
    }
  }
});

function overrideExtensions () {
  var originalExtensions: {[name:string]: any} = {};
  Object.keys(require.extensions).forEach(function(extension) {
    // Store the original so we can restore it later
    if (!originalExtensions[extension]) {
      originalExtensions[extension] = require.extensions[extension];
    }
  
    // Override the default handler for the requested file extension
    require.extensions[extension] = function(targetModule: any, filename: any) {
      // Override the require method for this module
      targetModule.require = newrequire.bind(this, targetModule);
  
      return originalExtensions[extension](targetModule, filename);
    };
  });
  
  return function() {
    Object.keys(originalExtensions).forEach(function(extension) {
      require.extensions[extension] = originalExtensions[extension];
    });
  };
}