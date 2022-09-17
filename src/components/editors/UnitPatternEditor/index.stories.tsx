import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { UnitPatternVo } from '@/valueObjects';

import UnitPatternEditor from '.';

export default {
  title: 'Editor/UnitPatternEditor',
  component: UnitPatternEditor,
  argTypes: {},
} as ComponentMeta<typeof UnitPatternEditor>;

const Template: ComponentStory<typeof UnitPatternEditor> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleUnitPatternUpdate = (unitPattern: UnitPatternVo) => {
    updateArgs({
      unitPattern,
    });
  };

  return (
    <div className="w-32 h-32 inline-flex">
      <UnitPatternEditor {...args} onUpdate={handleUnitPatternUpdate} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  unitPattern: new UnitPatternVo([
    [true, true, true],
    [true, false, true],
    [true, true, true],
  ]),
  unitSize: 40,
};
