import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { spacing } from '../../theme/spacing';

interface MaterialInputProps extends Omit<TextInputProps, 'children'> {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'flat';
  multiline?: boolean;
  numberOfLines?: number;
}

export const MaterialInput: React.FC<MaterialInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error = false,
  helperText,
  variant = 'outlined',
  multiline = false,
  numberOfLines = 1,
  style,
  ...props
}) => {
  const theme = useTheme();


  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      mode={variant}
      error={error}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[
        {
          backgroundColor: theme.colors.surface,
          marginVertical: spacing.xs,
        },
        style,
      ]}
      contentStyle={{
        fontSize: theme.fonts.bodyMedium.fontSize,
      }}
      {...props}
    />
  );
};
