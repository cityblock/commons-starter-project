import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as createPatientListMutationGraphql from '../../graphql/queries/patient-list-create-mutation.graphql';
import { patientListCreateMutation, patientListCreateMutationVariables } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import TextInput from '../../shared/library/text-input/text-input';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../shared/with-error-handler/with-error-handler';
import * as styles from './css/patient-list-shared.css';

interface IProps {
  cancelCreatePatientList: () => void;
}

interface IGraphqlProps {
  createPatientList: (
    options: { variables: patientListCreateMutationVariables },
  ) => { data: patientListCreateMutation };
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

interface IState {
  title: string;
  answerId: string;
  order: string;
  loading: boolean;
}

type Field = 'title' | 'answerId' | 'order';

export class PatientListCreate extends React.Component<allProps, IState> {
  state = {
    title: '',
    answerId: '',
    order: '',
    loading: false,
  };

  onChange = (field: Field): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({ [field as any]: e.currentTarget.value } as any);
    };
  };

  onSubmit = async () => {
    const { createPatientList, cancelCreatePatientList, openErrorPopup } = this.props;
    const { title, answerId, order, loading } = this.state;

    if (!loading) {
      try {
        this.setState({ loading: true });

        await createPatientList({
          variables: {
            title,
            answerId,
            order: Number(order),
          },
        });
        cancelCreatePatientList();
      } catch (err) {
        openErrorPopup(err.message);
      }
    }
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { cancelCreatePatientList } = this.props;
    const { title, answerId, order } = this.state;

    return (
      <div>
        <div className={styles.buttons}>
          <Button
            messageId="patientLists.close"
            icon="close"
            color="white"
            className={styles.button}
            onClick={cancelCreatePatientList}
          />
        </div>
        <div className={styles.fields}>
          <TextInput
            value={title}
            onChange={this.onChange('title')}
            placeholderMessageId="patientLists.title"
          />
          <TextInput
            value={answerId}
            onChange={this.onChange('answerId')}
            placeholderMessageId="patientLists.answerId"
          />
          <TextInput
            value={order}
            onChange={this.onChange('order')}
            placeholderMessageId="patientLists.order"
          />
        </div>
        <div className={styles.buttons}>
          <Button
            messageId="modalButtons.cancel"
            onClick={cancelCreatePatientList}
            color="white"
            small={true}
          />
          <Button messageId="patientLists.create" onClick={this.onSubmit} small />
        </div>
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql(createPatientListMutationGraphql as any, {
    name: 'createPatientList',
    options: {
      refetchQueries: ['getPatientLists'],
    },
  }),
)(PatientListCreate) as React.ComponentClass<IProps>;
