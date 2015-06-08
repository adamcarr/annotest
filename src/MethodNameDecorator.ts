/// <reference path="typings/tsd.d.ts" />

import 'reflect-metadata';
import * as _ from 'lodash';

function MethodNameDecorator(metadataName: string): MethodDecorator {
	return function (target: Object, propertyKey: string) {
		var propertyNames: string[] = [];
		if (Reflect.hasMetadata(metadataName, target)) {
			propertyNames = Reflect.getMetadata(metadataName, target);
		}
		
		if (!_.contains(propertyNames, propertyKey)){
			propertyNames.push(propertyKey);
		}
		
		Reflect.defineMetadata(metadataName, propertyNames, target);
	}
}

export default MethodNameDecorator;