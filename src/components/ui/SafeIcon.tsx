import React from 'react';
import { SimpleIcon } from './SimpleIcon';

interface SafeIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const SafeIcon: React.FC<SafeIconProps> = ({ 
  name, 
  size = 24, 
  color = '#666', 
  style 
}) => {
  // For now, let's just use SimpleIcon which provides beautiful emoji fallbacks
  // This ensures the app works reliably without vector icon dependencies
  return (
    <SimpleIcon 
      name={name} 
      size={size} 
      color={color} 
      style={style}
    />
  );
};
