import { values } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientFlagCreateMutationGraphql from '../../graphql/queries/patient-data-flag-create-mutation.graphql';
import {
  patientDataFlagCreateMutation,
  patientDataFlagCreateMutationVariables,
  CoreIdentityOptions,
} from '../../graphql/types';
import FormLabel from '../../shared/library/form-label/form-label';
import ModalButtons from '../../shared/library/modal-buttons/modal-buttons';
import ModalError from '../../shared/library/modal-error/modal-error';
import ModalHeader from '../../shared/library/modal-header/modal-header';
import Select from '../../shared/library/select/select';
import TextInput from '../../shared/library/text-input/text-input';
import { Popup } from '../../shared/popup/popup';
import * as styles from './css/flagging-modal.css';

interface IProps {
  closePopup: () => void;
  onSaved: (flag: patientDataFlagCreateMutation['patientDataFlagCreate']) => void;
  isVisible: boolean;
  patientId: string;
}

interface ICreateFlagOptions {
  variables: patientDataFlagCreateMutationVariables;
}

interface IGraphqlProps {
  createFlag: (options: ICreateFlagOptions) => { data: patientDataFlagCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  fieldName: CoreIdentityOptions | null;
  suggestedValue: string;
  notes: string;
  saveError?: string | null;
}

export class FlaggingModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      fieldName: null,
      suggestedValue: '',
      notes: '',
    };
  }

  clearState() {
    this.setState({
      fieldName: null,
      suggestedValue: '',
      notes: '',
    });
  }

  handleClose = () => {
    this.clearState();
    this.props.closePopup();
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState({ [name as any]: value });
  };

  handleSubmit = async () => {
    const { createFlag, patientId, onSaved } = this.props;
    const { fieldName, suggestedValue, notes } = this.state;

    if (!fieldName) {
      this.setState({ saveError: 'You must select a field name' });
      return;
    } else if (!suggestedValue) {
      this.setState({ saveError: 'You must provide a suggested correction' });
      return;
    }

    try {
      const response = await createFlag({
        variables: {
          patientId,
          fieldName,
          suggestedValue,
          notes,
        },
      });

      onSaved(response.data.patientDataFlagCreate);
      this.handleClose();
    } catch (err) {
      // TODO: do something with this error
      this.setState({ saveError: err.message });
    }
  };

  renderBody() {
    const { fieldName, suggestedValue, notes } = this.state;

    return (
      <div>
        <div className={styles.field}>
          <FormLabel messageId="flaggingModal.fieldName" />
          <Select
            name="fieldName"
            prefix="coreIdentity"
            hasPlaceholder={true}
            options={values(CoreIdentityOptions)}
            value={fieldName || ''}
            onChange={this.handleChange}
            large={true}
          />
        </div>
        <div className={styles.field}>
          <FormLabel messageId="flaggingModal.correctValue" />
          <TextInput name="suggestedValue" value={suggestedValue} onChange={this.handleChange} />
        </div>
        <div className={styles.field}>
          <FormLabel messageId="flaggingModal.notes" />
          <TextInput
            name="notes"
            value={notes}
            onChange={this.handleChange}
            placeholderMessageId="flaggingModal.notesPlaceholder"
          />
        </div>
      </div>
    );
  }

  render() {
    const { isVisible } = this.props;
    const { saveError } = this.state;

    const errorComponent = saveError ? <ModalError error={saveError} /> : null;

    return (
      <Popup visible={isVisible} closePopup={this.handleClose} style="no-padding">
        <ModalHeader
          titleMessageId="flaggingModal.title"
          bodyMessageId="flaggingModal.description"
          closePopup={this.handleClose}
        />
        {errorComponent}
        <div className={styles.modalBody}>
          {this.renderBody()}
          <ModalButtons
            cancelMessageId="flaggingModal.cancel"
            submitMessageId="flaggingModal.submit"
            cancel={this.handleClose}
            submit={this.handleSubmit}
          />
        </div>
      </Popup>
    );
  }
}

export default graphql<any>(patientFlagCreateMutationGraphql as any, {
  name: 'createFlag',
  options: {
    refetchQueries: ['getPatientComputedPatientStatus'],
  },
})(FlaggingModal) as React.ComponentClass<IProps>;
