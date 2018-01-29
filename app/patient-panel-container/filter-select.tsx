import * as React from 'react';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

interface IProps {
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
  isLarge: boolean;
  value: string | null;
  options: string[];
  isUnselectable?: boolean;
}

export const FilterSelect: React.StatelessComponent<IProps> = props => {
  const { name, isLarge, value, options, isUnselectable, onChange } = props;
  const selectedValue = (value !== null) ? value.toString() : '';

  return (
    <Select
      required
      name={name}
      large={isLarge}
      value={selectedValue}
      onChange={onChange}
    >
      <Option disabled={true} messageId={`${name}Select.placeholder`} value="" />
      {!!isUnselectable && <Option messageId="select.unselect" value="" />}
      {options.map(option => {
        return (
          <Option
            value={option}
            messageId={`${name}.${option}`}
            key={`${name}-option-${option}`}
          />
        );
      })}
    </Select>
  );
};
