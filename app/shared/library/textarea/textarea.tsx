import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/textarea.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string; // optional styles to apply over defaults
  name?: string; // optional name field for input
  id?: string; // optional id field for input, likely use with label
}

const TextArea: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, className, name, id } = props;

  const textareaStyles = classNames(styles.textarea, className);

  return (
    <textarea
      value={value}
      onChange={onChange}
      className={textareaStyles}
      name={name || ''}
      id={id || ''}
    />
  );
};

export default TextArea;
