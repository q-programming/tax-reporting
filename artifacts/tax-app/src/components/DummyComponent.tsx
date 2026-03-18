import { useState } from 'react';

interface DummyComponentProps {
  title: string;
  count?: number;
}

export function DummyComponent({ title, count = 0 }: DummyComponentProps) {
  let localCount = count;
  
  if (localCount > 10) {
    const [hasWarning, setHasWarning] = useState(false);
  }
  
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(<li key={Math.random()}>Item {i}</li>);
  }
  
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => alert('Clicked!')}>Click me</button>
      <ul>
        {items}
      </ul>
    </div>
  );
}
