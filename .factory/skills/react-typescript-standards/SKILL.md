---
name: react-typescript-standards
description: >-
  Comprehensive coding standards and best practices for React TypeScript development.
  ACTIVATE when writing React components, custom hooks, or utilities. Enforces TypeScript
  strict mode, proper hooks usage, memoization, error handling, documentation, and performance
  optimization. Use when starting new React features or refactoring existing components.
user-invocable: true
disable-model-invocation: false
---

# React TypeScript Coding Standards

You are an expert React TypeScript developer. Follow these comprehensive coding standards to write high-quality, performant, and maintainable React code.

## General Development Guidelines

### Code Structure and Architecture

- Use **TypeScript** with strict mode enabled for all components and utilities
- Break down complex components into **smaller, focused functions**
- Keep **cyclomatic complexity low** (maximum 15 per function)
- Use **functional programming patterns** where appropriate
- Prefer **composition over inheritance**

### TypeScript Best Practices

- **NEVER use `any` type** - Use proper TypeScript types, generics, or `unknown` when type is truly dynamic
- Enable **strict mode** in tsconfig.json
- Use **interfaces for object shapes** and **types for unions/intersections**
- Implement **proper error typing** with union types
- Use **type guards** for runtime type checking
- Leverage **utility types** (`Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K, V>`)

## React Hooks Best Practices

### Optimization and Performance

- Use `React.memo()` to prevent unnecessary re-renders of components
- Implement `useEffect` with **proper dependency arrays** to avoid infinite loops
- Use `useCallback` to memoize functions and prevent child re-renders
- Use `useMemo` for expensive calculations
- Use `lazy()` and `Suspense` for code splitting

### Hook Rules

1. **Always include all dependencies** in useEffect/useCallback/useMemo dependency arrays
2. **Never call hooks conditionally** - hooks must be called in the same order every render
3. **Extract complex logic** into custom hooks for reusability
4. **Cleanup subscriptions** in useEffect return function
5. **Use ESLint plugin** `eslint-plugin-react-hooks` to catch violations

## Component Documentation

### JSDoc Standards

Document **all functions, components, and custom hooks** with JSDoc comments:

```tsx
/**
 * Displays user profile information with edit capabilities
 * @param props - Component props
 * @returns JSX element rendering user profile
 */
interface UserProfileProps {
  /** Unique user identifier */
  userId: string;
  /** Callback fired when profile is updated */
  onUpdate?: (user: User) => void;
  /** Controls edit mode visibility */
  editable?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate, editable = false }) => {
  // Implementation
};
```

### Documentation Requirements

- **Component props**: Document each prop with description
- **Return types**: Explicitly type all function returns
- **Complex logic**: Add inline comments explaining "why", not "what"
- **Custom hooks**: Document parameters, return values, and side effects

## Error Handling and Logging

### Error Handling Patterns

- **Log all errors** using structured logging (console.error, custom logger)
- Implement **comprehensive error boundaries** for component trees
- Handle **all error scenarios**: network failures, validation errors, runtime exceptions
- Use **try-catch blocks** for async operations
- Provide **meaningful error messages** to users

### Error Logging Best Practices

```tsx
try {
  await fetchUserData(userId);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('Error fetching user data:', {
    userId,
    error: errorMessage,
    timestamp: new Date().toISOString(),
  });
  setError(errorMessage);
}
```

### Error Boundaries

Implement error boundaries to catch rendering errors:

```tsx
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Code Style and Formatting

### Control Flow

- **Use curly brackets for all if statements**, even single-line ones
- Prefer **early returns** to reduce nesting
- Use **ternary operators** for simple conditionals in JSX

```tsx
// ✅ Good
if (isLoading) {
  return <Spinner />;
}

