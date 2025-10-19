import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MaterialScreenProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  actions?: Array<{
    icon: string;
    onPress: () => void;
    label?: string;
  }>;
  children: React.ReactNode;
  scrollable?: boolean;
  style?: any;
}

export const MaterialScreen: React.FC<MaterialScreenProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  actions = [],
  children,
  scrollable = true,
  style,
}) => {
  const theme = useTheme();

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
      <Appbar.Header
        elevated
        style={{
          backgroundColor: theme.colors.surface,
          elevation: 4,
        }}
      >
        {showBackButton && (
          <Appbar.BackAction onPress={onBackPress} />
        )}
        
        <Appbar.Content
          title={title}
          subtitle={subtitle}
          titleStyle={{
            fontSize: theme.fonts.titleLarge.fontSize,
            fontWeight: theme.fonts.titleLarge.fontWeight,
            color: theme.colors.onSurface,
          }}
          subtitleStyle={{
            fontSize: theme.fonts.bodyMedium.fontSize,
            color: theme.colors.onSurfaceVariant,
          }}
        />
        
        {actions.map((action, index) => (
          <Appbar.Action
            key={index}
            icon={action.icon}
            onPress={action.onPress}
            accessibilityLabel={action.label}
          />
        ))}
      </Appbar.Header>
      
      <ContentWrapper
        style={styles.content}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ContentWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
