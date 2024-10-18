export default class ErrorReturn extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