// ❌ Bad
if (isLoading) return <Spinner />;
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useUserData.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types/Interfaces**: PascalCase (e.g., `User.types.ts` or `types.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Variables/Functions**: camelCase

### Import Organization

Organize imports in this order:

1. React and React-related imports
2. Third-party libraries
3. Internal components
4. Utilities and helpers
5. Types and interfaces
6. Styles (if any)

```tsx
import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import { fetchUserData } from '@/api/users';
import { formatDate } from '@/utils/formatters';

import type { User } from '@/types/user';
import styles from './UserProfile.module.css';
```

## Performance Optimization

### Code Splitting

- Use **dynamic imports** for route-based code splitting
- Implement **lazy loading** for routes and heavy components
- Use **React.lazy()** and `Suspense` for component-level splitting

```tsx
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Memoization Strategy

```tsx
const Component: React.FC<Props> = memo(({ data, onAction }) => {
  // Memoize callbacks to prevent child re-renders
  const handleClick = useCallback(
    () => {
      onAction(data.id);
    },
    [onAction, data.id]
  );

  // Memoize expensive computations
  const processedData = useMemo(
    () => expensiveOperation(data),
    [data]
  );

  return <ChildComponent onClick={handleClick} data={processedData} />;
});
```

### Bundle Optimization

- Use **environment variables** for configuration
- Optimize bundle size with proper **tree shaking**
- Minimize dependencies - audit with `npm ls` or bundle analyzer
- Use **production builds** for deployment

## Component Patterns

### Component Structure Template

See `templates/component.template.tsx` for a complete example. Key elements:

1. **Imports** organized by category
2. **Interface definition** with JSDoc for each prop
3. **Component function** with proper typing
4. **State and hooks** grouped logically
5. **Memoized callbacks** to prevent re-renders
6. **Effects** with proper dependencies and cleanup
7. **Early returns** for loading/error states
8. **JSX** with clear structure

### Custom Hook Pattern

See `templates/hook.template.ts` for a complete example. Key elements:

1. **Clear interface** for return type
2. **State management** with proper typing
3. **Error handling** with typed error state
4. **Cleanup logic** in useEffect
5. **Memoized returns** when appropriate

## State Management

### Local State (useState)

Use for component-specific state:

```tsx
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
```

### Context API

Use for sharing state across component tree without prop drilling:

```tsx
interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Global State (Redux/Zustand/etc.)

When using external state management:

- Keep actions **pure and predictable**
- Use **selectors** for derived state
- Implement **proper typing** for state and actions
- Follow library-specific best practices

## Specific Rules Checklist

When writing React TypeScript code, ensure:

1. ✅ **All if statements wrapped in curly brackets**
2. ✅ **Errors logged with context** using structured logging
3. ✅ **Proper TypeScript interfaces** for all props, state, and function parameters
4. ✅ **Functions broken down** when cyclomatic complexity exceeds 12
5. ✅ **JSDoc comments included** for all functions and components
6. ✅ **Dependency arrays correct** in all hooks to prevent infinite loops
7. ✅ **Loading and error states handled** in all async operations
8. ✅ **Environment variables used** for configuration values
9. ✅ **Cleanup implemented** in useEffect hooks when needed
10. ✅ **Components memoized** when appropriate to prevent re-renders

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase.ts` starting with 'use' (e.g., `useUserData.ts`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `PascalCase.types.ts` or `types.ts` (e.g., `User.types.ts`)
- Tests: `*.test.tsx` or `*.spec.tsx`

## Verification Checklist

Before completing a React component or feature, verify:

- [ ] TypeScript strict mode enabled and no type errors
- [ ] All props and state properly typed (no `any`)
- [ ] JSDoc documentation for all public APIs
- [ ] Error handling implemented for async operations
- [ ] Loading states implemented for async data
- [ ] useEffect dependency arrays correct
- [ ] Memoization applied where beneficial (React.memo, useCallback, useMemo)
- [ ] No console warnings or errors
- [ ] Component follows single responsibility principle
- [ ] Code formatted with project's formatter (Prettier/ESLint)

See `checklists/code-review.md` for a comprehensive review checklist.

## References

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- Component template: `templates/component.template.tsx`
- Hook template: `templates/hook.template.ts`
- Utility template: `templates/utility.template.ts`

---

**Remember**: Write code that is readable, maintainable, and performant. When in doubt, prioritize clarity over cleverness.
