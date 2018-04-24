import * as React from 'react';
import SmallText from '../shared/library/small-text/small-text';
import * as styles from './css/contacts-header.css';

const ContactsHeader: React.StatelessComponent = () => {
  return (
    <div className={styles.container}>
      <SmallText messageId="header.contacts" color="white" font="basetica" size="large" isBold />
    </div>
  );
};

export default ContactsHeader;
