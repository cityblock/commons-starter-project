import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, LinkProps } from 'react-router-dom';
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
  answerId?: string;
  selected: Selected; // name of item (used in fetching patient list)
  isSelected: boolean; // is the item selected
  icon: IconName;
  noDivider?: boolean; // remove divider
}

export const NavigationItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    text,
    icon,
    routeBase,
    selected,
    answerId,
    isSelected,
    noDivider,
    patientResults,
  } = props;

  const containerStyles = classNames(styles.container, {
    [styles.selected]: isSelected,
    [styles.loading]: selected === 'loading',
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

  const href = !answerId ? `${routeBase}/${selected}` : `${routeBase}/${selected}/${answerId}`;
  const linkProps: LinkProps = {
    to: href,
    className: containerStyles,
  };

  // do not link to anything if clicking on loading placehoder
  if (selected === 'loading') {
    linkProps.onClick = (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault();
  }

  return (
    <div>
      <Link {...linkProps}>
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
