import * as React from 'react';
import SmallText, { Color, IProps as ISmallTextProps, Size } from '../small-text/small-text';
import * as styles from './css/text-info.css';

export interface IProps {
  messageId: string; // translate id for label of information
  text?: string; // what value of information is, use either text or textMessageId
  textMessageId?: string; // translate id for value of information
  className?: string; // optional styles to apply to container
  textStyles?: string; // optional styles to apply to value text
  textColor?: Color; // optional color for value text, default is black
  messageColor?: Color; // optional color for message text, default is lightGrey
  size?: Size; // optional size for text size, default is small
}

const TextInfo: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    messageId,
    text,
    textMessageId,
    className,
    textStyles,
    messageColor,
    textColor,
    size,
  } = props;

  const valueTextProps: ISmallTextProps = {
    color: textColor || 'black',
    className: textStyles,
  };

  if (textMessageId) {
    valueTextProps.messageId = textMessageId;
  } else {
    valueTextProps.text = text || '';
  }

  return (
    <div className={className}>
      <SmallText
        messageId={messageId}
        className={styles.margin}
        size={size}
        color={messageColor || 'lightGray'}
      />
      <SmallText size={size} {...valueTextProps} />
    </div>
  );
};

export default TextInfo;
