/// <reference path="../typings/tsd.d.ts" />

import * as assert from 'assert';
import IsEighteenOrOlder from './IsEighteenOrOlder';
import IPerson from './IPerson';

class Person implements IPerson {
	constructor (public name: string, public age: number) {
		assert(this.age >= 0, `age must be a positive value. [age: ${this.age}]`);
	}
	
	public get canVote() : boolean {
		return IsEighteenOrOlder(this.age);
	}
	
}

export default Person;