import React, { memo, useEffect, useCallback, useMemo, useState } from 'react';

/**
 * [Component description - what it does and when to use it]
 * @param props - Component props
 * @returns JSX element
 */
interface ComponentNameProps {
  /** [Description of prop1] */
  prop1: string;
  /** [Description of prop2] */
  prop2?: number;
  /** [Callback description] */
  onAction?: (value: string) => void;
}

const ComponentName: React.FC<ComponentNameProps> = memo(({ prop1, prop2 = 0, onAction }) => {
  // ============================================================================
  // State
  // ============================================================================
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // Memoized Values
  // ============================================================================
  const processedData = useMemo(
    () => {
      if (!data) {
        return null;
      }
      // Expensive computation here
      return data;
    },
    [data]
  );

  // ============================================================================
  // Callbacks
  // ============================================================================
  const handleAction = useCallback(
    () => {
      try {
        // Action logic
        if (onAction) {
          onAction(prop1);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error in handleAction:', {
          prop1,
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });
        setError(errorMessage);
      }
    },
    [prop1, onAction]
  );

  // ============================================================================
  // Effects
  // ============================================================================
  useEffect(
    () => {
      let isMounted = true;

      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          // Fetch logic here
          const result = await someAsyncOperation(prop1);

          if (isMounted) {
            setData(result);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Error fetching data:', {
            prop1,
            error: errorMessage,
            timestamp: new Date().toISOString(),
          });

          if (isMounted) {
            setError(errorMessage);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      if (prop1) {
        fetchData();
      }

      // Cleanup function
      return () => {
        isMounted = false;
      };
    },
    [prop1]
  );

  // ============================================================================
  // Render Logic
  // ============================================================================

  // Early return for loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Early return for error state
  if (error) {
    return <div role="alert">Error: {error}</div>;
  }

  // Early return for empty state
  if (!processedData) {
    return <div>No data available</div>;
  }

  return (
    <div className="component-name">
      {/* Component content */}
      <button onClick={handleAction} type="button">
        Click me
      </button>
    </div>
  );
});

// Display name for debugging
ComponentName.displayName = 'ComponentName';

export default ComponentName;
