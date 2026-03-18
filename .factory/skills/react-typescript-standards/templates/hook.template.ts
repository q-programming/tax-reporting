import { useState, useEffect, useCallback } from 'react';

/**
 * [Hook description - what it does and when to use it]
 * @param param - [Parameter description]
 * @returns Hook return object containing data, loading state, and error
 */
interface UseCustomHookParams {
  /** [Description of parameter] */
  param: string;
  /** [Optional parameter description] */
  options?: HookOptions;
}

interface HookOptions {
  /** [Option description] */
  enabled?: boolean;
  /** [Option description] */
  refetchInterval?: number;
}

interface UseCustomHookReturn<T> {
  /** The fetched or computed data */
  data: T | null;
  /** Loading state indicator */
  loading: boolean;
  /** Error message if operation failed */
  error: string | null;
  /** Function to manually refetch data */
  refetch: () => void;
}

/**
 * Custom hook for [specific purpose]
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useCustomHook({ param: 'value' });
 * ```
 */
const useCustomHook = <T = unknown>({ 
  param, 
  options = {} 
}: UseCustomHookParams): UseCustomHookReturn<T> => {
  // ============================================================================
  // State
  // ============================================================================
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { enabled = true, refetchInterval } = options;

  // ============================================================================
  // Callbacks
  // ============================================================================
  const fetchData = useCallback(
    async () => {
      if (!enabled) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch/compute logic here
        const result = await someAsyncOperation<T>(param);
        setData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error in useCustomHook:', {
          param,
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [param, enabled]
  );

  // ============================================================================
  // Effects
  // ============================================================================
  useEffect(
    () => {
      if (param && enabled) {
        fetchData();
      }
    },
    [fetchData, param, enabled]
  );

  // Optional: Setup refetch interval
  useEffect(
    () => {
      if (!refetchInterval || !enabled) {
        return;
      }

      const intervalId = setInterval(fetchData, refetchInterval);

      // Cleanup interval on unmount
      return () => {
        clearInterval(intervalId);
      };
    },
    [fetchData, refetchInterval, enabled]
  );

  // ============================================================================
  // Return
  // ============================================================================
  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useCustomHook;

// Example async operation (replace with actual implementation)
async function someAsyncOperation<T>(param: string): Promise<T> {
  // Implementation
  throw new Error('Not implemented');
}
