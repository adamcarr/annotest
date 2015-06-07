/// <reference path="typings/tsd.d.ts" />

import 'reflect-metadata';
import * as fs from 'fs';
import * as DecoratorNames from './DecoratorNames';
import annotest from './index';
import IModuleMocks from './IModuleMocks';
import * as path from 'path';
import * as _ from 'lodash';
var Module = require('module');

// process.argv.forEach(function(val, index, array) {
//    console.log(index + ': ' + val);
// });

var testMocks: {[name:string]: any} = {};
var originalRequire = module.require;
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
      var testName = Reflect.getMetadata(DecoratorNames.ModuleDecoratorName, testClass);
      testMocks = Reflect.getMetadata(DecoratorNames.ModuleDecoratorMocks, testClass) || {};
      var testMethods = Reflect.getMetadata(DecoratorNames.TestMethodDecoratorCollection, testClass);
      
      if (!testName || !testMethods) {
        continue;
      }
      
      console.log(testName);
      
      for (var method in testMethods) {
        if (testMethods.hasOwnProperty(method)) {
          console.log(`  ${testMethods[method]}`);
          
          try {
            var undo = overrideExtensions();
            testClass[method]();
            undo();
          } catch (error) {
            console.error(`  Error: ${error}`)
          }
        }
      }
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




var originalModuleMap: {[name:string]: any} = {};

function swapOriginalModulesWithMocks(curPath: string, testMocks: IModuleMocks, cb: Function) {
  for (var name in testMocks) {
    if (testMocks.hasOwnProperty(name)) {
      var mock = testMocks[name];
      var mockPath = path.join(curPath, name);
      replaceModule(mockPath, module.children[module.children.length-1], mock);
    }
  }
  
  
  cb();
  
  for (var name in testMocks) {
    if (testMocks.hasOwnProperty(name)) {
      var mock = testMocks[name];
      var mockPath = path.join(curPath, name);
      replaceModule(mockPath, module.children[module.children.length-1]);
    }
  }
  // console.log(module.children[module.children.length-1].children[1]);
}

function replaceModule (id: string, targetModule: any, mock?: any) {
  // console.log(id, targetModule, mock);
  var foundModule: any = _.find(targetModule.children, {id: id});
  if (foundModule) {
    console.log('foundModule', foundModule, mock);
    if (mock === undefined) {
      foundModule.exports = originalModuleMap[id];
    } else {
      originalModuleMap[id] = foundModule.exports;
      foundModule.exports = mock;
    }
    console.log('after swap', foundModule, mock);    
    return false;
  } else if (targetModule.children && targetModule.children.length > 0) {
    _.forEach(targetModule.children, (childModule) => replaceModule(id, childModule, mock));
  }
}
