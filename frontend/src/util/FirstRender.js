import { useEffect, useRef } from 'react';

export const FirstRender = () => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current === true ? isMountedRef.current = false: isMountedRef.current = true;
  }, []);

  return isMountedRef.current;
};