import MethodNameDecorator from './MethodNameDecorator';
import IModuleMocks from './IModuleMocks';

export var Names = {
	ModuleDecoratorMocks:'annotest:ModuleDecoratorMocks',
	ModuleDecoratorName:'annotest:ModuleDecoratorName',
	TestDecoratorCollection:'annotest:TestDecoratorCollection',
	TestAsyncDecoratorCollection:'annotest:TestAsyncDecoratorCollection',
	BeforeDecoratorName:'annotest:BeforeDecoratorName',
	AfterDecoratorName:'annotest:AfterDecoratorName',
	BeforeEachDecoratorName:'annotest:BeforeEachDecoratorName',
	AfterEachDecoratorName:'annotest:AfterEachDecoratorName'
}

export var BeforeDecorator: MethodDecorator = MethodNameDecorator(Names.BeforeDecoratorName);
export var BeforeEachDecorator: MethodDecorator = MethodNameDecorator(Names.BeforeEachDecoratorName);
export var AfterDecorator: MethodDecorator = MethodNameDecorator(Names.AfterDecoratorName);
export var AfterEachDecorator: MethodDecorator = MethodNameDecorator(Names.AfterEachDecoratorName);

export function TestDecorator(description: string): MethodDecorator {
	return function (target: Object, propertyKey: string) {
		var testMethodNames: {[propertyKey: string]: any} = {};
		if (Reflect.hasMetadata(Names.TestDecoratorCollection, target)) {
			testMethodNames = Reflect.getMetadata(Names.TestDecoratorCollection, target);
		}
		
		testMethodNames[propertyKey] = description;
		
		Reflect.defineMetadata(Names.TestDecoratorCollection, testMethodNames, target);
	}
}

export function TestAsyncDecorator(description: string): MethodDecorator {
	return function (target: Object, propertyKey: string) {
		var testMethodNames: {[propertyKey: string]: any} = {};
		if (Reflect.hasMetadata(Names.TestAsyncDecoratorCollection, target)) {
			testMethodNames = Reflect.getMetadata(Names.TestAsyncDecoratorCollection, target);
		}
		
		testMethodNames[propertyKey] = description;
		
		Reflect.defineMetadata(Names.TestAsyncDecoratorCollection, testMethodNames, target);
	}
}

export function ModuleDecorator(name: string, mocks?: IModuleMocks): ClassDecorator {
	return function(target: Object) {
		Reflect.defineMetadata(Names.ModuleDecoratorName, name, target);

		if (mocks) {
			Reflect.defineMetadata(Names.ModuleDecoratorMocks, mocks, target);
		}
	}
}