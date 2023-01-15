import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, SizeVo, BoundVo } from '@/models/valueObjects';

import GameMiniMap from '.';

export default {
  title: 'Map/GameMiniMap',
  component: GameMiniMap,
  argTypes: {},
} as ComponentMeta<typeof GameMiniMap>;

const Template: ComponentStory<typeof GameMiniMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleDrag = (newCenter: LocationVo) => {
    updateArgs({
      center: newCenter,
    });
  };

  return <GameMiniMap {...args} onDrag={handleDrag} />;
};

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
  size: SizeVo.new(300, 300),
  bound: BoundVo.new(LocationVo.new(0, 0), LocationVo.new(30, 30)),
};
