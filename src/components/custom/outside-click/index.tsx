import React from 'react';

type Props = {
  handler: (e: Event) => void;
  nodes: (HTMLElement | null)[];
};

export const OutsideClick: React.FC<Props> = ({ children, nodes, handler }) => {
  React.useEffect(() => {
    const listener = (e: Event) => {
      for (let i = nodes.length; i--; ) {
        if (nodes[i]?.contains(e.target as HTMLElement)) return;
      }
      handler(e);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [nodes, handler]);

  return <>{children}</>;
};
