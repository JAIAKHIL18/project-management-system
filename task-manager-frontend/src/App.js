
import React, { useEffect, useState } from "react";
import "./App.css";

const API = "https://project-management-system-bfwc.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Load tasks from MongoDB through the backend
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error("Failed to load tasks");

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      setMessage("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask.trim() }),
      });

      if (!res.ok) throw new Error();

      const task = await res.json();
      setTasks((prev) => [task, ...prev]);
      setNewTask("");
      setMessage("New task added successfully!");
    } catch {
      setMessage("Failed to add task.");
    }
  };

  // Update task status
  const updateTask = async (id, status) => {
    try {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      const updatedTask = await res.json();

      setTasks((prev) =>
        prev.map((task) => task._id === id ? updatedTask : task)
      );

      setMessage("Task status updated successfully!");
    } catch {
      setMessage("Failed to update task.");
    }
  };

  // Delete / archive task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setTasks((prev) => prev.filter((task) => task._id !== id));
      setMessage("Task archived successfully!");
    } catch {
      setMessage("Failed to archive task.");
    }
  };

  const countTasks = (status) =>
    tasks.filter((task) => task.status === status).length;

  const renderTasks = (status) =>
    tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div className="task-card" key={task._id}>
          <h3>**{task.title}**</h3>
          <p>Status: {status === "Pending"
            ? "High Priority"
            : status === "Ongoing"
            ? "Coding/In Progress"
            : "Approved/Finished"}</p>

          <div className="task-actions">
            {status === "Pending" && (
              <>
                <button className="blue"
                  onClick={() => updateTask(task._id, "Ongoing")}>
                  Assign Team
                </button>
                <button className="blue"
                  onClick={() => updateTask(task._id, "Ongoing")}>
                  Draft Specs
                </button>
                <button className="red"
                  onClick={() => updateTask(task._id, "Ongoing")}>
                  Start
                </button>
              </>
            )}

            {status === "Ongoing" && (
              <>
                <button className="green">Code Review</button>
                <button className="green">Testing</button>
                <button className="orange">Blocker</button>
                <button className="blue"
                  onClick={() => updateTask(task._id, "Completed")}>
                  Complete
                </button>
              </>
            )}

            {status === "Completed" && (
              <>
                <button className="gray">View Results</button>
                <button className="gray"
                  onClick={() => deleteTask(task._id)}>
                  Archive
                </button>
              </>
            )}
          </div>
        </div>
      ));

  return (
    <div className="dashboard">
      <header className="header">
        <span className="subtitle">PROJECT WORKSPACE</span>
        <h1>Task Manager</h1>
        <p>Add tasks, track progress, and manage your project in one place.</p>
      </header>

      <section className="summary">
        <div className="summary-card">
          <span>Pending Tasks</span>
          <strong>{countTasks("Pending")}</strong>
        </div>

        <div className="summary-card">
          <span>Ongoing Task</span>
          <strong>{countTasks("Ongoing")}</strong>
        </div>

        <div className="summary-card">
          <span>Completed Tasks</span>
          <strong>{countTasks("Completed")}</strong>
        </div>
      </section>

      {message && <div className="success-message">{message}</div>}

      <section className="add-section">
        <label>Add a new task</label>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter milestone title"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      </section>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <section className="task-board">
          <div className="task-column pending-column">
            <h2>Pending</h2>
            {renderTasks("Pending")}
          </div>

          <div className="task-column ongoing-column">
            <h2>Ongoing</h2>
            {renderTasks("Ongoing")}
          </div>

          <div className="task-column completed-column">
            <h2>Completed</h2>
            {renderTasks("Completed")}
          </div>
        </section>
      )}

      <footer>Project Management Dashboard</footer>
    </div>
  );
}

export default App;
