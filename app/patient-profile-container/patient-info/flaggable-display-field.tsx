import * as classNames from 'classnames';
import * as React from 'react';
import DefaultText from '../../shared/library/default-text/default-text';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/flaggable-display-field.css';

interface IProps {
  labelMessageId: string;
  value: string | null;
  correctedValue?: string | null;
  className?: string;
}

const FlaggableDisplayField: React.StatelessComponent<IProps> = (props: IProps) => {
  const { labelMessageId, value, correctedValue, className } = props;
  const containerStyle = classNames(styles.container, className);
  const flagIcon = correctedValue ? <Icon name="flag" className={styles.flag} /> : null;

  return (
    <div className={containerStyle}>
      <div>
        <DefaultText messageId={labelMessageId} className={styles.label} color="gray" />
        {flagIcon}
      </div>
      <div className={styles.value}>{value}</div>
      {correctedValue && <div className={styles.correctedValue}>{correctedValue}</div>}
    </div>
  );
};

export default FlaggableDisplayField;
