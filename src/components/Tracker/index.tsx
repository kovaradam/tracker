import React, { useEffect, useState } from 'react';

import { useTracker } from '../../tracker/use-tracker';
import Settings from '../Settings/index';
import Splash from './Splash';
import TrackerControls from './TrackerControls';

export type TrackerWrapperComponent<T = unknown> = React.FC<T & { isVisible: boolean }>;

const Tracker: React.FC = () => {
  const [, { isTracking }] = useTracker();
  const [isSplashVisible, setIsSplashVisible] = useState(!isTracking);

  useEffect(() => {
    if (isTracking) {
      setIsSplashVisible(false);
    }
  }, [isTracking]);

  return (
    <>
      <Splash isVisible={isSplashVisible} />
      <TrackerControls isVisible={!isSplashVisible} />
      <Settings />
    </>
  );
};

export default Tracker;
