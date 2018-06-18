import { isNil } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

interface IAgeOptions {
  ageMin: number | null;
  ageMax: number | null;
}

interface IProps {
  onChange: (options: IAgeOptions) => any;
  isLarge: boolean;
  value: string | null;
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
    const { onChange } = this.props;
    const bounds = event.target.value.split('To');

    if (bounds.length < 2) {
      onChange({ ageMin: null, ageMax: null });
    }

    let ageMin: any = parseInt(bounds[0], 10);
    ageMin = isNaN(ageMin) ? null : ageMin;

    let ageMax: any = parseInt(bounds[1], 10);
    ageMax = isNaN(ageMax) ? null : ageMax;

    onChange({ ageMin, ageMax });
  };

  renderUpperBoundOption(ageMax: number, index: number) {
    return (
      <FormattedMessage id="ageRange.under" key={`ageRange-option-${index}`}>
        {(message: string) => {
          return <Option value={formatAgeValue(null, ageMax)} label={`${ageMax} ${message}`} />;
        }}
      </FormattedMessage>
    );
  }

  renderLowerBoundOption(ageMin: number, index: number) {
    return (
      <FormattedMessage id="ageRange.over" key={`ageRange-option-${index}`}>
        {(message: string) => {
          return <Option value={formatAgeValue(ageMin, null)} label={`${ageMin} ${message}`} />;
        }}
      </FormattedMessage>
    );
  }

  renderRangeOption(ageMin: number, ageMax: number, index: number) {
    return (
      <FormattedMessage id="ageRange.years" key={`ageRange-option-${index}`}>
        {(message: string) => {
          return (
            <Option
              value={formatAgeValue(ageMin, ageMax)}
              label={`${ageMin} - ${ageMax} ${message}`}
            />
          );
        }}
      </FormattedMessage>
    );
  }

  render() {
    const { isLarge, value, options, isUnselectable } = this.props;

    return (
      <Select
        required
        name="ageRange"
        large={isLarge}
        value={value || ''}
        onChange={this.handleChange}
      >
        <Option disabled={!isUnselectable} messageId="ageRange.placeholder" value="" />
        {options!.map(({ ageMin, ageMax }, index) => {
          if (!isNil(ageMin) && !isNil(ageMax)) {
            return this.renderRangeOption(ageMin, ageMax, index);
          } else if (!isNil(ageMin)) {
            return this.renderLowerBoundOption(ageMin, index);
          } else if (!isNil(ageMax)) {
            return this.renderUpperBoundOption(ageMax, index);
          }
        })}
      </Select>
    );
  }
}

export function formatAgeValue(ageMin: number | null, ageMax: number | null) {
  return `${ageMin || 'end'}To${ageMax || 'End'}`;
}
