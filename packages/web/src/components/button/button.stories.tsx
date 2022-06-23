import type { Meta, Story } from '@storybook/react';
import type { ButtonProps } from './button';
import { Button } from './button';

export default {
  component: Button,
  title: 'Components/Button',
  args: {
    primary: true,
    children: 'Button',
  },
} as Meta<ButtonProps>;

const Template: Story<ButtonProps> = (props) => <Button {...props} />;
export const Primary = Template.bind({});

export const Secondary = Template.bind({});
Secondary.args = { primary: false };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

export const LongContent = Template.bind({});
LongContent.args = { children: 'Some very long button content that will overflow' };
