import React from 'react';
import { Team } from '../../types';
import { HuntRoundRunner } from './HuntRoundRunner';

interface Round1DetectorProps {
  team: Team;
  isReadOnly?: boolean;
  onComplete: (score: number, details: Record<string, unknown>) => void;
}

export const Round1Detector: React.FC<Round1DetectorProps> = ({ team, isReadOnly = false, onComplete }) => {
  return (
    <HuntRoundRunner
      roundNumber={1}
      team={team}
      isReadOnly={isReadOnly}
      onComplete={onComplete}
    />
  );
};
