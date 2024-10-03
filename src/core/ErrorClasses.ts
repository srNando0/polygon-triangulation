export class NullError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = "NullError";
	}
}