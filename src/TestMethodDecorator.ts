/// <reference path="typings/tsd.d.ts" />

import 'reflect-metadata';
import * as DecoratorNames from './DecoratorNames';

function TestMethodDecorator(description: string): MethodDecorator {
	return function (target: Object, propertyKey: string) {
		// Reflect.defineMetadata(DecoratorNames.TestMethodDecoratorDescription, description, target);
		
		var testMethodNames: {[propertyKey: string]: any} = {};
		if (Reflect.hasMetadata(DecoratorNames.TestMethodDecoratorCollection, target)) {
			testMethodNames = Reflect.getMetadata(DecoratorNames.TestMethodDecoratorCollection, target);
		}
		
		testMethodNames[propertyKey] = description;
		
		Reflect.defineMetadata(DecoratorNames.TestMethodDecoratorCollection, testMethodNames, target);
	}
}

export default TestMethodDecorator;