import MethodNameDecorator from './MethodNameDecorator';
import IModuleMocks from './IModuleMocks';

export var Names = {
	ModuleDecoratorMocks:'annotest:ModuleDecoratorMocks',
	ModuleDecoratorName:'annotest:ModuleDecoratorName',
	TestMethodDecoratorCollection:'annotest:TestMethodDecoratorCollection',
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
		if (Reflect.hasMetadata(Names.TestMethodDecoratorCollection, target)) {
			testMethodNames = Reflect.getMetadata(Names.TestMethodDecoratorCollection, target);
		}
		
		testMethodNames[propertyKey] = description;
		
		Reflect.defineMetadata(Names.TestMethodDecoratorCollection, testMethodNames, target);
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