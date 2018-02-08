import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../library/icon/icon';
import * as styles from './css/helper-components.css';

interface IColumnHeaderProps {
  messageId: string;
  className?: string;
}

interface IProps {
  messageIdPrefix: string;
}

export const PatientTableColumnHeader: React.StatelessComponent<IColumnHeaderProps> = ({
  messageId,
  className,
}) => {
  const columnHeaderStyles = classNames(styles.columnHeader, className);
  return (
    <FormattedMessage id={messageId}>
      {(message: string) => <h3 className={columnHeaderStyles}>{message}</h3>}
    </FormattedMessage>
  );
};

export const PatientTablePlaceholder: React.StatelessComponent<IProps> = ({ messageIdPrefix }) => (
  <div className={styles.placeholder}>
    <Icon name="search" className={styles.searchIcon} />
    <FormattedMessage id={`${messageIdPrefix}.resultsPlaceholder`}>
      {(message: string) => <h4 className={styles.searchText}>{message}</h4>}
    </FormattedMessage>
  </div>
);

export const PatientTableNoResults: React.StatelessComponent<IProps> = ({ messageIdPrefix }) => (
  <div className={styles.placeholder}>
    <Icon name="errorOutline" className={styles.noResultsIcon} />
    <FormattedMessage id={`${messageIdPrefix}.noResults`}>
      {(message: string) => <h4 className={styles.noResults}>{message}</h4>}
    </FormattedMessage>
    <FormattedMessage id={`${messageIdPrefix}.noResultsDetail`}>
      {(message: string) => <p className={styles.noResultsDetail}>{message}</p>}
    </FormattedMessage>
  </div>
);
