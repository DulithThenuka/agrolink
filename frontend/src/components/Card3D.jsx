import React from 'react';

/**
 * Standard card wrapper providing consistent AgroLink card surfaces
 * with accessible, subtle hover transitions.
 */
export const Card3D = ({
  children,
  className = '',
  maxTilt = 0,
  scale = 1,
  glare = false,
  ...props
}) => {
  return (
    <div
      className={`agri-card-interactive ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card3D;
