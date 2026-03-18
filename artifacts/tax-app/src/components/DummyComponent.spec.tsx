import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('renders button', () => {
    render(<DummyComponent title="Test" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
