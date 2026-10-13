import { neon } from "@neondatabase/serverless";

type QueryStatement = {
	query: string;
	values: unknown[];
};

function connection() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error("DATABASE_URL must be configured");
	return neon(url);
}

function postgresQuery(query: string) {
	let index = 0;
	return query.replace(/\?/g, () => `$${++index}`);
}

class PreparedQuery implements QueryStatement {
	values: unknown[] = [];

	constructor(public query: string) {}

	bind(...values: unknown[]) {
		this.values = values;
		return this;
	}

	async first<T>() {
		const rows = await connection().query(postgresQuery(this.query), this.values);
		return (rows[0] as T | undefined) ?? null;
	}

	async all<T>() {
		const results = await connection().query(postgresQuery(this.query), this.values);
		return { results: results as T[] };
	}

	async run() {
		const rows = await connection().query(postgresQuery(this.query), this.values);
		return { meta: { changes: rows.length } };
	}
}

export function interviewDb() {
	return {
		prepare(query: string) {
			return new PreparedQuery(query);
		},
		async batch(statements: PreparedQuery[]) {
			const sql = connection();
			const results = await sql.transaction(
				statements.map((statement) =>
					sql.query(postgresQuery(statement.query), statement.values),
				),
			);
			return results.map((rows) => ({ meta: { changes: rows.length } }));
		},
	};
}
