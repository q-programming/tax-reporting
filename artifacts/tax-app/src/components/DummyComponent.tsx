import { useState } from 'react';

interface DummyComponentProps {
  title: string;
  count?: number;
  items?: string[];
}

export function DummyComponent({ title, count = 0, items = [] }: DummyComponentProps) {
  const [hasWarning, setHasWarning] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [todoList, setTodoList] = useState<string[]>([]);

  const handleWarningToggle = () => {
    setHasWarning(count > 10);
  };

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodoList([...todoList, inputValue]);
      setInputValue('');
    }
  };

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
