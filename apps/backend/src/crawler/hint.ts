export class Hint {
  private constructor(
    readonly literal: string,
    readonly pattern: string,
  ) {}

  static build(literal: string, pattern: string): Hint {
    return new Hint(literal, pattern);
  }
}
