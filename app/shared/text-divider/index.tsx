import * as React from 'react';
import * as styles from './css/index.css';

interface IProps {
  label: string;
}

const TextDivider: React.StatelessComponent<IProps> = ({ label }) => (
  <div className={styles.container}>
    <p>{label}</p>
    <div className={styles.divider} />
  </div>
);

export default TextDivider;
