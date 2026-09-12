export type ColumnDefinition<T = unknown> = {
  type: string;
};

export type InferModel<
  T extends Record<string, ColumnDefinition>
> = {
  [K in keyof T]:
    T[K] extends ColumnDefinition<infer U> ? U : never;
};


export function number(): ColumnDefinition<number> {
  return {
    type: "number"
  };
}


export function string(): ColumnDefinition<string> {
  return {
    type: "string"
  };
}


export function boolean(): ColumnDefinition<boolean> {
  return {
    type: "boolean"
  };
}


export function defineModel<
  T extends Record<string, ColumnDefinition>
>(
  name: string,
  schema: T
) {
  return {
    name,
    schema
  };
}