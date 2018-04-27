import * as React from 'react';
import Avatar from '../avatar/avatar';
import SmallText from '../small-text/small-text';
import * as styles from './css/select-dropdown-option.css';

interface IProps {
  value: string;
  onClick?: () => void;
  detail?: string;
  detailMessageId?: string;
  avatarUrl?: string | null;
}

const SelectDropdownOption: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onClick, detail, detailMessageId, avatarUrl } = props;
  let detailHtml = null;
  if (detail) {
    detailHtml = <p>{`(${detail})`}</p>;
  } else if (detailMessageId) {
    detailHtml = (
      <React.Fragment>
        <SmallText text="(" />
        <SmallText messageId={detailMessageId} className={styles.noMargin} />
        <SmallText text=")" className={styles.noMargin} />
      </React.Fragment>
    );
  }

  return (
    <div className={styles.option} onClick={onClick}>
      <Avatar src={avatarUrl} size="medium" className={styles.avatar} />
      <h4>{value}</h4>
      {detailHtml}
    </div>
  );
};

export default SelectDropdownOption;
