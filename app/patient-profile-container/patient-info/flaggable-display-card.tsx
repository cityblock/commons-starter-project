import classNames from 'classnames';
import { format } from 'date-fns';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../shared/library/button/button';
import HamburgerMenuOption from '../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../shared/library/hamburger-menu/hamburger-menu';
import Text from '../../shared/library/text/text';
import styles from './css/flaggable-display-card.css';

export type FooterState = 'flagged' | 'confirm' | 'none' | 'verified';

interface IProps {
  children?: any;
  titleMessageId: string;
  footerState: FooterState;
  onFlagClick: () => void;
  flaggedMessageId?: string;
  flaggedOn?: string; // date
  onConfirmClick?: () => void;
  confirmMessageId?: string;
  verifiedMessageId?: string;
  verifiedOn?: string | null; // date
}

interface IState {
  isMenuVisible: boolean;
}

export default class FlaggableDisplayCard extends React.Component<IProps, IState> {
  state = { isMenuVisible: false };

  handleMenuToggle = () => {
    const { isMenuVisible } = this.state;
    this.setState({ isMenuVisible: !isMenuVisible });
  };

  renderFlaggedFooter() {
    const { footerState, flaggedMessageId, flaggedOn } = this.props;

    const flaggedOnMessage = flaggedOn ? (
      <FormattedMessage id="flaggableDisplayCard.flaggedOn">
        {(message: string) => (
          <div className={styles.date}>
            {message} {format(flaggedOn, 'MMM D, YYYY')}
          </div>
        )}
      </FormattedMessage>
    ) : null;

    const footer = (
      <div className={classNames(styles.footer, styles.flagged)}>
        <Text messageId={flaggedMessageId} color="black" size="medium" />
        {flaggedOnMessage}
      </div>
    );

    return footerState === 'flagged' ? footer : null;
  }

  renderVerifiedFooter() {
    const { footerState, verifiedMessageId, verifiedOn } = this.props;

    const flaggedOnMessage = verifiedOn ? (
      <FormattedMessage id="flaggableDisplayCard.verifiedOn">
        {(message: string) => (
          <div className={styles.date}>
            {message} {format(verifiedOn, 'MMM D, YYYY')}
          </div>
        )}
      </FormattedMessage>
    ) : null;

    const footer = (
      <div className={classNames(styles.footer, styles.flagged)}>
        <Text messageId={verifiedMessageId} color="white" size="medium" />
        {flaggedOnMessage}
      </div>
    );

    return footerState === 'verified' ? footer : null;
  }

  renderConfirmFooter() {
    const { footerState, confirmMessageId, onConfirmClick } = this.props;

    const confirmMessage = confirmMessageId ? (
      <Text
        messageId={confirmMessageId}
        color="white"
        size="medium"
        className={styles.footerDescription}
      />
    ) : null;

    const confirmButton = onConfirmClick ? (
      <Button
        messageId="flaggableDisplayCard.confirm"
        onClick={onConfirmClick}
        className={styles.button}
      />
    ) : null;

    const footer = (
      <div className={classNames(styles.footer)}>
        {confirmMessage}
        {confirmButton}
      </div>
    );

    return footerState === 'confirm' ? footer : null;
  }

  render() {
    const { children, titleMessageId, onFlagClick, footerState } = this.props;
    const { isMenuVisible } = this.state;
    const containerStyles = classNames(styles.container, {
      [styles.confirm]: footerState === 'confirm',
      [styles.flagged]: footerState === 'flagged',
      [styles.verified]: footerState === 'verified',
    });

    return (
      <div className={containerStyles}>
        <div className={styles.header}>
          <FormattedMessage id={titleMessageId}>
            {(message: string) => <h3 className={styles.title}>{message}</h3>}
          </FormattedMessage>
          <HamburgerMenu
            open={isMenuVisible}
            onMenuToggle={this.handleMenuToggle}
            className={styles.menu}
          >
            <HamburgerMenuOption
              messageId="flaggableDisplayCard.flag"
              icon="flag"
              onClick={onFlagClick}
            />
          </HamburgerMenu>
        </div>
        <div className={styles.body}>{children}</div>
        {this.renderFlaggedFooter()}
        {this.renderConfirmFooter()}
        {this.renderVerifiedFooter()}
      </div>
    );
  }
}
