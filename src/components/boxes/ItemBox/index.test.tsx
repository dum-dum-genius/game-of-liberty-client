import { render, RenderResult, screen } from '@testing-library/react';
import { ItemAgg } from '@/models/aggregates';
import ItemBox, { dataTestids } from '.';

function renderItemBox(): RenderResult {
  return render(
    <ItemBox
      item={ItemAgg.new({
        id: '414b5703-91d1-42fc-a007-36dd8f25e329',
        name: 'stone',
        traversable: true,
        thumbnailSrc: 'placeholder-item.png',
        modelSrc: 'placeholder-item.png',
      })}
    />
  );
}

describe('ItemBox', () => {
  it('Should render component successfully.', () => {
    try {
      renderItemBox();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
