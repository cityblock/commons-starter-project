import * as classNames from 'classnames';
import * as React from 'react';
import onClickOutside, { OnClickOutProps } from 'react-onclickoutside';
import Icon from '../icon/icon';
import * as styles from './css/hamburger-menu.css';

export const Divider: React.StatelessComponent<{}> = () => <div className={styles.border} />;

interface IProps extends OnClickOutProps {
  open: boolean;
  onMenuToggle: (e?: any) => void; // event handler for clicking on menu icon
  children?: any; // use HamburgerMenuOption component in same library folder
  className?: string;
}

export class HamburgerMenu extends React.Component<IProps> {
  // prevent clicking on menu from propagating to components behind it
  onMenuClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  // close open menu if clicking away
  handleClickOutside = (): void => {
    const { open, onMenuToggle } = this.props;
    if (open) onMenuToggle();
  };

  render(): JSX.Element {
    const { open, onMenuToggle, children, className } = this.props;

    let menuOptions: JSX.Element[] | JSX.Element = [];
    // children can either be array or element - if array (multiple options), add dividers
    if (open && !React.isValidElement(children)) {
      children.forEach((child: JSX.Element, i: number) => {
        if (i > 0) (menuOptions as JSX.Element[]).push(<Divider key={i} />);
        (menuOptions as JSX.Element[]).push(child);
      });
      // otherwise just render the element
    } else if (open) {
      menuOptions = children;
    }

    const containerStyles = classNames(className, styles.container);
    const iconStyles = classNames(styles.icon, {
      [styles.open]: open,
    });

    return (
      <div onClick={this.onMenuClick} className={containerStyles}>
        <Icon name="moreVert" className={iconStyles} onClick={onMenuToggle} />
        {open && <div className={styles.menu}>{menuOptions}</div>}
      </div>
    );
  }
}

export default onClickOutside<IProps>(HamburgerMenu as any);
