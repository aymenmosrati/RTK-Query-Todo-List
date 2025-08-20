import AddTodoForm from "./features/AddTodoForm";
import TodoList from "./features/TodoList";

function App() {
  return (
    <div className="todos-app">
      <AddTodoForm />
      <TodoList />
    </div>
  );
}

export default App;
