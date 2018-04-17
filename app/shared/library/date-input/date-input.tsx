import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';
import * as styles from './css/date-input.css';

export const DEFAULT_FORMAT = 'YYYY-MM-DD';

interface IProps {
  value: string | null; // use timestamp
  name?: string;
  onChange: (newDate: string | null, name?: string) => void;
  className?: string;
  small?: boolean; // optionally apply small styles
  disabled?: boolean;
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
        const newDate = e.currentTarget.value
          ? format(e.currentTarget.value, DEFAULT_FORMAT)
          : null;

        await this.props.onChange(newDate, this.props.name);
        this.setState({ loading: false });
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render(): JSX.Element {
    const { value, className, small, disabled, name } = this.props;
    const { loading, error } = this.state;

    const formattedValue = value ? format(value, DEFAULT_FORMAT) : '';
    const inputStyles = classNames(
      styles.dateInput,
      {
        [styles.empty]: !value && !loading,
        [styles.error]: !!error,
        [styles.small]: !!small,
        [styles.disabled]: !!disabled,
      },
      className,
    );

    return (
      <input
        name={name}
        type="date"
        value={formattedValue}
        onChange={this.handleChange}
        disabled={disabled}
        className={inputStyles}
      />
    );
  }
}

export default DateInput;
