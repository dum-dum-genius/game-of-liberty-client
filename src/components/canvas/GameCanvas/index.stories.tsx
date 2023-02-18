import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameCanvas from '.';
import { LocationVo } from '@/models/valueObjects';
import { PlayerEntity } from '@/models/entities';
import { ItemAgg, UnitAgg } from '@/models/aggregates';

export default {
  title: 'Canvas/GameCanvas',
  component: GameCanvas,
  argTypes: {},
} as ComponentMeta<typeof GameCanvas>;

const Template: ComponentStory<typeof GameCanvas> = function Template(args) {
  return (
    <div className="w-screen h-screen">
      <GameCanvas {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
const item = ItemAgg.new({
  id: 1,
  name: 'Hello',
  traversable: false,
  assetSrc: 'https://avatars.dicebear.com/api/pixel-art/1.svg',
  modelSrc: 'placeholder-item.png',
});
item.loadAsset();
Primary.args = {
  players: [
    PlayerEntity.new({
      id: '1',
      name: 'Mark',
      location: LocationVo.new(0, 0),
    }),
    PlayerEntity.new({
      id: '1',
      name: 'Mark',
      location: LocationVo.new(2, 2),
    }),
    PlayerEntity.new({
      id: '1',
      name: 'Mark',
      location: LocationVo.new(4, 4),
    }),
    PlayerEntity.new({
      id: '1',
      name: 'Mark',
      location: LocationVo.new(19, 19),
    }),
  ],
  units: [
    UnitAgg.new(1, LocationVo.new(0, 0)),
    UnitAgg.new(1, LocationVo.new(0, 1)),
    UnitAgg.new(1, LocationVo.new(0, 2)),
  ],
  cameraLocation: LocationVo.new(4, 4),
  items: [item],
  selectedItemId: null,
};
