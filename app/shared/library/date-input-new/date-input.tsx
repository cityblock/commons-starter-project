import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';
import { formatDateAsTimestamp } from '../../helpers/format-helpers';
import * as styles from './css/date-input.css';

export const DEFAULT_FORMAT = 'YYYY-MM-DD';
export const LOADING_PLACEHOLDER = 'Loading...';

interface IProps {
  value: string | null; // use timestamp
  onChange: (newDate: string | null) => void;
  className?: string;
}

interface IState {
  loading: boolean;
  error: string | null;
}

export class DateInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { loading: false, error: null };
  }

  handleChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!this.state.loading) {
      this.setState({ loading: true, error: null });

      try {
        const newDate = e.currentTarget.value ? formatDateAsTimestamp(e.currentTarget.value) : null;

        await this.props.onChange(newDate);
        this.setState({ loading: false });
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render(): JSX.Element {
    const { value, className } = this.props;
    const { loading, error } = this.state;

    const formattedValue = value ? format(value, DEFAULT_FORMAT) : '';
    const inputStyles = classNames(
      styles.dateInput,
      {
        [styles.empty]: !value && !loading,
        [styles.error]: !!error,
      },
      className,
    );

    const inputType = loading ? 'text' : 'date';
    const inputValue = loading ? LOADING_PLACEHOLDER : formattedValue;

    return (
      <input
        type={inputType}
        value={inputValue}
        onChange={this.handleChange}
        className={inputStyles}
      />
    );
  }
}

export default DateInput;
