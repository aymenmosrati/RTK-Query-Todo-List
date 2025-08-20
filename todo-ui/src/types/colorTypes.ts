import { TodoStatus } from "./statusTypes";

export type colors = "#6666ff" | "#33aaff" | "#33cc33" | "#ffcc00" | "#d2d2dc";

export const statusColors: Record<TodoStatus, colors> = {
  [TodoStatus.ToDo]: "#6666ff",
  [TodoStatus.InProgress]: "#33aaff",
  [TodoStatus.Resolved]: "#33cc33",
  [TodoStatus.InReview]: "#ffcc00",
  [TodoStatus.All]: "#d2d2dc",
};
