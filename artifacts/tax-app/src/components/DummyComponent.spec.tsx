import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DummyComponent } from './DummyComponent';

describe('DummyComponent', () => {
  it('renders title correctly', () => {
    render(<DummyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders default count of 0', () => {
    render(<DummyComponent title="Test" />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('renders custom count when provided', () => {
    render(<DummyComponent title="Test" count={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  it('renders Toggle Warning button', () => {
    render(<DummyComponent title="Test" />);
    expect(screen.getByRole('button', { name: 'Toggle Warning' })).toBeInTheDocument();
  });

  describe('warning toggle', () => {
    it('shows warning when count exceeds 10', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" count={15} />);

      await user.click(screen.getByRole('button', { name: 'Toggle Warning' }));

      expect(screen.getByText('Warning: count exceeds 10!')).toBeInTheDocument();
    });

    it('does not show warning when count is 10 or less', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" count={10} />);

      await user.click(screen.getByRole('button', { name: 'Toggle Warning' }));

      expect(screen.queryByText('Warning: count exceeds 10!')).not.toBeInTheDocument();
    });
  });

  describe('todo list', () => {
    it('renders todo list section with input and Add Todo button', () => {
      render(<DummyComponent title="Test" />);

      expect(screen.getByText('Todo List')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add a todo...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Todo' })).toBeInTheDocument();
    });

    it('adds a todo item when input has text and Add Todo is clicked', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      await user.type(screen.getByPlaceholderText('Add a todo...'), 'Buy groceries');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add a todo...')).toHaveValue('');
    });

    it('does not add a todo when input is empty', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      const removeButtons = screen.queryAllByRole('button', { name: 'Remove' });
      expect(removeButtons).toHaveLength(0);
    });

    it('does not add a todo when input is only whitespace', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      await user.type(screen.getByPlaceholderText('Add a todo...'), '   ');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      const removeButtons = screen.queryAllByRole('button', { name: 'Remove' });
      expect(removeButtons).toHaveLength(0);
    });

    it('removes a todo item when Remove button is clicked', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      await user.type(screen.getByPlaceholderText('Add a todo...'), 'Task 1');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.type(screen.getByPlaceholderText('Add a todo...'), 'Task 2');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();

      const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
      await user.click(removeButtons[0]);

      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('adds multiple todos and displays them all', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      const input = screen.getByPlaceholderText('Add a todo...');
      const addButton = screen.getByRole('button', { name: 'Add Todo' });

      await user.type(input, 'First');
      await user.click(addButton);

      await user.type(input, 'Second');
      await user.click(addButton);

      await user.type(input, 'Third');
      await user.click(addButton);

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(3);
    });
  });

  describe('items from props', () => {
    it('renders items passed via props', () => {
      render(<DummyComponent title="Test" items={['Apple', 'Banana', 'Cherry']} />);

      expect(screen.getByText('Items from Props')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('renders empty items list when no items provided', () => {
      render(<DummyComponent title="Test" />);

      expect(screen.getByText('Items from Props')).toBeInTheDocument();
    });
  });

  describe('generated items', () => {
    it('renders generated items based on count', () => {
      render(<DummyComponent title="Test" count={3} />);

      expect(screen.getByText('Generated Items')).toBeInTheDocument();
      expect(screen.getByText('Generated Item 1')).toBeInTheDocument();
      expect(screen.getByText('Generated Item 2')).toBeInTheDocument();
      expect(screen.getByText('Generated Item 3')).toBeInTheDocument();
    });

    it('renders no generated items when count is 0', () => {
      render(<DummyComponent title="Test" count={0} />);

      expect(screen.getByText('Generated Items')).toBeInTheDocument();
      expect(screen.queryByText('Generated Item 1')).not.toBeInTheDocument();
    });
  });
});
