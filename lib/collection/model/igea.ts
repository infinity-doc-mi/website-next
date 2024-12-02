export interface GetState<T> {
  (): Readonly<T>;
}
export interface SetState<T> {
  (m: Mutation<T>): void;
}

export interface Mutation<T> {
  (s: T): T;
}

export interface ClassOf<T> {
  new (...args: any[]): T;
}
