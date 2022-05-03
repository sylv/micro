import type { Meta, Story } from "@storybook/react";
import type { AvatarProps } from "./avatar";
import { Avatar } from "./avatar";

export default {
  component: Avatar,
  title: "Components/Avatar",
  args: {
    userId: "123",
  },
} as Meta<AvatarProps>;

const Template: Story<AvatarProps> = (props) => <Avatar {...props} />;
export const Default = Template.bind({});
