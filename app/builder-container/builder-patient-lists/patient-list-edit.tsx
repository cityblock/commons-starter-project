import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientListEditMutationGraphql from '../../graphql/queries/patient-list-edit-mutation.graphql';
import {
  patientListEditMutation,
  patientListEditMutationVariables,
  FullPatientListFragment,
} from '../../graphql/types';
import Button from '../../shared/library/button/button';
import EditableMultilineText from '../../shared/library/editable-multiline-text/editable-multiline-text';
import * as styles from './css/patient-list-shared.css';

interface IProps {
  patientList: FullPatientListFragment;
  close: () => void;
  deletePatientList: () => void;
}

interface IGraphqlProps {
  editPatientList: (
    options: { variables: patientListEditMutationVariables },
  ) => { data: patientListEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class PatientListEdit extends React.Component<allProps, {}> {
  onSubmit(field: string) {
    const { patientList, editPatientList } = this.props;

    return async (newText: string) => {
      await editPatientList({
        variables: {
          patientListId: patientList.id,
          [field]: newText,
        },
      });
    };
  }

  render(): JSX.Element {
    const { patientList, close, deletePatientList } = this.props;

    return (
      <div>
        <div className={styles.buttons}>
          <Button
            messageId="patientLists.close"
            icon="close"
            color="white"
            className={styles.button}
            onClick={close}
          />
          <Button
            messageId="patientLists.delete"
            icon="delete"
            color="white"
            className={styles.button}
            onClick={deletePatientList}
          />
        </div>
        <div className={styles.fields}>
          <h4>Title:</h4>
          <EditableMultilineText text={patientList.title} onSubmit={this.onSubmit('title')} />
          <h4>Answer Id:</h4>
          <EditableMultilineText text={patientList.answerId} onSubmit={this.onSubmit('answerId')} />
          <h4>Order:</h4>
          <EditableMultilineText text={`${patientList.order}`} onSubmit={this.onSubmit('order')} />
        </div>
      </div>
    );
  }
}

export default graphql<any>(patientListEditMutationGraphql as any, {
  name: 'editPatientList',
})(PatientListEdit) as React.ComponentClass<IProps>;
