import * as classNames from 'classnames';
import * as React from 'react';
import SmallText from '../../../shared/library/small-text/small-text';
import * as styles from './css/item.css';

interface IProps {
  labelMessageId?: string | null;
  label?: string; // override label translation
  value?: string | null;
  valueMessageId?: string;
  emptyValueMessageId?: string;
}

const InfoGroupItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { labelMessageId, label, value, valueMessageId, emptyValueMessageId } = props;

  let labelComponent: JSX.Element | false;

  if (label) {
    labelComponent = <SmallText text={label} size="large" color="black" isBold />;
  } else {
    labelComponent = !!labelMessageId && (
      <SmallText messageId={labelMessageId} size="large" color="darkGray" />
    );
  }

  const valueComponent =
    value || valueMessageId ? (
      <SmallText
        messageId={valueMessageId}
        text={value || undefined}
        size="large"
        color={label ? 'darkGray' : 'black'}
        isBold={!label}
      />
    ) : (
      <SmallText
        messageId={emptyValueMessageId || 'patientInfo.missing'}
        size="large"
        color="lightGray"
        isBold={!label}
      />
    );

  const containerStyles = classNames(styles.container, {
    [styles.rightAlign]: !labelMessageId && !label,
  });

  return (
    <div className={containerStyles}>
      {labelComponent}
      {valueComponent}
    </div>
  );
};

export default InfoGroupItem;
