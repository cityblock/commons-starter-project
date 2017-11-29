import * as classNames from 'classnames';
import * as React from 'react';
import SelectDropdownOption from '../select-dropdown-option/select-dropdown-option';
import * as styles from './css/select-dropdown.css';

interface IProps {
  value: string;
  detail?: string;
  avatarUrl?: string;
  loading?: boolean;
  error?: string;
  children?: any;
}

interface IState {
  open: boolean;
}

// Note: Unless you have a specific reason for wanting to use
// this component such as inclusion of photos or specific styling
// of each option, use the plain select component because of its
// built in funcionality optimized for mobile.
class SelectDropdown extends React.Component<IProps, IState> {
  private menu: HTMLDivElement | null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      open: false,
    };
  }

  componentWillMount() {
    // needed to detect if clicking away from dropdown menu
    document.addEventListener('click', this.onClickAway as any, false);
  }

  componentWillUnmount() {
    // remove listener when the component is destroyed
    document.removeEventListener('click', this.onClickAway as any, false);
  }

  onClickAway = (e: React.MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLDivElement;

    // if clicking away from menu
    if (this.menu && !this.menu.contains(target)) {
      this.setState({ open: false });
    }
  };

  onClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render(): JSX.Element {
    const { avatarUrl, value, detail, loading, error, children } = this.props;
    const isOpen = this.state.open && children;

    const containerStyles = classNames(styles.container, {
      [styles.error]: !!error,
    });

    const options = isOpen ? (
      loading ? (
        <div className={styles.dropdown}>
          <SelectDropdownOption value="Loading..." />
        </div>
      ) : (
        <div className={styles.dropdown}>{children}</div>
      )
    ) : null;

    return (
      <div className={styles.main}>
        <div
          className={containerStyles}
          ref={menu => {
            this.menu = menu;
          }}
          onClick={this.onClick}
          tabIndex={0}
        >
          {avatarUrl && <img src={avatarUrl} alt="avatar photo" />}
          <h4>{value}</h4>
          {detail && <p>{`(${detail})`}</p>}
          {options}
        </div>
        {error && <h4 className={styles.errorText}>{error}</h4>}
      </div>
    );
  }
}

export default SelectDropdown;
