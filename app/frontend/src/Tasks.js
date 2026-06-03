import { Component } from "react";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./services/taskServices";

class Tasks extends Component {
  state = { tasks: [], currentTask: "" };

  async componentDidMount() {
    try {
      const response = await getTasks();
      const tasks = Array.isArray(response.data)
        ? response.data
        : response.data.tasks || [];

      this.setState({ tasks });
    } catch (error) {
      console.log(error);
      this.setState({ tasks: [] });
    }
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ currentTask: input.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addTask({ task: this.state.currentTask });

      this.setState((prevState) => ({
        tasks: [...prevState.tasks, data],
        currentTask: "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  handleUpdate = async (currentTask) => {
    const originalTasks = [...this.state.tasks];
    try {
      const tasks = [...this.state.tasks];
      const index = tasks.findIndex((task) => task._id === currentTask);

      if (index === -1) return;

      tasks[index] = {
        ...tasks[index],
        completed: !tasks[index].completed,
      };

      this.setState({ tasks });

      await updateTask(currentTask, {
        completed: tasks[index].completed,
      });
    } catch (error) {
      this.setState({ tasks: originalTasks });
      console.log(error);
    }
  };

  handleDelete = async (currentTask) => {
    const originalTasks = [...this.state.tasks];
    try {
      const tasks = originalTasks.filter(
        (task) => task._id !== currentTask
      );
      this.setState({ tasks });
      await deleteTask(currentTask);
    } catch (error) {
      this.setState({ tasks: originalTasks });
      console.log(error);
    }
  };
}

export default Tasks;