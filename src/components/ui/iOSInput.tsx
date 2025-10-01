import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeIcon } from './SafeIcon';
import { iOSDesignSystem } from '../../theme/iOSDesignSystem';

interface iOSInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: any;
}

export const iOSInput: React.FC<iOSInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = () => {
    const baseStyle: any[] = [styles.input];
    
    if (multiline) baseStyle.push(styles.multilineInput);
    if (error) baseStyle.push(styles.errorInput);
    if (disabled) baseStyle.push(styles.disabledInput);
    if (isFocused) baseStyle.push(styles.focusedInput);
    
    return baseStyle;
  };

  const getContainerStyle = () => {
    const baseStyle: any[] = [styles.container];
    
    if (leftIcon) baseStyle.push(styles.containerWithLeftIcon);
    if (rightIcon) baseStyle.push(styles.containerWithRightIcon);
    
    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={getInputStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <SafeIcon
              name={leftIcon}
              size={20}
              color={iOSDesignSystem.colors.text.tertiary}
            />
          </View>
        )}
        
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.multilineTextInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={iOSDesignSystem.colors.text.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <SafeIcon
              name={rightIcon}
              size={20}
              color={iOSDesignSystem.colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: iOSDesignSystem.spacing.md,
  },
  containerWithLeftIcon: {
    // Additional styles if needed
  },
  containerWithRightIcon: {
    // Additional styles if needed
  },
  label: {
    fontSize: iOSDesignSystem.typography.fontSize.callout,
    fontWeight: iOSDesignSystem.typography.fontWeight.medium,
    color: iOSDesignSystem.colors.label.primary,
    marginBottom: iOSDesignSystem.spacing.xs,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: iOSDesignSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: iOSDesignSystem.colors.separator.opaque,
    borderRadius: iOSDesignSystem.borderRadius.lg,
    minHeight: iOSDesignSystem.components.input.height,
    paddingHorizontal: iOSDesignSystem.spacing.md,
  },
  focusedInput: {
    borderColor: iOSDesignSystem.colors.primary,
    borderWidth: 2,
  },
  errorInput: {
    borderColor: iOSDesignSystem.colors.error,
    borderWidth: 2,
  },
  disabledInput: {
    backgroundColor: iOSDesignSystem.colors.background.secondary,
    borderColor: iOSDesignSystem.colors.separator.opaque,
  },
  multilineInput: {
    alignItems: 'flex-start',
    paddingVertical: iOSDesignSystem.spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: iOSDesignSystem.typography.fontSize.body,
    color: iOSDesignSystem.colors.text.primary,
    paddingVertical: 0,
  },
  multilineTextInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  leftIconContainer: {
    marginRight: iOSDesignSystem.spacing.sm,
  },
  rightIconContainer: {
    marginLeft: iOSDesignSystem.spacing.sm,
    padding: iOSDesignSystem.spacing.xs,
  },
  errorText: {
    fontSize: iOSDesignSystem.typography.fontSize.caption1,
    color: iOSDesignSystem.colors.error,
    marginTop: iOSDesignSystem.spacing.xs,
  },
});
