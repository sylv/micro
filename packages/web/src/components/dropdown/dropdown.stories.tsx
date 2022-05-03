import type { Meta, Story } from "@storybook/react";
import { Button } from "../button/button";
import type { DropdownProps } from "./dropdown";
import { Dropdown } from "./dropdown";
import { DropdownDivider } from "./dropdown-divider";
import { DropdownTab } from "./dropdown-tab";

export default {
  component: Dropdown,
  title: "Components/Dropdown",
  args: {
    trigger: <Button>Click Me</Button>,
  },
} as Meta<DropdownProps>;

const Template: Story<DropdownProps> = (props) => (
  <Dropdown {...props}>
    <DropdownTab>First item</DropdownTab>
    <DropdownTab>Second item</DropdownTab>
    <DropdownDivider />
    <DropdownTab>Final item</DropdownTab>
  </Dropdown>
);
export const Default = Template.bind({});
