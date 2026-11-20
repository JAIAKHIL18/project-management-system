
import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Core Feature Development",
      priority: "High Priority",
      status: "Pending",
    },
    {
      id: 2,
      title: "API Integration V2",
      priority: "In Progress",
      status: "Ongoing",
    },
    {
      id: 3,
      title: "User Acceptance Testing",
      priority: "Approved/Finished",
      status: "Completed",
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [message, setMessage] = useState("Task status updated successfully!");

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask,
      priority: "High Priority",
      status: "Pending",
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setMessage("New task added successfully!");
  };

  const updateTask = (id, status) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );

    setMessage("Task status updated successfully!");
  };

  const countTasks = (status) =>
    tasks.filter((task) => task.status === status).length;

  const renderTasks = (status) =>
    tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div className="task-card" key={task.id}>
          <h3>**{task.title}**</h3>
          <p>Status: {task.priority}</p>

          <div className="task-actions">
            {status === "Pending" && (
              <>
                <button className="blue" onClick={() => updateTask(task.id, "Ongoing")}>
                  Assign Team
                </button>
                <button className="blue" onClick={() => updateTask(task.id, "Ongoing")}>
                  Draft Specs
                </button>
                <button className="red" onClick={() => updateTask(task.id, "Ongoing")}>
                  Start
                </button>
              </>
            )}

            {status === "Ongoing" && (
              <>
                <button className="green">Code Review</button>
                <button className="green">Testing</button>
                <button className="orange">Blocker</button>
                <button className="blue" onClick={() => updateTask(task.id, "Completed")}>
                  Complete
                </button>
              </>
            )}

            {status === "Completed" && (
              <>
                <button className="gray">View Results</button>
                <button className="gray" onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}>
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

      <footer>Project Management Dashboard</footer>
    </div>
  );
}

export default App;
