import React from 'react';

import { useAtom } from 'jotai';

import Splash from './Splash';
import TrackerControls from './TrackerControls';
import { trackerState } from './store';

const Tracker: React.FC = () => {
  const [isTracking] = useAtom(trackerState);
  return (
    <>
      <TrackerControls isVisible={isTracking} />
      <Splash isVisible={!isTracking} />
    </>
  );
};

export default Tracker;
