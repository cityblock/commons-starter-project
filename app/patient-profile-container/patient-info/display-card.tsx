import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import HamburgerMenuOption from '../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../shared/library/hamburger-menu/hamburger-menu';
import * as styles from './css/display-card.css';

interface IProps {
  children?: any;
  titleMessageId?: string;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  className?: string;
}

interface IState {
  isMenuVisible: boolean;
}

export default class DisplayCard extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { isMenuVisible: false };
  }

  handleMenuToggle = () => {
    const { isMenuVisible } = this.state;
    this.setState({ isMenuVisible: !isMenuVisible });
  };

  renderMenu() {
    const { onEditClick, onDeleteClick } = this.props;
    const { isMenuVisible } = this.state;

    const editOption = onEditClick ? (
      <HamburgerMenuOption messageId="displayCard.edit" icon="create" onClick={onEditClick} />
    ) : null;

    const deleteOption = onDeleteClick ? (
      <HamburgerMenuOption messageId="displayCard.delete" icon="delete" onClick={onDeleteClick} />
    ) : null;

    return (
      <HamburgerMenu
        open={isMenuVisible}
        onMenuToggle={this.handleMenuToggle}
        className={styles.menu}
      >
        {editOption}
        {deleteOption}
      </HamburgerMenu>
    );
  }

  render() {
    const { children, titleMessageId, className } = this.props;

    const titleComponent = titleMessageId ? (
      <FormattedMessage id={titleMessageId}>
        {(message: string) => <h3 className={styles.title}>{message}</h3>}
      </FormattedMessage>
    ) : null;

    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.header}>
          {titleComponent}
          {this.renderMenu()}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    );
  }
}
