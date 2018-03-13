import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../library/button/button';
import Icon from '../library/icon/icon';
import * as styles from './css/glass-break.css';
import GlassBreakModal from './glass-break-modal';

export type Resource = 'patient' | 'progressNote';

interface IProps {
  resource: Resource;
  createGlassBreak: (reason: string, note: string | null) => any;
  patientName?: string;
}

interface IState {
  isPopupVisible: boolean;
}

class GlassBreak extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { isPopupVisible: false };
  }

  render(): JSX.Element {
    const { resource, patientName, createGlassBreak } = this.props;
    const containerStyles = classNames(styles.container, {
      [styles.fullScreen]: resource === 'patient',
      [styles.listItem]: resource === 'progressNote',
    });

    return (
      <div className={containerStyles}>
        <GlassBreakModal
          isPopupVisible={this.state.isPopupVisible}
          createGlassBreak={createGlassBreak}
          closePopup={() => this.setState({ isPopupVisible: false })}
          resource={resource}
        />
        <Icon name="lockOutline" color="red" className={styles.icon} />
        <div className={styles.header}>
          <FormattedMessage id={`glassBreak.${resource}private`}>
            {(message: string) => (
              <h1 className={classNames(styles.title, styles.red)}>{message}</h1>
            )}
          </FormattedMessage>
          {patientName && <h1 className={styles.title}>{patientName}</h1>}
        </div>
        <FormattedMessage id={`glassBreak.${resource}note`}>
          {(message: string) => <p className={styles.text}>{message}</p>}
        </FormattedMessage>
        <Button
          messageId="glassBreak.breakGlass"
          color="red"
          onClick={() => this.setState({ isPopupVisible: true })}
          className={styles.button}
        />
      </div>
    );
  }
}

export default GlassBreak;
