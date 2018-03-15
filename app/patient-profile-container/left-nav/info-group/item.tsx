import * as React from 'react';
import SmallText from '../../../shared/library/small-text/small-text';
import * as styles from './css/item.css';

interface IProps {
  labelMessageId: string;
  value: string;
  emptyValueMessgeId?: string;
}

const InfoGroupItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { labelMessageId, value, emptyValueMessgeId } = props;

  const valueComponent = value ? (
    <SmallText text={value} size="large" color='black' isBold />
  ) : (
    <SmallText messageId={emptyValueMessgeId || 'patientInfo.missing'} size="large" color='lightGray' isBold />
  );

  return (
    <div className={styles.container}>
      <SmallText messageId={labelMessageId} size="large" color="darkGray" />
      {valueComponent}
    </div>
  );
};

export default InfoGroupItem;
