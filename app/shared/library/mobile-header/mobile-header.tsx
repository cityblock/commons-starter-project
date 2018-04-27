import * as React from 'react';
import SmallText from '../small-text/small-text';
import * as styles from './css/mobile-header.css';

interface IProps {
  messageId: string;
}

const ContactsHeader: React.StatelessComponent<IProps> = ({ messageId }) => {
  return (
    <div className={styles.container}>
      <SmallText messageId={messageId} color="white" font="basetica" size="large" isBold />
    </div>
  );
};

export default ContactsHeader;
