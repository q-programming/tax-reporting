import { useState } from 'react';

interface DummyComponentProps {
  title: string;
  count?: number;
}

export function DummyComponent({ title, count = 0 }: DummyComponentProps) {
  const [hasWarning, setHasWarning] = useState(false);
  const localCount = count;

  const handleWarningToggle = () => {
    setHasWarning(localCount > 10);
  };

  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(<li key={i}>Item {i}</li>);
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      {hasWarning && <p>Warning: count exceeds 10!</p>}
      <button onClick={handleWarningToggle}>Click me</button>
      <ul>
        {items}
      </ul>
    </div>
  );
}
