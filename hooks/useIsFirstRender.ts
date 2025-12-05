import { useRef, useEffect } from 'react';

/**
 * Hook to track if this is the first render
 * Returns true only on the initial mount
 */
export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return isFirstRender.current;
}

