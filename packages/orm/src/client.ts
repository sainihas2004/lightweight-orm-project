import {
  buildDelete,
  buildInsert,
  buildSelect,
  buildUpdate
} from "./query-builder.js";

import type {
  ColumnDefinition,
  InferModel
} from "./schema.js";


export interface DatabaseDriver {
  query(
    text: string,
    values?: unknown[]
  ): Promise<unknown[]>;
}


export interface Model<TSchema extends Record<string, ColumnDefinition>> {
  name: string;
  schema: TSchema;
}


export class ModelClient<
  TSchema extends Record<string, ColumnDefinition>
> {

  model: Model<TSchema>;

  driver: DatabaseDriver;


  constructor(
    model: Model<TSchema>,
    driver: DatabaseDriver
  ) {
    this.model = model;
    this.driver = driver;
  }


  async create(
    data: Partial<InferModel<TSchema>>
  ): Promise<unknown> {

    const query = buildInsert(
      this.model.name,
      data as Record<string, unknown>
    );

    const result = await this.driver.query(
      query.text,
      query.values
    );

    return result[0];
  }


  async findMany(
    options?: {
      where?: Partial<InferModel<TSchema>>;
    }
  ): Promise<unknown[]> {

    const query = buildSelect(
      this.model.name,
      options?.where as Record<string, unknown> | undefined
    );

    return this.driver.query(
      query.text,
      query.values
    );
  }


  async update(
    id: number,
    data: Partial<InferModel<TSchema>>
  ): Promise<unknown> {

    const query = buildUpdate(
      this.model.name,
      id,
      data as Record<string, unknown>
    );

    const result = await this.driver.query(
      query.text,
      query.values
    );

    return result[0];
  }


  async delete(
    id: number
  ): Promise<unknown> {

    const query = buildDelete(
      this.model.name,
      id
    );

    const result = await this.driver.query(
      query.text,
      query.values
    );

    return result[0];
  }
}


export function createClient<
  TModels extends Record<
    string,
    Model<Record<string, ColumnDefinition>>
  >
>(
  models: TModels,
  driver: DatabaseDriver
): {
  [K in keyof TModels]:
    ModelClient<TModels[K]["schema"]>;
} {

  const client = {} as {
    [K in keyof TModels]:
      ModelClient<TModels[K]["schema"]>;
  };


  for (const key in models) {

    client[key] = new ModelClient(
      models[key],
      driver
    );
  }


  return client;
}