import React from 'react';
import { Team } from '../../types';
import { HuntRoundRunner } from './HuntRoundRunner';

interface Round2SocialEngProps {
  team: Team;
  isReadOnly?: boolean;
  onComplete: (score: number, details: Record<string, unknown>) => void;
}

export const Round2SocialEng: React.FC<Round2SocialEngProps> = ({ team, isReadOnly = false, onComplete }) => {
  return (
    <HuntRoundRunner
      roundNumber={2}
      team={team}
      isReadOnly={isReadOnly}
      onComplete={onComplete}
    />
  );
};
