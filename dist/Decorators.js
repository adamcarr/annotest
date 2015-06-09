var MethodNameDecorator_1 = require('./MethodNameDecorator');
exports.Names = {
    ModuleDecoratorMocks: 'annotest:ModuleDecoratorMocks',
    ModuleDecoratorName: 'annotest:ModuleDecoratorName',
    TestDecoratorCollection: 'annotest:TestDecoratorCollection',
    TestAsyncDecoratorCollection: 'annotest:TestAsyncDecoratorCollection',
    BeforeDecoratorName: 'annotest:BeforeDecoratorName',
    AfterDecoratorName: 'annotest:AfterDecoratorName',
    BeforeEachDecoratorName: 'annotest:BeforeEachDecoratorName',
    AfterEachDecoratorName: 'annotest:AfterEachDecoratorName'
};
exports.BeforeDecorator = MethodNameDecorator_1.default(exports.Names.BeforeDecoratorName);
exports.BeforeEachDecorator = MethodNameDecorator_1.default(exports.Names.BeforeEachDecoratorName);
exports.AfterDecorator = MethodNameDecorator_1.default(exports.Names.AfterDecoratorName);
exports.AfterEachDecorator = MethodNameDecorator_1.default(exports.Names.AfterEachDecoratorName);
function TestDecorator(description) {
    return function (target, propertyKey) {
        var testMethodNames = {};
        if (Reflect.hasMetadata(exports.Names.TestDecoratorCollection, target)) {
            testMethodNames = Reflect.getMetadata(exports.Names.TestDecoratorCollection, target);
        }
        testMethodNames[propertyKey] = description;
        Reflect.defineMetadata(exports.Names.TestDecoratorCollection, testMethodNames, target);
    };
}
exports.TestDecorator = TestDecorator;
function TestAsyncDecorator(description) {
    return function (target, propertyKey) {
        var testMethodNames = {};
        if (Reflect.hasMetadata(exports.Names.TestAsyncDecoratorCollection, target)) {
            testMethodNames = Reflect.getMetadata(exports.Names.TestAsyncDecoratorCollection, target);
        }
        testMethodNames[propertyKey] = description;
        Reflect.defineMetadata(exports.Names.TestAsyncDecoratorCollection, testMethodNames, target);
    };
}
exports.TestAsyncDecorator = TestAsyncDecorator;
function ModuleDecorator(name, mocks) {
    return function (target) {
        Reflect.defineMetadata(exports.Names.ModuleDecoratorName, name, target);
        if (mocks) {
            Reflect.defineMetadata(exports.Names.ModuleDecoratorMocks, mocks, target);
        }
    };
}
exports.ModuleDecorator = ModuleDecorator;
