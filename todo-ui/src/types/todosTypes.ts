import { colors } from "./colorTypes";
import { Status, StatusCount } from "./statusTypes";

export interface Todo {
  id: string;
  name: string;
  status: Status;
  color?: colors;
}

export interface TodoResponse {
  total: number;
  page: number;
  limit: number;
  todos: Todo[];
  statusCount: StatusCount;
}
