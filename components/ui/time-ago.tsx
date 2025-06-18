'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  date: Date | string;
  className?: string;
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    const target = typeof date === 'string' ? new Date(date) : date;
    function update() {
      setText(formatDistanceToNow(target, { addSuffix: true }));
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [date]);

  return (
    <span suppressHydrationWarning className={className}>{text}</span>
  );
}
