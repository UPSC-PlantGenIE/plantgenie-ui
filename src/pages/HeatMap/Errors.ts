export class NoGeneListsError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, NoGeneListsError.prototype);
  }
}

export class ExpressionFetchError extends Error {}
