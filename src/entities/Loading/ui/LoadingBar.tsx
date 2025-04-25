'use client';

import styles from './LoadingBar.module.css';

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar = ({ isLoading }: LoadingBarProps) => {
  return (
    <div
      className={`${styles.loadingBarContainer} ${
        isLoading ? styles.active : styles.inactive
      }`}
    >
      <div
        className={`${styles.loadingBar} ${
          isLoading ? styles.animate : ''
        }`}
      />
    </div>
  );
};

export default LoadingBar;
