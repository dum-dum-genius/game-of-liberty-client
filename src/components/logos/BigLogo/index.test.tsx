import { render, RenderResult, screen } from '@testing-library/react';
import BigLogo, { dataTestids } from '.';

function renderBigLogo(): RenderResult {
  return render(<BigLogo />);
}

describe('BigLogo', () => {
  it('Should render component successfully.', () => {
    try {
      renderBigLogo();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});