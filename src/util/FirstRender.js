import { useEffect, useRef } from 'react';

export const FirstRender = () => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = false;
  }, []);

  return isMountedRef.current;
};