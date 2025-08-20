import React, { useState } from "react";
import { useAddTodoMutation } from "../../api/todosApi";
import { Status, statusOptions, TodoStatus } from "../../types/statusTypes";
import { statusColors } from "../../types/colorTypes";
import { Todo } from "../../types/todosTypes";

const AddTodoForm: React.FC = () => {
  const [todo, setTodo] = useState<Partial<Todo>>({
    name: "",
    status: TodoStatus.ToDo,
    color: statusColors[TodoStatus.ToDo],
  });

  const [addTask, { isLoading }] = useAddTodoMutation();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo.name) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await addTask(todo).unwrap();

      setTodo({
        name: "",
        status: TodoStatus.ToDo,
        color: statusColors[TodoStatus.ToDo],
      });
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  return (
    <form onSubmit={handleAddTask} className="add-task-form">
      <div>
        <label htmlFor="todoName">Task Name</label>
        <input
          type="text"
          id="todoName"
          value={todo.name}
          onChange={(e) => setTodo({ ...todo, name: e.target.value })}
          placeholder="Enter task name"
          required
        />
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={todo.status}
          onChange={(e) => {
            const newStatus = e.target.value as Status;
            setTodo({
              ...todo,
              status: newStatus,
              color: statusColors[newStatus],
            });
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default AddTodoForm;
