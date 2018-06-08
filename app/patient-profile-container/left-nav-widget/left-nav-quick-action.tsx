import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import Text from '../../shared/library/text/text';
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
  onClose: () => void;
}

class LeftNavQuickAction extends React.Component<IProps> {
  handleClick = async (): Promise<void> => {
    const { onClick, onClose } = this.props;

    await onClick();
    onClose();
  };

  render(): JSX.Element {
    const { quickAction } = this.props;

    const iconName = QuickActionIconsMapping[quickAction];
    const iconColor = QuickActionColorsMapping[quickAction];

    return (
      <button className={styles.button} onClick={this.handleClick}>
        <div className={styles.flex}>
          <Icon name={iconName} color={iconColor} className={styles.icon} />
          <Text messageId={`quickActions.${quickAction}`} size="large" color="black" isBold />
        </div>
        <div className={styles.divider} />
      </button>
    );
  }
}

export default LeftNavQuickAction;
