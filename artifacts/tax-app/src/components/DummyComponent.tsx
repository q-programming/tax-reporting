import { useState } from 'react';

/**
 * Props for the {@link DummyComponent}
 */
interface DummyComponentProps {
  /** The heading text displayed at the top of the component */
  title: string;
  /** Numeric value shown below the title; also controls the number of generated items and the warning threshold (>10). Defaults to 0. */
  count?: number;
  /** Optional list of string items rendered under the "Items from Props" section. Defaults to an empty array. */
  items?: string[];
}

/**
 * A multipurpose demo component that showcases several interactive features:
 * - Displays a title and a numeric count
 * - Toggles a warning message when the count exceeds 10
 * - Provides a todo list with add/remove capabilities
 * - Renders a list of items received via props
 * - Generates a list of items based on the count value
 *
 * @param props - {@link DummyComponentProps}
 * @returns JSX element rendering the demo component with interactive sections
 */
export function DummyComponent({ title, count = 0, items = [] }: DummyComponentProps) {
  const [hasWarning, setHasWarning] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [todoList, setTodoList] = useState<string[]>([]);

  /** Sets the warning flag to `true` when the current count exceeds 10 */
  const handleWarningToggle = () => {
    setHasWarning(count > 10);
  };

  /** Appends the current input value to the todo list and clears the input. No-ops if the input is blank or whitespace-only. */
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodoList([...todoList, inputValue]);
      setInputValue('');
    }
  };

  /**
   * Removes a todo item from the list by its index
   * @param index - Zero-based position of the item to remove
   */
  const removeTodo = (index: number) => {
    const newList = todoList.filter((_, i) => i !== index);
    setTodoList(newList);
  };

  return (
    <div className="dummy-component">
      <h1>{title}</h1>
      <p>Count: {count}</p>
      {hasWarning && <p style={{ color: 'red' }}>Warning: count exceeds 10!</p>}
      <button onClick={handleWarningToggle}>Toggle Warning</button>
      
      <div className="todo-section">
        <h2>Todo List</h2>
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add Todo</button>
        
        <ul>
          {todoList.map((todo, idx) => (
            <li key={`todo-${idx}`}>
              {todo}
              <button onClick={() => removeTodo(idx)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="props-items">
        <h3>Items from Props</h3>
        <ul>
          {items.map((item, index) => (
            <li key={`item-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="generated-items">
        <h3>Generated Items</h3>
        <ul>
          {Array.from({ length: count }, (_, i) => (
            <li key={`generated-${i}`}>Generated Item {i + 1}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
