import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialAppBar } from './MaterialAppBar';
import { MaterialFAB } from './MaterialFAB';

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
  fab?: {
    icon: string;
    onPress: () => void;
    label?: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  };
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
  fab,
  style,
}) => {
  const theme = useTheme();

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
      <MaterialAppBar
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        actions={actions}
      />
      
      <ContentWrapper
        style={styles.content}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ContentWrapper>
      
      {fab && (
        <MaterialFAB
          icon={fab.icon}
          onPress={fab.onPress}
          label={fab.label}
          variant={fab.variant}
        />
      )}
    </View>
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
    paddingBottom: 80, // Space for FAB
  },
});
