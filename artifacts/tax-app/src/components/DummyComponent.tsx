interface DummyComponentProps {
  title: string;
  count?: number;
}

export function DummyComponent({ title, count = 0 }: DummyComponentProps) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(<li key={i}>Item {i}</li>);
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
