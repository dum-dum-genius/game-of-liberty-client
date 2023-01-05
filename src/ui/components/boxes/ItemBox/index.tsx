import classnames from 'classnames';
import { ItemAgg } from '@/models/aggregates';
import dataTestids from './dataTestids';

type Props = {
  item: ItemAgg;
  active?: boolean;
  onClick?: () => void;
};

function ItemBox({ item, active, onClick }: Props) {
  return (
    <div
      data-testid={dataTestids.root}
      className={classnames(
        'w-full',
        'h-full',
        'flex',
        'items-center',
        'justify-center',
        'border-4',
        active ? 'border-[#01D6C9]' : 'border-transparent',
        'box-border',
        'cursor-pointer',
        'bg-black'
      )}
      onClick={onClick}
      onKeyPress={onClick}
      tabIndex={0}
      role="button"
    >
      <img className="w-full h-full" src={item.getAssetSrc()} alt={item.getName()} />
    </div>
  );
}

export default ItemBox;
export { dataTestids };
