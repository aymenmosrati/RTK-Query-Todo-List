import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FixedSizeList as List } from "react-window";
import {
  useDeleteTodoMutation,
  useFetchTodosInfiniteQuery,
  useUpdateTodoMutation,
} from "../../api/todosApi";
import TodoItem from "../../components/TodoItem";
import StatusFilter from "../../components/StatusFilter";
import { Status, TodoStatus } from "../../types/statusTypes";
import { statusColors } from "../../types/colorTypes";
import TodoDetails from "../TodoDetails";
import { Todo } from "../../types/todosTypes";

const TodoList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [todoId, setTodoId] = useState<string | null>(null);
  const limit = 10;
  const {
    data: taskResponse,
    error,
    isLoading,
    isFetching,
  } = useFetchTodosInfiniteQuery({ page, limit });
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [filterStatus, setFilterStatus] = useState<string>(TodoStatus.All);

  const loadMoreTodos = () => {
    console.log("load more");
    if ((taskResponse?.todos?.length ?? 0) < (taskResponse?.total ?? 0)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleTabClick = (status: string) => setFilterStatus(status);

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({ id, page, limit });
      console.log(`Todo with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete the todo:", error);
    }
  };

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    const newStatus = event.target.value;
    updateTodo({
      id,
      color: statusColors[newStatus as Status],
      status: newStatus as Status,
      page,
      limit,
    });
  };

  const tabs = [
    {
      label: TodoStatus.All,
      status: TodoStatus.All,
      count: taskResponse?.total || 0,
      bg: statusColors.all,
    },
    {
      label: TodoStatus.ToDo,
      status: TodoStatus.ToDo,
      count: taskResponse?.statusCount?.[TodoStatus.ToDo] || 0,
      bg: statusColors[TodoStatus.ToDo],
    },
    {
      label: TodoStatus.InProgress,
      status: TodoStatus.InProgress,
      count: taskResponse?.statusCount?.[TodoStatus.InProgress] || 0,
      bg: statusColors[TodoStatus.InProgress],
    },
    {
      label: TodoStatus.InReview,
      status: TodoStatus.InReview,
      count: taskResponse?.statusCount?.[TodoStatus.InReview] || 0,
      bg: statusColors[TodoStatus.InReview],
    },
    {
      label: TodoStatus.Resolved,
      status: TodoStatus.Resolved,
      count: taskResponse?.statusCount?.[TodoStatus.Resolved] || 0,
      bg: statusColors[TodoStatus.Resolved],
    },
  ];

  const filteredTodos =
    taskResponse?.todos?.filter((todo) =>
      filterStatus === TodoStatus.All ? true : todo.status === filterStatus
    ) || [];

  if (isLoading && page === 1) return <p>Loading...</p>;
  if (error) return <div>Error..</div>;

  return (
    <div className="task-list">
      <div className="header-tabs">
        {tabs.map((tab) => (
          <StatusFilter
            key={tab.status}
            isActive={filterStatus === tab.status}
            onClick={handleTabClick}
            {...tab}
          />
        ))}
      </div>
      <InfiniteScroll
        dataLength={filteredTodos?.length || 0}
        next={loadMoreTodos}
        hasMore={
          (taskResponse?.todos?.length ?? 0) < (taskResponse?.total ?? 0)
        }
        loader={isFetching ? <h4>Loading...</h4> : null}
        scrollableTarget="scrollableDiv"
        style={{ overflow: "hidden" }}
      >
        <div id="scrollableDiv" style={{ height: "100%", overflow: "auto" }}>
          <List
            height={300}
            itemCount={filteredTodos?.length || 0}
            itemSize={52}
            width="100%"
            outerElementType="div"
            style={{ overflow: "visible" }}
          >
            {({ index, style }) => (
              <div style={style}>
                <TodoItem
                  task={filteredTodos[index]}
                  handleDelete={() => handleDelete(filteredTodos[index].id)}
                  handleStatusChange={(e) =>
                    handleStatusChange(e, filteredTodos[index].id)
                  }
                  handleDetails={() => setTodoId(filteredTodos[index].id)}
                />
              </div>
            )}
          </List>
        </div>
      </InfiniteScroll>
      {todoId && <TodoDetails todoId={todoId} setTodoId={setTodoId} />}
    </div>
  );
};

export default TodoList;
