import * as React from 'react';
import DateInput from '../../shared/library/date-input/date-input';
import FormLabel from '../../shared/library/form-label/form-label';
import ModalButtons from '../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../shared/library/modal-header/modal-header';
import { Popup } from '../../shared/popup/popup';
import * as styles from './css/create-patient-form-modal.css';

interface IProps {
  onSubmit: (formId: string, startedAt: string) => void;
  onCancel: () => void;
  isVisible: boolean;
  formId: string | null;
  formTitle: string | null;
}

interface IState {
  signedAt: string | null;
}

export class CreatePatientFormModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      signedAt: new Date().toISOString(),
    };
  }

  clearState() {
    this.setState({ signedAt: new Date().toISOString() });
  }

  onSubmit = () => {
    const { signedAt } = this.state;
    const { formId, onSubmit } = this.props;

    if (signedAt && formId) {
      this.clearState();
      onSubmit(formId, signedAt);
    }
  };

  onCancel = () => {
    this.clearState();
    this.props.onCancel();
  };

  onChange = (signedAt: string | null) => {
    this.setState({ signedAt });
  };

  renderBody() {
    const { signedAt } = this.state;
    const { formTitle } = this.props;
    const labelText = `Date ${formTitle} was signed:`;

    return (
      <div>
        <div className={styles.field}>
          <FormLabel text={labelText} />
          <DateInput value={signedAt || new Date().toISOString()} onChange={this.onChange} />
        </div>
      </div>
    );
  }

  render() {
    const { isVisible, formTitle } = this.props;

    return (
      <Popup visible={isVisible} closePopup={this.onCancel} style="no-padding">
        <ModalHeader
          titleText={formTitle}
          bodyText={`Please specify when the ${formTitle} was signed by the member.`}
          closePopup={this.onCancel}
        />
        <div className={styles.modalBody}>
          {this.renderBody()}
          <ModalButtons
            cancelMessageId="patientDocuments.cancel"
            submitMessageId="patientDocuments.save"
            cancel={this.onCancel}
            submit={this.onSubmit}
          />
        </div>
      </Popup>
    );
  }
}

export default CreatePatientFormModal;
