import {
  defineModel,
  number,
  string,
  boolean
} from "@sai_nihas/lightweight-orm";

export const Todo = defineModel("todos", {
  id: number(),
  title: string(),
  completed: boolean()
});