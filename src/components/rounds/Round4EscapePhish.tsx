import React from 'react';
import { Team } from '../../types';
import { HuntRoundRunner } from './HuntRoundRunner';

interface Round4EscapePhishProps {
  team: Team;
  isReadOnly?: boolean;
  onComplete: (score: number, details: Record<string, unknown>) => void;
}

export const Round4EscapePhish: React.FC<Round4EscapePhishProps> = ({ team, isReadOnly = false, onComplete }) => {
  return (
    <HuntRoundRunner
      roundNumber={4}
      team={team}
      isReadOnly={isReadOnly}
      onComplete={onComplete}
    />
  );
};
