interface DummyComponentProps {
  title: string;
  count?: number;
}

export function DummyComponent({ title, count = 0 }: DummyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => alert('Clicked!')}>Click me</button>
    </div>
  );
}
