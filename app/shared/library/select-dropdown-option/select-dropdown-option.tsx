import * as React from 'react';
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
      {avatarUrl && <img className={styles.img} src={avatarUrl} alt="avatar photo" />}
      <h4>{value}</h4>
      {detail && <p>{`(${detail})`}</p>}
    </div>
  );
};

export default SelectDropdownOption;
