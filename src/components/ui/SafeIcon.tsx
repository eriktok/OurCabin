import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconFallback } from './IconFallback';

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
  try {
    return (
      <Icon 
        name={name} 
        size={size} 
        color={color} 
        style={style}
      />
    );
  } catch (error) {
    console.warn(`Icon ${name} failed to load, using fallback`);
    return (
      <IconFallback 
        name={name} 
        size={size} 
        color={color} 
        style={style}
      />
    );
  }
};
