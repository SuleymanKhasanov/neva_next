'use client';

import LoadingBar from './LoadingBar';
import { useLoading } from './LoadingContext';

const LoadingManager = () => {
  const { isLoading } = useLoading();

  return <LoadingBar isLoading={isLoading} />;
};

export default LoadingManager;
