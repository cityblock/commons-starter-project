import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './css/header.css';
import TaskHamburgerMenu from './task-hamburger-menu';

const COPY_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

interface IProps {
  taskId: string;
  patientId: string;
  patientName: string;
  confirmDelete: () => void;
  routeBase: string;
}

interface IState {
  hamburgerMenuVisible: boolean;
  copySuccessVisible: boolean;
}

class TaskHeader extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      hamburgerMenuVisible: false,
      copySuccessVisible: false,
    };
  }

  onToggleHamburgerMenu = (): void => {
    this.setState({ hamburgerMenuVisible: !this.state.hamburgerMenuVisible });
  };

  onCopyShareLink = (): void => {
    this.setState({ hamburgerMenuVisible: false, copySuccessVisible: true });
    setTimeout(this.clearCopySuccess, COPY_SUCCESS_TIMEOUT_MILLISECONDS);
  };

  clearCopySuccess = (): void => {
    this.setState({ copySuccessVisible: false });
  };

  onClickDelete = (): void => {
    const { taskId, confirmDelete } = this.props;
    if (taskId) confirmDelete();
    this.setState({ hamburgerMenuVisible: false });
  };

  render() {
    const { patientName, taskId, patientId, routeBase } = this.props;
    const { hamburgerMenuVisible, copySuccessVisible } = this.state;

    if (!taskId || !routeBase) return null;
    // HANDLE LOADING STATE

    const copySuccessStyles = classNames(styles.copySuccess, {
      [styles.visible]: copySuccessVisible,
    });

    return (
      <div className={styles.container}>
        <h3 className={styles.headline}>
          Member:<span>{`${patientName}`}</span>
        </h3>
        <div className={styles.controls}>
          <p className={copySuccessStyles}>Copied to clipboard</p>
          <div className={styles.hamburger} onClick={this.onToggleHamburgerMenu} />
          <TaskHamburgerMenu
            taskId={taskId}
            patientId={patientId}
            visible={hamburgerMenuVisible}
            onClickAddAttachment={() => false}
            onClickDelete={this.onClickDelete}
            onCopy={this.onCopyShareLink}
          />
          <Link to={routeBase} className={styles.close} />
        </div>
      </div>
    );
  }
}

export default TaskHeader;
