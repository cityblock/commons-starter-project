import React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import userHoursEditMutationGraphql from '../graphql/queries/user-hours-edit-mutation.graphql';
import { getCurrentUserHours } from '../graphql/types';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import Text from '../shared/library/text/text';
import styles from './css/daily-work-hours-dropdown.css';
import { workHoursOptions } from './helpers/work-hours-options';

interface IProps {
  userHours: getCurrentUserHours['currentUserHours'];
  disabled: boolean;
}

interface IState {
  loading: boolean;
  error: string | null;
}

class DailyWorkHoursDropdown extends React.Component<IProps, IState> {
  state = {
    loading: false,
    error: null,
  };

  handleChange = (mutate: MutationFn, isStartTime: boolean) => {
    return async (e: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
      const { userHours } = this.props;

      // can only edit if not loading and already have user hours
      if (!this.state.loading && userHours.length) {
        this.setState({ loading: true, error: null });

        const value = parseInt(e.currentTarget.value, 10);

        try {
          const variables = {
            userHoursId: userHours[0].id,
            startTime: isStartTime ? value : userHours[0].startTime,
            endTime: isStartTime ? userHours[0].endTime : value,
          };

          const response = await mutate({
            variables,
          });

          this.setState({
            loading: false,
            error: (response as any).errors ? (response as any).errors[0] : null,
          });
        } catch (err) {
          this.setState({ loading: false, error: err.message });
        }
      }
    };
  };

  render(): JSX.Element {
    const { disabled, userHours } = this.props;
    const { error } = this.state;

    if (!userHours.length) {
      return (
        <div className={styles.empty}>
          <Text messageId="settings.notAvailable" size="largest" color="lightGray" />
        </div>
      );
    }

    const options = workHoursOptions.map((option, i) => {
      return <Option key={i} value={option.value} label={option.label} />;
    });

    return (
      <div className={styles.container}>
        <Mutation mutation={userHoursEditMutationGraphql}>
          {mutate => (
            <React.Fragment>
              <Select
                onChange={this.handleChange(mutate, true)}
                value={userHours[0].startTime}
                hasError={!!error}
                disabled={disabled}
                className={styles.select}
                large
              >
                {options}
              </Select>
              <Select
                onChange={this.handleChange(mutate, false)}
                value={userHours[0].endTime}
                hasError={!!error}
                disabled={disabled}
                className={styles.select}
                large
              >
                {options}
              </Select>
            </React.Fragment>
          )}
        </Mutation>
      </div>
    );
  }
}

export default DailyWorkHoursDropdown;
