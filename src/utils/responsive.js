import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isSmallPhone = width < 375;
export const isMediumPhone = width >= 375 && width < 414;
export const isLargePhone = width >= 414 && width < 600;
export const isTablet = width >= 600;
export const isPortrait = height > width;
export const isLandscape = width > height;

export const responsiveWidth = (percent) => {
  if (isTablet) {
    return (Math.min(width, 800) * percent) / 100;
  }
  return (width * percent) / 100;
};

export const responsiveHeight = (percent) => {
  return (height * percent) / 100;
};

export const spacing = {
  xs: isSmallPhone ? 4 : 6,
  sm: isSmallPhone ? 8 : 10,
  md: isSmallPhone ? 12 : 16,
  lg: isSmallPhone ? 16 : 20,
  xl: isSmallPhone ? 20 : 24,
  xxl: isSmallPhone ? 24 : 32,
};

export const fontSize = {
  xs: isSmallPhone ? 10 : 12,
  sm: isSmallPhone ? 12 : 14,
  md: isSmallPhone ? 14 : 16,
  lg: isSmallPhone ? 16 : 18,
  xl: isSmallPhone ? 18 : 20,
  xxl: isSmallPhone ? 22 : 24,
  title: isSmallPhone ? 26 : 28,
  header: isSmallPhone ? 28 : 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

export const iconSize = {
  sm: isSmallPhone ? 16 : 18,
  md: isSmallPhone ? 20 : 24,
  lg: isSmallPhone ? 24 : 28,
  xl: isSmallPhone ? 28 : 32,
  xxl: isSmallPhone ? 40 : 48,
};

export const hitSlop = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};