import React from 'react';
import {CloseIcon, HydrogenIcon} from './icons';

interface Props {
  open?: boolean;
  title?: string | React.ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  activator?: React.ReactElement;
  children?: React.ReactNode;
}

export function Interface({children, onClose, onOpen, ...props}: Props) {
  const open = false || props.open;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        right: 0,
        bottom: 0,
        padding: '1.5em',
        maxWidth: '100%',
        flexWrap: 'wrap',
      }}
    >
      <button
        type="button"
        style={{
          position: 'relative',
          background: 'white',
          border: '1px solid',
          padding: '0em 0.5em 0.25em 1.25em',
          boxShadow: '10px 10px 0px black',
          display: 'flex',
          alignItems: 'center',
          color: 'black',
        }}
        onClick={onOpen}
      >
        <div style={{textAlign: 'left', flex: 1}}>
          <Text>Dev tools</Text>
        </div>{' '}
        {open ? <CloseIcon /> : <HydrogenIcon />}
      </button>
      <div
        style={{
          display: open ? 'block' : 'none',
          position: 'relative',
          top: '-1px',
          overflow: 'scroll',
          color: 'black',
          height: '100%',
          background: 'white',
          border: '1px solid',
          boxShadow: '10px 10px 0px black',
          maxWidth: '40em',
          width: '100vw',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Text({children}: {children: string}) {
  return (
    <span
      style={{
        fontFamily: 'monospace',
        fontWeight: 'bold',
        paddingRight: '0.5em',
      }}
    >
      {children}
    </span>
  );
}
