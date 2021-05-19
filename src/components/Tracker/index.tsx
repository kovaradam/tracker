import React from 'react';

import Splash from './Splash';
import TrackerControls from './TrackerControls';
import { useTracker } from './store';

const Tracker: React.FC = () => {
  const [, { isTracking }] = useTracker();
  return (
    <>
      <TrackerControls isVisible={isTracking} />
      <Splash isVisible={!isTracking} />
    </>
  );
};

export default Tracker;
