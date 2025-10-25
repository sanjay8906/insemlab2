import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // Load data from JSON server (GET)
  useEffect(() => {
    fetch("http://localhost:6000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log("Error loading tasks:", err));
  }, []);

  // Add new task (POST)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;

    const newTask = { text: task, completed: false };

    fetch("http://localhost:6000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => setTasks([...tasks, data]));

    setTask("");
  };

  // Toggle completion (PATCH/PUT)
  const toggleTask = (id, completed) => {
    fetch(`http://localhost:6000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    }).then(() => {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    });
  };

  // Delete task (DELETE)
  const deleteTask = (id) => {
    fetch(`http://localhost:6000/tasks/${id}`, { method: "DELETE" }).then(() => {
      setTasks(tasks.filter((t) => t.id !== id));
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>To-Do List Application</h2>

      {/* Controlled form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Conditional Rendering */}
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((t) => (
            <li key={t.id} style={{ margin: "8px 0" }}>
              <span
                onClick={() => toggleTask(t.id, t.completed)}
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {t.text}
              </span>
              <button onClick={() => deleteTask(t.id)} style={{ marginLeft: "10px" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
