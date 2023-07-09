import { useEffect, useState } from 'react';

function useHasMounted() {
  const [hasMounted, setIsHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsHasMounted(true);
  }, []);
  return hasMounted;
}

export default useHasMounted;
