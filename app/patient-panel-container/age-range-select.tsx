import { isNil } from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

export interface IAgeChangeOptions extends IAgeOptions {
  index: number | null;
}

interface IAgeOptions {
  ageMin: number | null;
  ageMax: number | null;
}

interface IProps {
  onChange: (options: IAgeChangeOptions) => any;
  isLarge: boolean;
  value: number | null;
  options?: IAgeOptions[];
  isUnselectable?: boolean;
}

export default class AgeRangeSelect extends React.Component<IProps> {
  static defaultProps: Partial<IProps> = {
    options: [
      { ageMin: null, ageMax: 19 },
      { ageMin: 20, ageMax: 24 },
      { ageMin: 25, ageMax: 29 },
      { ageMin: 30, ageMax: 34 },
      { ageMin: 35, ageMax: 39 },
      { ageMin: 40, ageMax: 49 },
      { ageMin: 50, ageMax: 59 },
      { ageMin: 60, ageMax: 69 },
      { ageMin: 70, ageMax: 79 },
      { ageMin: 80, ageMax: null },
    ],
  };

  handleChange = (event: HTMLSelectElement) => {
    const { options, onChange } = this.props;

    let index: any = parseInt(event.target.value, 10);
    index = isNaN(index) ? null : index;
    const selectedOption = index > -1 ? options![index] : { ageMin: null, ageMax: null };

    onChange({
      ...selectedOption,
      index,
    });
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
        {options!.map(({ ageMin, ageMax }, index) => {
          if (!isNil(ageMin) && !isNil(ageMax)) {
            return this.renderRangeOption(ageMin, ageMax, index);
          } else if (!isNil(ageMin)) {
            return this.renderEndOption(ageMin, index, 'ageRange.over');
          } else if (!isNil(ageMax)) {
            return this.renderEndOption(ageMax, index, 'ageRange.under');
          }
        })}
      </Select>
    );
  }
}
