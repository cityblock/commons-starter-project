import * as classNames from 'classnames';
import * as React from 'react';
import { FullScreeningToolFragment } from '../graphql/types';
import * as styles from './css/screening-tools-popup.css';

interface IProps {
  screeningTools?: FullScreeningToolFragment[];
  screeningToolsLoading?: boolean;
  onSelectScreeningTool: (screeningTool: FullScreeningToolFragment) => any;
  onDismiss: () => any;
}

export default class ScreeningToolsPopup extends React.Component<IProps, {}> {
  renderScreeningTools() {
    const { screeningTools, screeningToolsLoading, onSelectScreeningTool } = this.props;

    if (screeningToolsLoading) {
      return <div className={styles.screeningToolOptionsLoading}>Loading...</div>;
    }

    if (!screeningTools || !screeningTools.length) {
      return (
        <div className={styles.emptyScreeningToolOptions}>No screening tools for this domain</div>
      );
    }

    return screeningTools.map(screeningTool => (
      <div
        key={screeningTool.id}
        className={styles.screeningToolOption}
        onClick={() => onSelectScreeningTool(screeningTool)}
      >
        <div className={styles.screeningToolOptionText}>{screeningTool.title}</div>
      </div>
    ));
  }

  render() {
    const { onDismiss } = this.props;

    return (
      <div className={styles.screeningToolsPopupContent}>
        <div className={styles.screeningToolsPopupHeader}>
          <div className={styles.screeningToolsPopupDismissButton} onClick={onDismiss} />
        </div>
        <div className={styles.screeningToolsPopupBody}>
          <div className={classNames(styles.screeningToolsPopupTitle, styles.noMargin)}>
            Select a tool
          </div>
          <div className={styles.screeningToolOptions}>{this.renderScreeningTools()}</div>
        </div>
      </div>
    );
  }
}
