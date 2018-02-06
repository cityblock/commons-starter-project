import * as React from 'react';
import Avatar from '../avatar/avatar';
import * as styles from './css/select-dropdown-option.css';

interface IProps {
  value: string;
  onClick?: () => void;
  detail?: string;
  avatarUrl?: string | null;
}

const SelectDropdownOption: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onClick, detail, avatarUrl } = props;

  return (
    <div className={styles.option} onClick={onClick}>
      <Avatar src={avatarUrl} size="medium" className={styles.avatar} />
      <h4>{value}</h4>
      {detail && <p>{`(${detail})`}</p>}
    </div>
  );
};

export default SelectDropdownOption;
