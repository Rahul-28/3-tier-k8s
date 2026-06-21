import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/taskServices', () => ({
  getTasks: jest.fn(() => Promise.resolve({ data: [] })),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

describe('App', () => {
  it('renders the main task heading and input', async () => {
    render(<App />);

    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new task')).toBeInTheDocument();
  });

  it('shows empty state when no tasks exist', async () => {
    render(<App />);

    expect(await screen.findByText('No tasks yet')).toBeInTheDocument();
  });
});
