import * as React from 'react';
import SmallText, { Color, IProps as ISmallTextProps } from '../small-text/small-text';
import * as styles from './css/text-info.css';

export interface IProps {
  messageId: string; // translate id for label of information
  text?: string; // what value of information is, use either text or textMessageId
  textMessageId?: string; // translate id for value of information
  className?: string; // optional styles to apply to container
  textStyles?: string; // optional styles to apply to text
  color?: Color; // optional color for value text, default is black
}

const TextInfo: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, text, textMessageId, className, textStyles, color } = props;

  const valueTextProps: ISmallTextProps = {
    color: color || 'black',
    className: textStyles,
  };

  if (textMessageId) {
    valueTextProps.messageId = textMessageId;
  } else {
    valueTextProps.text = text || '';
  }

  return (
    <div className={className}>
      <SmallText messageId={messageId} className={styles.margin} />
      <SmallText {...valueTextProps} />
    </div>
  );
};

export default TextInfo;
