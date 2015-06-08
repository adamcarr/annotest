export interface IPerson {
	name: string;
	age: number;
	canVote: boolean;
}

export interface IPersonWithCtor extends IPerson {
	new (name: string, age: number): IPerson;
}

export default IPerson;