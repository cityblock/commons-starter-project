import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/text-input.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // optional styles to apply over defaults
  name?: string; // optional name field for input
  id?: string; // optional id field for input, likely use with label
}

const TextInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, className, name, id } = props;
  const inputStyles = classNames(styles.input, className);

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={inputStyles}
      name={name || ''}
      id={id || ''}
    />
  );
};

export default TextInput;
