import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Todo, TodoResponse } from "../types/todosTypes";
import { Status } from "../types/statusTypes";
import { colors } from "../types/colorTypes";

interface updateStatus {
  id: string;
  status: Status;
  color: colors;
  page: number;
  limit: number;
}

const baseUrl = "http://localhost:3001";
const TODO_TAG_NAME = "Todos";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: [TODO_TAG_NAME],
  endpoints: (builder) => ({
    fetchTodosInfinite: builder.query<
      TodoResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/todos?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.todos.map(({ id }) => ({ type: TODO_TAG_NAME, id })),
              TODO_TAG_NAME,
            ]
          : [TODO_TAG_NAME],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },

      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        const isNewQuery = newItems.page === 1;
        if (isNewQuery) {
          // currentCache.page = newItems.page;
          currentCache = newItems;
        } else {
          currentCache.todos.push(...newItems.todos);
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    fetchTodoById: builder.query<Todo, string>({
      query: (id) => `/todos/${id}`,
      providesTags: (_result, _error, id) => [{ type: TODO_TAG_NAME, id }],
    }),

    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (newTodo) => ({
        url: "/todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: [{ type: TODO_TAG_NAME }],
    }),

    updateTodo: builder.mutation<Todo, updateStatus>({
      query: ({ id, ...todo }) => ({
        url: `/todos/${id}`,
        method: "PUT",
        body: todo,
      }),
      onQueryStarted: async (
        { id, status, color, page, limit },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          todosApi.util.updateQueryData(
            "fetchTodosInfinite",
            { page, limit },
            (draft) => {
              const todoToUpdate = draft.todos.find((todo) => todo.id === id);
              if (todoToUpdate) {
                todoToUpdate.status = status;
                todoToUpdate.color = color;

                // const oldStatus = todoToUpdate.status;
                // if (draft.statusCount) {
                //   if (draft.statusCount[oldStatus] !== undefined) {
                //     draft.statusCount[oldStatus] = Math.max(
                //       draft.statusCount[oldStatus] - 1,
                //       0
                //     );
                //   }
                //   if (draft.statusCount[status] !== undefined) {
                //     draft.statusCount[status] += 1;
                //   }
                // }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_, _error, { id }) => [{ type: TODO_TAG_NAME, id }],
    }),

    deleteTodo: builder.mutation<
      { id: string },
      { id: string; page: number; limit: number }
    >({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (
        { id, page, limit },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          todosApi.util.updateQueryData(
            "fetchTodosInfinite",
            { page, limit },
            (draft) => {
              const todoToDelete = draft.todos.find((todo) => todo.id === id);
              if (todoToDelete) {
                // Remove the todo
                draft.todos = draft.todos.filter((todo) => todo.id !== id);
                // const status = todoToDelete.status;
                // if (
                //   status &&
                //   draft.statusCount &&
                //   draft.statusCount[status] !== undefined
                // ) {
                //   draft.statusCount[status] = Math.max(
                //     draft.statusCount[status] - 1,
                //     0
                //   );
                // }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: TODO_TAG_NAME, id },
      ],
    }),
  }),
});

export const {
  useFetchTodosInfiniteQuery,
  useFetchTodoByIdQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
