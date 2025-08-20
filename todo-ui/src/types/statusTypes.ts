export enum TodoStatus {
  ToDo = "to do",
  InProgress = "in progress",
  Resolved = "resolved",
  InReview = "in review",
  All = "all",
}

export type Status =
  | TodoStatus.ToDo
  | TodoStatus.InProgress
  | TodoStatus.Resolved
  | TodoStatus.InReview;

export type StatusAll = Status | TodoStatus.All;

export interface StatusCount {
  [TodoStatus.ToDo]?: number;
  [TodoStatus.InProgress]?: number;
  [TodoStatus.InReview]?: number;
  [TodoStatus.Resolved]?: number;
}

export const statusOptions = [
  TodoStatus.ToDo,
  TodoStatus.InProgress,
  TodoStatus.InReview,
  TodoStatus.Resolved,
];
