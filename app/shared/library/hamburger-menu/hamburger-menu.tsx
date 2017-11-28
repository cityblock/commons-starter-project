import * as classNames from 'classnames';
import * as React from 'react';
import Icon from '../icon/icon';
import * as styles from './css/hamburger-menu.css';

export const Divider: React.StatelessComponent<{}> = () => <div className={styles.border} />;

interface IProps {
  open: boolean;
  onMenuToggle: (e?: any) => void; // event handler for clicking on menu icon
  children?: any; // use HamburgerMenuOption component in same library folder
}

const HamburgerMenu: React.StatelessComponent<IProps> = ({ open, onMenuToggle, children }) => {
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

  const iconStyles = classNames(styles.icon, {
    [styles.open]: open,
  });

  // prevent clicking on menu from propagating to components behind it
  const onMenuClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  return (
    <div onClick={onMenuClick} className={styles.container}>
      <Icon name="moreVert" className={iconStyles} onClick={onMenuToggle} />
      {open && <div className={styles.menu}>{menuOptions}</div>}
    </div>
  );
};

export default HamburgerMenu;
