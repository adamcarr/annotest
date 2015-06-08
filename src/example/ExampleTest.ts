/// <reference path="../typings/tsd.d.ts" />

import * as assert from 'assert';
import annotest from '../index';
import {IPerson, IPersonWithCtor} from './IPerson';

	
var name = 'Adam';
var age = 34;

@annotest.TestModule('Person tests', {'./IsEighteenOrOlder': {default:(age: number) => age > 19}})
class MyCustomTest {
	static Person: IPerson;
	
	@annotest.Before
	static before() {
		var personConstructor: IPersonWithCtor = require('./Person')['default'];
		MyCustomTest.Person = new personConstructor(name, age);
		console.log('before called');
	}
	
	@annotest.BeforeEach
	static beforeEach() {console.log('beforeEach called');}
	
	@annotest.AfterEach
	static afterEach() {console.log('afterEach called');}
	
	@annotest.After
	static after() {console.log('after called');}
	
	@annotest.Test('Testing person constructor')
	static testConstructor() {
		assert.equal(MyCustomTest.Person.name, name);
		assert.equal(MyCustomTest.Person.age, age, 'Ages should match');
	}
	
	@annotest.Test('Testing person canVote')	
	static testCanVote() {
		MyCustomTest.Person.age = 18;
		assert(MyCustomTest.Person.canVote, `Person is ${MyCustomTest.Person.age} and is 18 or older and should be able to vote.`);
	}
}

export default MyCustomTest;