import { render, RenderResult, screen } from '@testing-library/react';
import GameRoomSideBar from '.';
import dataTestids from './dataTestids';

function renderGameRoomSideBar(): RenderResult {
  return render(
    <GameRoomSideBar
      relativeCoordinates={[]}
      onRelativeCoordinatesUpdate={() => {}}
    />
  );
}

describe('GameRoomSideBar', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameRoomSideBar();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
