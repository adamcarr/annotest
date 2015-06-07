interface IPerson {
	name: string;
	age: number;
	canVote: boolean;
	new (name: string, age: number): IPerson;
}

export default IPerson;