import React from 'react';
import { currentUserEdit, currentUserEditVariables } from '../graphql/types';
import Text from '../shared/library/text/text';
import ToggleSwitch from '../shared/library/toggle-switch/toggle-switch';
import styles from './css/status-toggle.css';

interface IProps {
  isAvailable: boolean;
  editCurrentUser: (options: { variables: currentUserEditVariables }) => { data: currentUserEdit };
}

interface IState {
  loading: boolean;
  error: string | null;
}

class StatusToggle extends React.Component<IProps, IState> {
  state = {
    loading: false,
    error: null,
  };

  handleClick = async (): Promise<void> => {
    if (!this.state.loading) {
      this.setState({ loading: true, error: null });

      try {
        await this.props.editCurrentUser({ variables: { isAvailable: !this.props.isAvailable } });
      } catch (err) {
        this.setState({ error: err.message });
      }

      this.setState({ loading: false });
    }
  };

  render(): JSX.Element {
    const { isAvailable } = this.props;

    const statusMessageId = isAvailable ? 'settings.available' : 'settings.unavailable';
    const statusColor = isAvailable ? 'green' : 'red';

    return (
      <div>
        <div className={styles.text}>
          <Text
            messageId="settings.status"
            size="largest"
            color="black"
            font="basetica"
            isBold
            className={styles.marginRight}
          />
          <Text
            messageId={statusMessageId}
            size="largest"
            color={statusColor}
            font="basetica"
            isBold
          />
        </div>
        <ToggleSwitch isOn={isAvailable} onClick={this.handleClick} />
      </div>
    );
  }
}

export default StatusToggle;
