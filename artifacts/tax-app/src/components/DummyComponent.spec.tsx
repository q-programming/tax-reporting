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
    expect(
      screen.getByRole('button', { name: 'Toggle Warning' }),
    ).toBeInTheDocument();
  });

  it('renders Add Todo button', () => {
    render(<DummyComponent title="Test" />);
    expect(
      screen.getByRole('button', { name: 'Add Todo' }),
    ).toBeInTheDocument();
  });

  describe('warning toggle', () => {
    it('shows warning when count exceeds 10', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" count={15} />);

      await user.click(
        screen.getByRole('button', { name: 'Toggle Warning' }),
      );

      expect(screen.getByText('Warning: count exceeds 10!')).toBeInTheDocument();
    });

    it('does not show warning when count is 10 or less', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" count={10} />);

      await user.click(
        screen.getByRole('button', { name: 'Toggle Warning' }),
      );

      expect(
        screen.queryByText('Warning: count exceeds 10!'),
      ).not.toBeInTheDocument();
    });
  });

  describe('todo list', () => {
    it('adds a todo item when input has text and Add Todo is clicked', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      const input = screen.getByPlaceholderText('Add a todo...');
      await user.type(input, 'Buy groceries');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });

    it('clears the input after adding a todo', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      const input = screen.getByPlaceholderText('Add a todo...');
      await user.type(input, 'Buy groceries');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(input).toHaveValue('');
    });

    it('does not add a todo when input is empty', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // Only the three static lists should exist, all empty
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('does not add a todo when input contains only whitespace', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      const input = screen.getByPlaceholderText('Add a todo...');
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      // No todo items should be added (only whitespace)
      const removeButtons = screen.queryAllByRole('button', {
        name: 'Remove',
      });
      expect(removeButtons).toHaveLength(0);
    });

    it('adds multiple todo items', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      const input = screen.getByPlaceholderText('Add a todo...');

      await user.type(input, 'First todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.type(input, 'Second todo');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('First todo')).toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
    });

    it('removes a todo item when Remove is clicked', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      const input = screen.getByPlaceholderText('Add a todo...');
      await user.type(input, 'Todo to remove');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      expect(screen.getByText('Todo to remove')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Remove' }));

      expect(screen.queryByText('Todo to remove')).not.toBeInTheDocument();
    });

    it('removes only the targeted todo from multiple items', async () => {
      const user = userEvent.setup();
      render(<DummyComponent title="Test" />);

      const input = screen.getByPlaceholderText('Add a todo...');

      await user.type(input, 'Keep this');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      await user.type(input, 'Remove this');
      await user.click(screen.getByRole('button', { name: 'Add Todo' }));

      const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
      // Click remove on the second todo
      await user.click(removeButtons[1]);

      expect(screen.getByText('Keep this')).toBeInTheDocument();
      expect(screen.queryByText('Remove this')).not.toBeInTheDocument();
    });
  });

  describe('items from props', () => {
    it('renders items passed via props', () => {
      render(
        <DummyComponent title="Test" items={['Apple', 'Banana', 'Cherry']} />,
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('renders no items when items prop is empty', () => {
      render(<DummyComponent title="Test" items={[]} />);

      expect(screen.getByText('Items from Props')).toBeInTheDocument();
      // No item list items should be rendered from the props section
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('defaults to empty items when items prop is not provided', () => {
      render(<DummyComponent title="Test" />);

      expect(screen.getByText('Items from Props')).toBeInTheDocument();
    });
  });

  describe('generated items', () => {
    it('renders generated items based on count', () => {
      render(<DummyComponent title="Test" count={3} />);

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
