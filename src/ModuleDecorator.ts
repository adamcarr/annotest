/// <reference path="typings/tsd.d.ts" />

import 'reflect-metadata';
import IModuleMocks from './IModuleMocks';
import * as DecoratorNames from './DecoratorNames';

function ModuleDecorator(name: string, mocks?: IModuleMocks): ClassDecorator {
	return function(target: Object) {
		Reflect.defineMetadata(DecoratorNames.ModuleDecoratorName, name, target);

		if (mocks) {
			Reflect.defineMetadata(DecoratorNames.ModuleDecoratorMocks, mocks, target);
		}
	}
}

export default ModuleDecorator;