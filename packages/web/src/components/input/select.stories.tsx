import type { Meta, Story } from "@storybook/react";
import type { SelectProps } from "./select";
import { Select } from "./select";

export default {
  component: Select,
  title: "Components/Select",
  args: {
    placeholder: "Placeholder",
  },
} as Meta<SelectProps>;

const Template: Story<SelectProps> = (props) => (
  <Select {...props}>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </Select>
);

export const Default = Template.bind({});
