import React from 'react';
import Text from '../text/text';
import styles from './css/mobile-header.css';

interface IProps {
  messageId: string;
}

const ContactsHeader: React.StatelessComponent<IProps> = ({ messageId }) => {
  return (
    <div className={styles.container}>
      <Text messageId={messageId} color="white" font="basetica" size="large" isBold />
    </div>
  );
};

export default ContactsHeader;
