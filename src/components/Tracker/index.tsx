import React from 'react';

import { useTracker } from '../../tracker/use-tracker';
import Splash from './Splash';
import TrackerControls from './TrackerControls';

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
