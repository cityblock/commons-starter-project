import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/left-nav-quick-action.css';
import { QuickActionColorsMapping, QuickActionIconsMapping } from './helpers';

export type QuickAction =
  | 'addProgressNote'
  | 'addQuickCall'
  | 'administerTool'
  | 'viewDocuments'
  | 'openFormLibrary';

interface IProps {
  quickAction: QuickAction;
  onClick: () => void;
}

const LeftNavQuickAction: React.StatelessComponent<IProps> = (props: IProps) => {
  const { quickAction, onClick } = props;

  const iconName = QuickActionIconsMapping[quickAction];
  const iconColor = QuickActionColorsMapping[quickAction];

  return (
    <button className={styles.button} onClick={onClick}>
      <div className={styles.flex}>
        <Icon name={iconName} color={iconColor} className={styles.icon} />
        <SmallText messageId={`quickActions.${quickAction}`} size="large" color="black" isBold />
      </div>
      <div className={styles.divider} />
    </button>
  );
};

export default LeftNavQuickAction;
