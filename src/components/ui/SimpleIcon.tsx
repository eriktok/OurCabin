import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SimpleIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const SimpleIcon: React.FC<SimpleIconProps> = ({ 
  name, 
  size = 24, 
  color = '#666', 
  style 
}) => {
  const getIconSymbol = (iconName: string) => {
    const iconMap: Record<string, string> = {
      'home': '🏠',
      'account': '👤',
      'post': '📝',
      'check-circle-outline': '✅',
      'calendar-month': '📅',
      'plus': '➕',
      'heart-outline': '❤️',
      'comment-outline': '💬',
      'pencil': '✏️',
      'cog': '⚙️',
      'logout': '🚪',
      'bell': '🔔',
      'shield': '🛡️',
      'tune': '🎛️',
      'help': '❓',
      'email': '📧',
      'calendar': '📅',
      'check': '✓',
      'close': '✕',
      'chevron-right': '▶',
      'content-copy': '📋',
      'share': '📤',
      'account-group': '👥',
      'account-plus': '👤➕',
      'clock-outline': '⏰',
      'close-circle': '❌',
      'help-circle': '❓',
      'check-circle': '✅',
      'alert-circle': '⚠️',
      'minus-circle': '➖',
      'circle-outline': '○',
      'send': '📤',
      'image': '🖼️',
      'post-outline': '📄',
      'book': '📖',
      'cabin': '🏠',
      'profile': '👤',
      'tasks': '✅',
      'logbook': '📖',
      'home-outline': '🏠',
      'account-circle': '👤',
      'google': '🔍',
      'phone': '📱',
      'camera': '📷',
      'magnify': '🔍',
    };
    
    return iconMap[iconName] || '?';
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text style={[styles.text, { fontSize: size * 0.7, color }]}>
        {getIconSymbol(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
