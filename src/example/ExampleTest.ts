/// <reference path="../typings/tsd.d.ts" />

import * as assert from 'assert';
import annotest from '../index';
import IPerson from './IPerson';

@annotest.ModuleDecorator('Person tests', {'./IsEighteenOrOlder': {default:(age: number) => age > 19}})
class MyCustomTest {
	
	@annotest.TestMethodDecorator('Testing person constructor')
	static testConstructor() {
		var Person: IPerson = require('./Person')['default'];
		var name = 'Adam';
		var age = 34;
		var person = new Person(name, age);
		
		assert.equal(person.name, name);
		assert.equal(person.age, age, 'Ages should match');
	}
	
	@annotest.TestMethodDecorator('Testing person canVote')	
	static testCanVote() {
		var Person: IPerson = require('./Person')['default'];
		var name = 'Adam';
		var age = 18;
		var person = new Person(name, age);
		
		assert(person.canVote, `Person is ${person.age} and is 18 or older and should be able to vote.`);
	}
}

export default MyCustomTest;