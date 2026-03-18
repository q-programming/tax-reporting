# React TypeScript Code Review Checklist

Use this checklist when reviewing React TypeScript code to ensure it follows all standards and best practices.

## TypeScript Standards

- [ ] TypeScript strict mode is enabled
- [ ] No `any` types used (use proper types, `unknown`, or generics)
- [ ] All props interfaces are properly defined with JSDoc comments
- [ ] All function parameters and return types are explicitly typed
- [ ] Proper use of utility types (`Partial`, `Pick`, `Omit`, `Record`, etc.)
- [ ] Type guards used for runtime type checking where needed
- [ ] No TypeScript errors or warnings

## Component Structure

- [ ] Component follows single responsibility principle
- [ ] Component is properly memoized with `React.memo()` if it re-renders frequently
- [ ] Props interface uses descriptive names and includes JSDoc for each prop
- [ ] Component has a display name set for debugging
- [ ] File naming follows convention: `PascalCase.tsx` for components
- [ ] Imports are organized in proper order (React, third-party, internal, types, styles)

## React Hooks

- [ ] All hooks have correct dependency arrays (no missing dependencies)
- [ ] `useCallback` is used for functions passed to child components
- [ ] `useMemo` is used for expensive computations
- [ ] `useEffect` includes cleanup function when needed (subscriptions, timers, etc.)
- [ ] No hooks called conditionally
- [ ] Custom hooks follow naming convention: start with 'use'
- [ ] Custom hooks are properly typed with return type interface

## State Management

- [ ] State is properly typed (no implicit `any`)
- [ ] Loading states are handled for all async operations
- [ ] Error states are handled and displayed appropriately
- [ ] State updates are batched when possible
- [ ] No unnecessary state (derived values use `useMemo` instead)

## Error Handling

- [ ] All async operations wrapped in try-catch blocks
- [ ] Errors are logged with structured context (userId, timestamp, etc.)
- [ ] Error messages are user-friendly
- [ ] Error boundaries implemented for component trees
- [ ] Network errors are handled gracefully
- [ ] Validation errors provide clear feedback

## Performance

- [ ] Code splitting implemented for routes and heavy components
- [ ] Lazy loading used with `React.lazy()` and `Suspense`
- [ ] No unnecessary re-renders (check with React DevTools)
- [ ] Expensive computations are memoized
- [ ] Event handlers are memoized with `useCallback`
- [ ] No inline object/array creation in render (causes re-renders)

## Documentation

- [ ] All components have JSDoc with description
- [ ] All custom hooks have JSDoc with description
- [ ] All utility functions have JSDoc with params and return
- [ ] Complex logic includes inline comments explaining "why"
- [ ] Prop descriptions are clear and complete
- [ ] Usage examples provided for complex components/hooks

## Code Style

- [ ] All if statements use curly brackets (even single-line)
- [ ] Early returns used to reduce nesting
- [ ] Ternary operators used only for simple conditions
- [ ] Naming conventions followed (PascalCase, camelCase, UPPER_SNAKE_CASE)
- [ ] No console.log statements (use proper logging or remove)
- [ ] Code is formatted with project's formatter (Prettier/ESLint)

## Accessibility

- [ ] Semantic HTML elements used where appropriate
- [ ] Interactive elements are keyboard accessible
- [ ] Form inputs have associated labels
- [ ] Error messages are associated with form fields
- [ ] ARIA attributes used when needed
- [ ] Color is not the only means of conveying information

## Testing Considerations

- [ ] Component can be easily tested (no tight coupling)
- [ ] Business logic is separated from presentation
- [ ] Side effects are isolated and testable
- [ ] Props interface allows for easy mocking

## Security

- [ ] User input is validated before use
- [ ] No sensitive data logged to console
- [ ] XSS vulnerabilities prevented (no dangerouslySetInnerHTML without sanitization)
- [ ] API keys and secrets use environment variables
- [ ] Authentication state is properly managed

## Build and Bundle

- [ ] No unused imports
- [ ] Dependencies are actually used (check package.json)
- [ ] Large libraries are code-split or tree-shaken
- [ ] Environment variables used for config (not hardcoded)
- [ ] Production build size is reasonable

## Edge Cases

- [ ] Null/undefined values handled properly
- [ ] Empty arrays/objects handled gracefully
- [ ] Loading states prevent race conditions
- [ ] Component handles unmounting during async operations
- [ ] Rapid user interactions don't cause errors

## Overall Quality

- [ ] Code is readable and self-documenting
- [ ] No code duplication (DRY principle)
- [ ] Functions are small and focused (< 50 lines ideal)
- [ ] Cyclomatic complexity is low (< 15)
- [ ] Code follows project conventions
- [ ] No magic numbers or strings (use named constants)

---

## Review Outcomes

After reviewing, the code should be:

✅ **Approved** - Meets all standards, ready to merge
🔄 **Changes Requested** - Needs specific improvements before approval
❌ **Rejected** - Major issues that require significant rework

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Missing dependencies in useEffect | Add all referenced variables to dependency array |
| Infinite re-render loop | Check dependency arrays, memoize objects/arrays, use React.memo |
| Type errors | Define proper interfaces, avoid `any`, use type guards |
| Poor performance | Profile with React DevTools, memoize appropriately |
| Accessibility issues | Add ARIA labels, ensure keyboard navigation, use semantic HTML |
| Memory leaks | Add cleanup in useEffect, cancel pending requests on unmount |

---

**Remember**: The goal is high-quality, maintainable code that follows team standards and provides a great user experience.
