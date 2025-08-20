import React from "react";
import { Modal } from "antd";
import { useFetchTodoByIdQuery } from "../../api/todosApi";

interface TodoDetailsProps {
  todoId: string;
  setTodoId: (id: string | null) => void;
}

const TodoDetails: React.FC<TodoDetailsProps> = ({ todoId, setTodoId }) => {
  const { data: todo, error, isLoading } = useFetchTodoByIdQuery(todoId);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todo details.</div>;

  return (
    <Modal
      open={true}
      title="Todo Details"
      onCancel={() => setTodoId(null)}
      footer={null}
    >
      <div className="todo-details">
        <p className="todo-details-name"> {todo?.name}</p>
        <div
          style={{ background: todo?.color }}
          className="todo-details-status"
        >
          {todo?.status}
        </div>
      </div>
    </Modal>
  );
};

export default TodoDetails;
