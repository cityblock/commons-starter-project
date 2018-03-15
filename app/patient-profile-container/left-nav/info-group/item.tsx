import * as classNames from 'classnames';
import * as React from 'react';
import SmallText from '../../../shared/library/small-text/small-text';
import * as styles from './css/item.css';

interface IProps {
  labelMessageId: string | null;
  value: string | null;
  emptyValueMessageId?: string;
}

const InfoGroupItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { labelMessageId, value, emptyValueMessageId } = props;

  const valueComponent = value ? (
    <SmallText text={value} size="large" color="black" isBold />
  ) : (
    <SmallText
      messageId={emptyValueMessageId || 'patientInfo.missing'}
      size="large"
      color="lightGray"
      isBold
    />
  );

  const containerStyles = classNames(styles.container, {
    [styles.rightAlign]: !labelMessageId,
  });

  return (
    <div className={containerStyles}>
      {labelMessageId && <SmallText messageId={labelMessageId} size="large" color="darkGray" />}
      {valueComponent}
    </div>
  );
};

export default InfoGroupItem;
