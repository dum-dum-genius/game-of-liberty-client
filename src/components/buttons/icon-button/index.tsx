import { useState } from 'react';

import { dataTestids } from './data-test-ids';
import { CrossIcon } from '@/components/icons/cross-icon';

export type Icon = 'cross';

function getIconComponent(icon: Icon, highlighted: boolean) {
  if (icon === 'cross') {
    return <CrossIcon highlighted={highlighted} />;
  }
  return null;
}

type Props = {
  icon: Icon;
  onClick: () => any;
};

export function IconButton({ icon, onClick = () => {} }: Props) {
  const [hovered, setHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <button
      data-testid={dataTestids.root}
      className="inline-flex cursor-pointer outline-none border-none bg-none p-0"
      type="button"
      aria-label="icon button"
      onClick={onClick}
      onKeyDown={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getIconComponent(icon, hovered)}
    </button>
  );
}