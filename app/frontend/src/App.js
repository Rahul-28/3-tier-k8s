import React from "react";
import Tasks from "./Tasks";
import { Paper, TextField, Checkbox, Button } from "@material-ui/core";
import "./App.css";

class App extends Tasks {
  state = { tasks: [], currentTask: "" };

  render() {
    const { tasks, currentTask } = this.state;

    return (
      <div className="App">
        <Paper elevation={0} className="todo-shell">
          <div className="todo-header">
            <p className="eyebrow">Daily planner</p>
            <h1 className="heading">My Tasks</h1>
            <p className="subheading">
              Stay focused and keep your day moving.
            </p>
          </div>

          <form onSubmit={this.handleSubmit} className="task-form">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={currentTask}
              required
              onChange={this.handleChange}
              placeholder="Add a new task"
              className="task-input"
            />
            <Button
              className="add-btn"
              color="primary"
              variant="contained"
              type="submit"
            >
              Add
            </Button>
          </form>

          <div className="task-list">
            {tasks.length === 0 ? (
              <Paper elevation={0} className="empty-state">
                <div className="empty-title">No tasks yet</div>
                <div className="empty-text">
                  Add your first task to get started.
                </div>
              </Paper>
            ) : (
              tasks.map((task) => (
                <Paper
                  key={task._id}
                  elevation={0}
                  className={`task-card ${task.completed ? "task-card-done" : ""}`}
                >
                  <Checkbox
                    checked={task.completed}
                    onClick={() => this.handleUpdate(task._id)}
                    color="primary"
                  />

                  <div className="task-content">
                    <div
                      className={task.completed ? "task done" : "task"}
                    >
                      {task.task}
                    </div>
                    <div className="task-status">
                      {task.completed ? "Completed" : "Pending"}
                    </div>
                  </div>

                  <Button
                    onClick={() => this.handleDelete(task._id)}
                    color="secondary"
                    className="delete-btn"
                  >
                    Delete
                  </Button>
                </Paper>
              ))
            )}
          </div>
        </Paper>
      </div>
    );
  }
}

export default App;