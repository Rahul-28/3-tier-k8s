import axios from 'axios';
import { getTasks, addTask, updateTask, deleteTask } from './taskServices';

jest.mock('axios');

describe('taskServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches tasks from the configured API URL', async () => {
    axios.get.mockResolvedValue({ data: [{ _id: '1' }] });

    await getTasks();

    expect(axios.get).toHaveBeenCalled();
  });

  it('adds a task', async () => {
    axios.post.mockResolvedValue({ data: { _id: '1' } });

    await addTask({ task: 'Test task' });

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { task: 'Test task' });
  });

  it('updates a task', async () => {
    axios.put.mockResolvedValue({ data: { _id: '1' } });

    await updateTask('1', { completed: true });

    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/1'), { completed: true });
  });

  it('deletes a task', async () => {
    axios.delete.mockResolvedValue({});

    await deleteTask('1');

    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/1'));
  });
});
