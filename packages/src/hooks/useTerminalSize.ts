import { useEffect, useState } from 'react';
import { useStdout } from 'ink';

export function useTerminalSize() {
  const { stdout } = useStdout();
  const [size, setSize] = useState({
    columns: stdout?.columns ?? 80,
    rows: stdout?.rows ?? 24,
  });

  useEffect(() => {
    const onResize = () => {
      if (stdout) {
        setSize({ columns: stdout.columns, rows: stdout.rows });
      }
    };
    stdout?.on('resize', onResize);
    return () => { stdout?.removeListener('resize', onResize); };
  }, [stdout]);

  return size;
}
