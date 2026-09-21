import React from 'react';
import { Team } from '../../types';
import { HuntRoundRunner } from './HuntRoundRunner';

interface Round3InvestigationProps {
  team: Team;
  isReadOnly?: boolean;
  onComplete: (score: number, details: Record<string, unknown>) => void;
}

export const Round3Investigation: React.FC<Round3InvestigationProps> = ({ team, isReadOnly = false, onComplete }) => {
  return (
    <HuntRoundRunner
      roundNumber={3}
      team={team}
      isReadOnly={isReadOnly}
      onComplete={onComplete}
    />
  );
};
