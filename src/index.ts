import * as Decorators from './Decorators';

var module = {
	TestModule: Decorators.ModuleDecorator,
	Test: Decorators.TestDecorator,
	Before: Decorators.BeforeDecorator,
	BeforeEach: Decorators.BeforeEachDecorator,
	After: Decorators.AfterDecorator,
	AfterEach: Decorators.AfterEachDecorator
};

export default module;