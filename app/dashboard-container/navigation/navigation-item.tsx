import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Icon from '../../shared/library/icon/icon';
import { IconName } from '../../shared/library/icon/icon-types';
import { Selected } from '../dashboard-container';
import * as styles from './css/navigation-item.css';

export const Divider: React.StatelessComponent<{ className: string }> = ({ className }) => {
  return <div className={className} />;
};

interface IProps {
  text?: string; // free text, use with backend tags
  icon: IconName;
  iconStyles?: string; // specify class to color icon
  routeBase: string;
  name: Selected; // name of current item
  selected: Selected; // name of selected item
  noDivider?: boolean; // remove divider
}

const NavigationItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { text, icon, iconStyles, routeBase, name, selected, noDivider } = props;
  const isSelected = name === selected;

  const containerStyles = classNames(styles.container, {
    [styles.selected]: isSelected,
  });
  const dividerStyles = classNames(styles.divider, {
    [styles.grayDivider]: !noDivider && !isSelected,
  });

  const formattedText = !text ? (
    <FormattedMessage id={`dashboard.${name}`}>
      {(message: string) => <h4>{message}</h4>}
    </FormattedMessage>
  ) : (
    <h4>{text}</h4>
  );

  return (
    <div>
      <Link to={`${routeBase}/${name}`} className={containerStyles}>
        <Icon name={icon} className={classNames(styles.icon, iconStyles)} />
        {formattedText}
      </Link>
      <Divider className={dividerStyles} />
    </div>
  );
};

export default NavigationItem;
