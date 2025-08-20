import React from "react";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { Todo } from "../../types/todosTypes";
import { statusOptions } from "../../types/statusTypes";

interface TodoItemProps {
  task: Todo;
  handleDelete: () => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDetails: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  task,
  handleDelete,
  handleStatusChange,
  handleDetails,
}) => {
  return (
    <div className="task-item">
      <div className="name-column">
        <div className="name-initial">{task?.name[0]}</div>
        <div className="name-text">{task?.name}</div>
      </div>
      <div className="status-column">
        <select
          className={`status-pill ${task?.status
            .toLowerCase()
            .replace(" ", "-")}`}
          style={{ background: task?.color }}
          value={task?.status}
          onChange={(e) => handleStatusChange(e)}
        >
          <option value={task?.status} disabled>
            {task?.status}
          </option>
          {statusOptions
            .filter((status) => status !== task?.status)
            .map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
        </select>
        <button onClick={handleDelete} className="btn-delete">
          <MdOutlineDelete />
        </button>
        <button onClick={handleDetails} className="btn-details">
          <MdOutlineRemoveRedEye />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
