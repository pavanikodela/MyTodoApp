import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("Medium");
  const [date, setDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Load tasks & dark mode from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    const storedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (storedTasks) setTasks(storedTasks);
    if (storedDarkMode) setDarkMode(storedDarkMode);
  }, []);

  // Save tasks & dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const handleAddTask = () => {
    if (task.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }

    if (editingIndex !== null) {
      const updatedTasks = tasks.map((t, i) =>
        i === editingIndex ? { ...t, text: task, priority, date } : t
      );
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      const newTask = {
        text: task,
        completed: false,
        priority,
        date: date || null,
      };
      setTasks([...tasks, newTask]);
    }
    setTask("");
    setPriority("Medium");
    setDate("");
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleCompleteTask = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit.text);
    setPriority(taskToEdit.priority);
    setDate(taskToEdit.date || "");
    setEditingIndex(index);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff6b6b";
      case "Medium":
        return "#feca57";
      case "Low":
        return "#1dd1a1";
      default:
        return "#ccc";
    }
  };

  // Enter key to add task
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <h1>
          <img
            src="https://em-content.zobj.net/source/microsoft-teams/363/memo_1f4dd.png"
            alt="Memo Icon"
            style={{
              width: "30px",
              marginRight: "10px",
              verticalAlign: "middle",
            }}
          />
          My To-Do App
        </h1>
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your task"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleAddTask}>
          {editingIndex !== null ? "Update" : "Add"}
        </button>
        {tasks.length > 0 && (
          <button className="clear-btn" onClick={() => setTasks([])}>
            Clear All
          </button>
        )}
      </div>

      <ul className="task-list">
        {sortedTasks.map((task, index) => (
          <li
            key={index}
            className={`task-item ${task.completed ? "completed" : ""}`}
            style={{
              borderLeft: `8px solid ${getPriorityColor(task.priority)}`,
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleteTask(index)}
            />
            <div className="task-details">
              <span className="task-text">{task.text}</span>
              <small>
                Priority: {task.priority} | Due: {formatDate(task.date)}
              </small>
            </div>
            <div className="task-actions">
              <button onClick={() => handleEditTask(index)}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
                  alt="Edit"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(index)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                  alt="Delete"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
