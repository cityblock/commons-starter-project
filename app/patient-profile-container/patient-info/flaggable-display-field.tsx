import * as classNames from 'classnames';
import * as React from 'react';
import DefaultText from '../../shared/library/default-text/default-text';
import * as styles from './css/flaggable-display-field.css';

interface IProps {
  labelMessageId: string;
  value: string | null;
  correctedValue?: string | null;
  className?: string;
}

const FlaggableDisplayField: React.StatelessComponent<IProps> = (props: IProps) => {
  const { labelMessageId, value, correctedValue, className } = props;
  const labelStyle = classNames({ [styles.isFlagged]: !!correctedValue });
  const containerStyle = classNames(styles.container, className);

  return (
    <div className={containerStyle}>
      <DefaultText messageId={labelMessageId} className={labelStyle} color="gray" />
      <div className={styles.value}>{value}</div>
      {correctedValue && <div className={styles.correctedValue}>{correctedValue}</div>}
    </div>
  );
};

export default FlaggableDisplayField;
