import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PostSkeleton: React.FC = () => (
  <View style={styles.postSkeleton}>
    <View style={styles.postHeader}>
      <SkeletonLoader width={60} height={16} borderRadius={8} />
      <SkeletonLoader width={80} height={12} borderRadius={6} />
    </View>
    <SkeletonLoader width="100%" height={16} borderRadius={4} style={styles.textLine} />
    <SkeletonLoader width="80%" height={16} borderRadius={4} style={styles.textLine} />
    <SkeletonLoader width={120} height={120} borderRadius={8} style={styles.imageSkeleton} />
    <View style={styles.actions}>
      <SkeletonLoader width={60} height={32} borderRadius={16} />
      <SkeletonLoader width={80} height={32} borderRadius={16} />
    </View>
  </View>
);

export const TaskSkeleton: React.FC = () => (
  <View style={styles.taskSkeleton}>
    <View style={styles.taskHeader}>
      <View style={styles.taskInfo}>
        <SkeletonLoader width="70%" height={18} borderRadius={4} />
        <SkeletonLoader width="40%" height={14} borderRadius={4} style={styles.metaLine} />
      </View>
      <SkeletonLoader width={40} height={40} borderRadius={20} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  postSkeleton: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textLine: {
    marginBottom: 8,
  },
  imageSkeleton: {
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  taskSkeleton: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  metaLine: {
    marginTop: 8,
  },
});
