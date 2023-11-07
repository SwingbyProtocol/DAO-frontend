import { CSSProperties, FC, ReactNode } from 'react';

export type SCP<P = Record<string, unknown>> = P & {
  className?: string;
  style?: CSSProperties;
};

export type CP<P = Record<string, unknown>> = P & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type FCx<P = Record<string, unknown>> = FC<CP<P>>;
