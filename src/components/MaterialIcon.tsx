import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

// Fallback icon component that shows text if icon doesn't work
export const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  name, 
  size = 24, 
  color, 
  style 
}) => {
  const theme = useTheme();
  
  // Map icon names to emoji fallbacks
  const iconMap: Record<string, string> = {
    'home': '🏠',
    'newspaper': '📰',
    'format-list-checks': '✅',
    'calendar-clock': '📅',
    'account-multiple': '👥',
    'account': '👤',
    'book-open-variant': '📖',
    'calendar': '📅',
    'heart': '❤️',
    'star': '⭐',
    'plus': '➕',
    'minus': '➖',
    'check': '✓',
    'close': '✕',
    'menu': '☰',
    'dots-vertical': '⋮',
    'post': '📝',
    'check-circle': '✅',
    'book-open': '📖',
    'account-group': '👥',
  };

  const emoji = iconMap[name] || '❓';
  
  return (
    <View style={[
      {
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      },
      style
    ]}>
      <Text style={{
        fontSize: size * 0.6,
        color: color || theme.colors.onSurface,
      }}>
        {emoji}
      </Text>
    </View>
  );
};
