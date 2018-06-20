import React from 'react';
import { graphql } from 'react-apollo';
import patientListEditGraphql from '../../graphql/queries/patient-list-edit-mutation.graphql';
import { patientListEdit, patientListEditVariables, FullPatientList } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import EditableMultilineText from '../../shared/library/editable-multiline-text/editable-multiline-text';
import styles from './css/patient-list-shared.css';

interface IProps {
  patientList: FullPatientList;
  close: () => void;
  deletePatientList: () => void;
}

interface IGraphqlProps {
  editPatientList: (options: { variables: patientListEditVariables }) => { data: patientListEdit };
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

export default graphql<any>(patientListEditGraphql, {
  name: 'editPatientList',
})(PatientListEdit) as React.ComponentClass<IProps>;
