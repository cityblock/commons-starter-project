import { addMonths, format } from 'date-fns';
import React from 'react';
import Option from '../library/option/option';
import Select from '../library/select/select';

interface IProps {
  year?: number;
  month?: number;
  onChange: (month: number, year: number) => void;
}

interface IOption {
  year: number;
  month: number;
  label: string;
  value: string;
}

interface IState {
  options: { [key: string]: IOption };
}

function getOptions() {
  const startDate = new Date();

  const options: { [key: string]: IOption } = {};
  for (let i = 0; i < 5; i++) {
    const date = addMonths(startDate, i);
    const year = date.getFullYear();
    const month = date.getMonth();
    const value = `${month}-${year}`;

    options[value] = { value, year, month, label: format(date, 'MMMM YYYY') };
  }
  return options;
}

export class MonthSelect extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { options: getOptions() };
  }

  handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const { month, year } = this.state.options[value];

    this.props.onChange(month, year);
  };

  renderOptions() {
    const { options } = this.state;

    return Object.keys(options).map(value => (
      <Option value={value} label={options[value].label} key={`calendar-option-${value}`} />
    ));
  }

  render(): JSX.Element {
    const { month, year } = this.props;
    const value = month && year ? `${month}-${year}` : '';

    return (
      <Select
        name="monthSelect"
        value={value}
        onChange={this.handleMonthChange}
        hasPlaceholder={true}
        large={true}
      >
        {this.renderOptions()}
      </Select>
    );
  }
}

export default MonthSelect;
