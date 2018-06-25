import React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import currentUserHoursGraphql from '../graphql/queries/get-current-user-hours.graphql';
import userHoursCreateMutationGraphql from '../graphql/queries/user-hours-create-mutation.graphql';
import userHoursDeleteMutationGraphql from '../graphql/queries/user-hours-delete-mutation.graphql';
import { getCurrentUserHours } from '../graphql/types';
import Checkbox from '../shared/library/checkbox/checkbox';
import styles from './css/day-off-toggle.css';

interface IProps {
  userHours: getCurrentUserHours['currentUserHours'];
  weekday: number;
  disabled: boolean;
}

interface IState {
  loading: boolean;
  error: string | null;
}

class DayOffToggle extends React.Component<IProps, IState> {
  state = {
    loading: false,
    error: null,
  };

  handleChange = (createMutation: MutationFn, deleteMutation: MutationFn) => {
    return async () => {
      const { userHours, weekday } = this.props;

      if (!this.state.loading) {
        this.setState({ loading: true, error: null });

        try {
          // if user is off that day, set them to work default hours
          if (!userHours.length) {
            await createMutation({
              variables: {
                weekday,
                startTime: 800, // 8 am
                endTime: 1800, // 6 pm
              },
              refetchQueries: [{ query: currentUserHoursGraphql }],
            });
            // otherwise delete existing user hours
          } else {
            userHours.forEach(async userHourGroup => {
              await deleteMutation({
                variables: { userHoursId: userHourGroup.id },
                refetchQueries: [{ query: currentUserHoursGraphql }],
              });
            });
          }

          this.setState({ loading: false });
        } catch (err) {
          this.setState({ loading: false, error: err.message });
        }
      }
    };
  };

  render(): JSX.Element {
    const { userHours, disabled } = this.props;

    return (
      <Mutation mutation={userHoursCreateMutationGraphql}>
        {createMutation => (
          <Mutation mutation={userHoursDeleteMutationGraphql}>
            {deleteMutation => (
              <Checkbox
                onChange={this.handleChange(createMutation, deleteMutation)}
                isChecked={!userHours.length}
                disabled={disabled}
                labelMessageId="settings.dayOff"
                labelClassName={styles.label}
              />
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default DayOffToggle;
