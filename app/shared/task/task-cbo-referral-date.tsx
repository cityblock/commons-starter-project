import * as React from 'react';
import { graphql } from 'react-apollo';
import * as CBOReferralEditMutationGraphql from '../../graphql/queries/cbo-referral-edit-mutation.graphql';
import { CBOReferralEditMutation, CBOReferralEditMutationVariables } from '../../graphql/types';
import DateInput from '../library/date-input/date-input';
import FormLabel from '../library/form-label/form-label';
import Icon from '../library/icon/icon';
import * as styles from './css/task-cbo-referral-date.css';

export type Field = 'sentAt' | 'acknowledgedAt';

export interface IProps {
  field: Field;
  value: string | null;
  taskId: string;
  CBOReferralId: string;
  topMargin?: boolean;
}

interface IGraphqlProps {
  editCBOReferral: (
    options: { variables: CBOReferralEditMutationVariables },
  ) => { data: CBOReferralEditMutation };
  mutate?: any;
  kind?: any;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class TaskCBOReferralDate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      loading: false,
      error: null,
    };
  }

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

export default graphql<IGraphqlProps, IProps, allProps>(CBOReferralEditMutationGraphql as any, {
  name: 'editCBOReferral',
})(TaskCBOReferralDate);
