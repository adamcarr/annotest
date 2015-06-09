interface ITestReport {
	[name: string]: {
		tests: {
			name: string;
			isSuccess: boolean;
			error?: string;
			durationMs: number;
		}[];
	}
}

export default ITestReport;