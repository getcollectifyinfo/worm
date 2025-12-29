import React from 'react';
import { useGameAccess } from '../hooks/useGameAccess';

interface UserBadgeProps {
  className?: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ className = "h-8" }) => {
  const { tier } = useGameAccess();

  let badgeSrc = '/free_badge.png';
  if (tier === 'PRO') {
    badgeSrc = '/Pro_Badge.png';
  } else if (tier === 'GUEST') {
    badgeSrc = '/demo_badge.png';
  }

  return (
    <img 
      src={badgeSrc} 
      alt={`${tier} Badge`} 
      className={`object-contain ${className}`}
    />
  );
};
