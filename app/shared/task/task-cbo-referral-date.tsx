import React from 'react';
import { graphql } from 'react-apollo';
import CBOReferralEditGraphql from '../../graphql/queries/cbo-referral-edit-mutation.graphql';
import { CBOReferralEdit, CBOReferralEditVariables } from '../../graphql/types';
import DateInput from '../library/date-input/date-input';
import FormLabel from '../library/form-label/form-label';
import Icon from '../library/icon/icon';
import styles from './css/task-cbo-referral-date.css';

export type Field = 'sentAt' | 'acknowledgedAt';

export interface IProps {
  field: Field;
  value: string | null;
  taskId: string;
  CBOReferralId: string;
  topMargin?: boolean;
}

interface IGraphqlProps {
  editCBOReferral: (options: { variables: CBOReferralEditVariables }) => { data: CBOReferralEdit };
  mutate?: any;
  kind?: any;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class TaskCBOReferralDate extends React.Component<allProps, IState> {
  state = {
    loading: false,
    error: null,
  };

  editCBOReferralDate = async (newDate: string | null): Promise<void> => {
    const { field, CBOReferralId, taskId, editCBOReferral } = this.props;

    if (!this.state.loading) {
      this.setState({ loading: true, error: null });
      try {
        await editCBOReferral({
          variables: {
            taskId,
            CBOReferralId,
            [field]: newDate,
          },
        });

        this.setState({ loading: false });
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render(): JSX.Element {
    const { field, value, topMargin } = this.props;

    return (
      <div className={topMargin ? styles.topMargin : ''}>
        <div className={styles.flex}>
          <FormLabel messageId={`task.CBO${field}`} gray={!!value} small={true} />
          {!value && (
            <div className={styles.alert}>
              <FormLabel messageId="task.CBODateRequired" gray={true} small={true} />
              <Icon name="error" className={styles.icon} />
            </div>
          )}
        </div>
        <DateInput value={value} onChange={this.editCBOReferralDate} />
      </div>
    );
  }
}

export default graphql<any>(CBOReferralEditGraphql, {
  name: 'editCBOReferral',
})(TaskCBOReferralDate) as React.ComponentClass<IProps>;
