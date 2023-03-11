import range from 'lodash/range';
import { render, RenderResult, screen } from '@testing-library/react';
import { ItemAgg } from '@/models/aggregates';
import SelectItemModal, { dataTestids } from '.';

function renderSelectItemModal(): RenderResult {
  const items = range(10).map((num) =>
    ItemAgg.new({
      id: '414b5703-91d1-42fc-a007-36dd8f25e329',
      name: `Sample ${num + 1}`,
      traversable: true,
      thumbnailSrc: 'placeholder-item.png',
      modelSrc: 'placeholder-item.png',
    })
  );
  return render(<SelectItemModal opened width={100} selectedItem={null} items={items} />);
}

describe('SelectItemModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderSelectItemModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
