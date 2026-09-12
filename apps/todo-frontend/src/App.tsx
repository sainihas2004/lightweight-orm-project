import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // Get todos from backend
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const data = await response.json();

      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  // Load todos when page starts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const handleAddTodo = async () => {
    if (!title.trim()) {
      alert("Please enter a todo");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title
        })
      });

      const newTodo = await response.json();

      setTodos([...todos, newTodo]);
      setTitle("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  // Mark todo as completed
  const handleCompleteTodo = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PATCH"
      });

      // Reload updated todos
      fetchTodos();
    } catch (error) {
      console.error("Failed to complete todo:", error);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE"
      });

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="app">
      <h1>My Todo App</h1>

      <div className="todo-form">
        <input
          type="text"
          placeholder="Enter a new todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="add-button"
          onClick={handleAddTodo}
        >
          Add Todo
        </button>
      </div>

      <h2>My Todos</h2>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <span
              className={`todo-title ${
                todo.completed ? "completed" : ""
              }`}
            >
              {todo.title}
            </span>

            <div className="actions">
              {!todo.completed && (
                <button
                  className="complete-button"
                  onClick={() => handleCompleteTodo(todo.id)}
                >
                  Complete
                </button>
              )}

              <button
                className="delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;