import { ComponentMeta, ComponentStory } from '@storybook/react';

// import { Button } from './Button';
import { Button, ButtonProps } from 'components/button';

export default {
  title: 'Components/Buttons',
  component: Button,
} as ComponentMeta<typeof Button>;

const Cell = ({
  variation,
  icon,
  iconPosition,
  size,
  iconRotate,
  disabled,
}: {
  variation: ButtonProps['variation'];
  icon?: ButtonProps['icon'];
  iconPosition?: ButtonProps['iconPosition'];
  size?: ButtonProps['size'];
  iconRotate?: ButtonProps['iconRotate'];
  disabled?: boolean;
}) => (
  <Button
    variation={variation}
    icon={icon}
    iconPosition={iconPosition}
    iconRotate={iconRotate}
    size={size}
    disabled={disabled}>
    Button
  </Button>
);

const buttonVariationList: ButtonProps['variation'][] = [
  'primary',
  'secondary',
  'ghost',
  'ghost-alt',
  'text',
  'text-alt',
];

const Row = ({
  icon,
  iconPosition,
  size,
  iconRotate,
  disabled,
}: {
  icon?: ButtonProps['icon'];
  iconPosition?: ButtonProps['iconPosition'];
  size?: ButtonProps['size'];
  iconRotate?: ButtonProps['iconRotate'];
  disabled?: boolean;
}) => (
  <tr>
    <th>
      {size} {iconPosition}
    </th>
    {buttonVariationList.map(variation => (
      <td>
        <Cell variation={variation} icon={icon} iconPosition={iconPosition} size={size} disabled={disabled} />
      </td>
    ))}
    <td>
      <Button variation="link" size={size} disabled={disabled}>
        Link
      </Button>
    </td>
  </tr>
);

const Tbody = ({ size }: { size?: ButtonProps['size'] }) => (
  <tbody style={{ borderBottom: '1px solid #ccc' }}>
    <Row size={size} />
    <Row icon="arrow" iconPosition="right" size={size} />
    <Row icon="arrow" iconRotate={180} iconPosition="left" size={size} />
    <Row icon="arrow" iconPosition="only" size={size} />
    <Row size={size} disabled />
  </tbody>
);

export const All = () => (
  <table>
    <thead>
      <tr>
        <th />
        <th>Primary</th>
        <th>Secondary</th>
        <th>Ghost</th>
        <th>Ghost alt</th>
        <th>Text</th>
        <th>Text alt</th>
        <th>Link</th>
      </tr>
    </thead>
    <Tbody size="small" />
    <Tbody size="normal" />
    <Tbody size="big" />
  </table>
);

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Constructor = Template.bind({});
Constructor.args = {
  children: 'Button',
  variation: 'primary',
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   children: 'Button',
//   variation: 'secondary',
// };

// export const Large = Template.bind({});
// Large.args = {
//   children: 'Button',
//   variation: 'secondary',
//   size: 'big',
// };

// export const Small = Template.bind({});
// Small.args = {
//   children: 'Button',
//   variation: 'secondary',
//   size: 'small',
// };
