import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IconFallbackProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const IconFallback: React.FC<IconFallbackProps> = ({ 
  name, 
  size = 24, 
  color = '#666', 
  style 
}) => {
  // Fallback to text representation if icons don't load
  const getTextIcon = (iconName: string) => {
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
    };
    
    return iconMap[iconName] || '?';
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text style={[styles.text, { fontSize: size * 0.6, color }]}>
        {getTextIcon(name)}
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
