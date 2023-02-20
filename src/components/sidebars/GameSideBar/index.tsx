import { useState } from 'react';
import classnames from 'classnames';
import SmallLogo from '@/components/logos/SmallLogo';
import PlaceItemIcon from '@/components/icons/PlaceItemIcon';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

type Props = {
  align: 'row' | 'column';
  onLogoClick: () => void;
  isPlaceItemActive: boolean;
  onPlaceItemClick: () => void;
};

function GameSideBar({ align, onLogoClick, isPlaceItemActive, onPlaceItemClick }: Props) {
  const [isPlaceItemMenuHovered, setIsPlaceItemMenuHovered] = useState<boolean>(false);

  return (
    <section
      data-testid={dataTestids.root}
      className={classnames(
        align === 'column' ? 'w-[78px]' : 'w-full',
        align === 'row' ? 'h-[78px]' : 'h-full',
        'flex',
        align === 'column' ? 'flex-col' : 'flex-row',
        'bg-[#1C1C1C]'
      )}
    >
      <ItemWrapper highlighted={false} active={false} hovered={false} onClick={onLogoClick}>
        <SmallLogo />
      </ItemWrapper>
      <ItemWrapper
        label="Build"
        highlighted={isPlaceItemMenuHovered}
        active={isPlaceItemActive}
        hovered={isPlaceItemMenuHovered}
        onClick={onPlaceItemClick}
        onMouseEnter={() => {
          setIsPlaceItemMenuHovered(true);
        }}
        onMouseLeave={() => {
          setIsPlaceItemMenuHovered(false);
        }}
      >
        <PlaceItemIcon highlighted={isPlaceItemMenuHovered} active={isPlaceItemActive} />
      </ItemWrapper>
    </section>
  );
}

export default GameSideBar;
export { dataTestids };
