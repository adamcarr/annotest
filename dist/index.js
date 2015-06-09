var Decorators = require('./Decorators');
var module = {
    TestModule: Decorators.ModuleDecorator,
    Test: Decorators.TestDecorator,
    TestAsync: Decorators.TestAsyncDecorator,
    Before: Decorators.BeforeDecorator,
    BeforeEach: Decorators.BeforeEachDecorator,
    After: Decorators.AfterDecorator,
    AfterEach: Decorators.AfterEachDecorator
};
exports.default = module;
