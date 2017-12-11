import * as React from 'react';
import Icon from '../icon/icon';
import TextInput from '../text-input/text-input';
import * as styles from './css/input.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderMessageId: string | null; // optional placeholderMessageId text for empty field
}

const SearchInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, placeholderMessageId } = props;

  return (
    <div className={styles.container}>
      <TextInput
        value={value}
        onChange={onChange}
        className={styles.textInput}
        placeholderMessageId={placeholderMessageId}
      />
      <div className={styles.iconContainer}>
        <Icon name="search" className={styles.icon} />
      </div>
    </div>
  );
};

export default SearchInput;
