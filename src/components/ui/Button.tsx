import React from 'react';
import { styled } from '@/styles/stitches.config';

// Kapitalismuskritischer Button mit skewed design
export const Button = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '$mono',
  fontWeight: '$bold',
  borderRadius: '$default',
  transition: '$fast',
  cursor: 'pointer',
  transform: 'skew(-2deg)',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover::before': {
    opacity: 1,
  },
  
  '&:active': {
    transform: 'translateY(2px) skew(-2deg)',
  },
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        border: '1px solid $primary',
        boxShadow: '3px 3px 0 rgba(255, 255, 255, 0.2)',
        
        '&:hover': {
          transform: 'translateY(-2px) skew(-2deg)',
          boxShadow: '5px 5px 0 rgba(255, 255, 255, 0.2)',
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '$foreground',
        border: '1px solid $foreground',
        boxShadow: '2px 2px 0 rgba(255, 255, 255, 0.1)',
        
        '&:hover': {
          transform: 'translateY(-2px) skew(-2deg)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          boxShadow: '4px 4px 0 rgba(255, 255, 255, 0.1)',
        },
      },
      subtle: {
        backgroundColor: 'transparent',
        color: '$foreground',
        border: 'none',
        
        '&:hover': {
          textDecoration: 'underline',
          transform: 'translateY(-1px) skew(-2deg)',
        },
      },
      critical: {
        backgroundColor: '$red9',
        color: 'white',
        border: '1px solid $red9',
        boxShadow: '3px 3px 0 rgba(255, 0, 0, 0.2)',
        
        '&:hover': {
          transform: 'translateY(-2px) skew(-2deg)',
          boxShadow: '5px 5px 0 rgba(255, 0, 0, 0.2)',
          backgroundColor: '$red10',
        },
      },
    },
    size: {
      sm: {
        fontSize: '$sm',
        px: '$3',
        py: '$2',
      },
      md: {
        fontSize: '$base',
        px: '$6',
        py: '$3',
      },
      lg: {
        fontSize: '$lg',
        px: '$8',
        py: '$4',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    withIcon: {
      true: {
        '& svg': {
          marginRight: '$2',
        },
      },
    },
  },
  
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export default Button;
