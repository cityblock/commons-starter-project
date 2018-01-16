import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Icon from '../../shared/library/icon/icon';
import { IconName } from '../../shared/library/icon/icon-types';
import { Selected } from '../dashboard-container';
import fetchPatientList, { IInjectedProps } from '../fetch-patient-list';
import * as styles from './css/navigation-item.css';

export const Divider: React.StatelessComponent<{ className: string }> = ({ className }) => {
  return <div className={className} />;
};

export interface IProps extends IInjectedProps {
  text?: string; // free text, use with backend tags
  routeBase: string;
  selected: Selected; // name of item (used in fetching patient list)
  isSelected: boolean; // is the item selected
  icon: IconName;
  noDivider?: boolean; // remove divider
}

export const NavigationItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { text, icon, routeBase, selected, isSelected, noDivider, patientResults } = props;

  const containerStyles = classNames(styles.container, {
    [styles.selected]: isSelected,
  });
  const dividerStyles = classNames(styles.divider, {
    [styles.grayDivider]: !noDivider && !isSelected,
  });
  const iconStyles = classNames(styles.icon, {
    [styles.selectedIcon]: isSelected,
  });

  const formattedText = !text ? (
    <FormattedMessage id={`dashboard.${selected}`}>
      {(message: string) => <h4>{message}</h4>}
    </FormattedMessage>
  ) : (
    <h4>{text}</h4>
  );

  return (
    <div>
      <Link to={`${routeBase}/${selected}`} className={containerStyles}>
        <div className={styles.listName}>
          <Icon name={icon} className={iconStyles} />
          {formattedText}
        </div>
        {!!patientResults && <p>{patientResults.totalCount}</p>}
      </Link>
      <Divider className={dividerStyles} />
    </div>
  );
};

export default fetchPatientList()(NavigationItem);
