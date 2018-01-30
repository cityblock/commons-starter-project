import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

export interface IOptionType {
  lower: number | null;
  upper: number | null;
}

interface IProps {
  onChange: (index: number, selectedOption: IOptionType | {}) => any;
  isLarge: boolean;
  value: number | null;
  options?: IOptionType[];
  isUnselectable?: boolean;
}

export default class AgeRangeSelect extends React.Component<IProps> {
  static defaultProps: Partial<IProps> = {
    options: [
      { lower: null, upper: 19 },
      { lower: 20, upper: 24 },
      { lower: 25, upper: 29 },
      { lower: 30, upper: 34 },
      { lower: 35, upper: 39 },
      { lower: 40, upper: 49 },
      { lower: 50, upper: 59 },
      { lower: 60, upper: 69 },
      { lower: 70, upper: 79 },
      { lower: 80, upper: null },
    ],
  };

  handleChange = (event: HTMLSelectElement) => {
    const { options, onChange } = this.props;

    let index: any = parseInt(event.target.value, 10);
    index = isNaN(index) ? null : index;
    const selectedOption = index > -1 ? options![index] : {};

    onChange(index, selectedOption);
  };

  renderEndOption(bound: number, index: number, messageId: string) {
    return (
      <FormattedMessage id={messageId} key={`ageRange-option-${index}`}>
        {(message: string) => {
          return <Option value={index.toString()} label={`${bound} ${message}`} />;
        }}
      </FormattedMessage>
    );
  }

  renderRangeOption(lower: number, upper: number, index: number) {
    return (
      <FormattedMessage id="ageRange.years" key={`ageRange-option-${index}`}>
        {(message: string) => {
          return <Option value={index.toString()} label={`${lower} - ${upper} ${message}`} />;
        }}
      </FormattedMessage>
    );
  }

  render() {
    const { isLarge, value, options, isUnselectable } = this.props;
    const selectedValue = value !== null ? value.toString() : '';

    return (
      <Select
        required
        name="ageRange"
        large={isLarge}
        value={selectedValue}
        onChange={this.handleChange}
      >
        <Option disabled={true} messageId="ageRange.placeholder" value="" />
        {!!isUnselectable && <Option messageId="select.unselect" value="" />}
        {options!.map(({ lower, upper }, index) => {
          if (lower !== null && upper !== null) {
            return this.renderRangeOption(lower, upper, index);
          } else if (lower !== null) {
            return this.renderEndOption(lower, index, 'ageRange.over');
          } else if (upper !== null) {
            return this.renderEndOption(upper, index, 'ageRange.under');
          }
        })}
      </Select>
    );
  }
}
