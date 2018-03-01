import { concat, findIndex, slice, values } from 'lodash-es';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ISavedEmail } from '../../../shared/email-modal/email-modal';
import Button from '../../../shared/library/button/button';
import Checkbox from '../../../shared/library/checkbox/checkbox';
import DefaultText from '../../../shared/library/default-text/default-text';
import DisplayCard from '../display-card';
import FlaggableDisplayField from '../flaggable-display-field';
import { IEditableFieldState } from '../patient-info';
import CreateEmailModal from './create-email-modal';
import * as styles from './css/email-info.css';
import EditEmailModal from './edit-email-modal';

interface IProps {
  onChange: (field: IEditableFieldState) => void;
  patientId: string;
  patientInfoId: string;
  hasEmail?: boolean | null;
  primaryEmail?: ISavedEmail | null;
  emails?: ISavedEmail[];
  className?: string;
}

interface IState {
  isEditModalVisible: boolean;
  isCreateModalVisible: boolean;
  isPrimary: boolean;
  currentEmail?: ISavedEmail | null;
}

export default class EmailInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isPrimary: false,
    };
  }

  handleEmailDelete(emailId: string) {
    // TODO: implement email delete
  }

  handleAddEmailClick = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleAddPrimaryEmailClick = () => {
    this.setState({ isPrimary: true, isCreateModalVisible: true });
  };

  handleCloseModal = () => {
    this.setState({
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isPrimary: false,
    });
  };

  handleOpenEditModal = (email: ISavedEmail) => {
    const { primaryEmail } = this.props;
    const isPrimary = !!(primaryEmail && primaryEmail.id === email.id);

    this.setState({
      currentEmail: email,
      isEditModalVisible: true,
      isPrimary,
    });
  };

  handleSaveSuccess = (savedEmail: ISavedEmail) => {
    const { onChange } = this.props;
    const emails = this.props.emails || [];
    const index = findIndex(emails, email => email.id === savedEmail.id);

    if (index < 0) {
      const updatedEmails = [...emails, savedEmail];
      onChange({ emails: updatedEmails });
    }
  };

  handleEditSuccess = (savedEmail: ISavedEmail) => {
    const { onChange, primaryEmail } = this.props;

    if (primaryEmail && savedEmail.id === primaryEmail.id) {
      onChange({ primaryEmail: savedEmail });
      return;
    }

    const emails = this.props.emails || [];
    const index = findIndex(emails, email => email.id === savedEmail.id);

    if (index > -1) {
      // insert updated email into the correct position in the array of emails
      const updatedEmails = concat(slice(emails, 0, index), savedEmail, slice(emails, index + 1));
      onChange({ emails: updatedEmails });
    }
  };

  handleSavePrimarySuccess = (savedEmail: ISavedEmail) => {
    const { onChange } = this.props;
    onChange({ primaryEmail: savedEmail });
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, checked } = event.target;
    onChange({ [name]: !checked });
  };

  renderEmailDisplayCard(email: ISavedEmail, isPrimary?: boolean) {
    const description = email.description ? (
      <FlaggableDisplayField labelMessageId="email.description" value={email.description} />
    ) : null;

    const isStarred = !!this.props.primaryEmail && this.props.primaryEmail.id === email.id;
    const titleMessageId = isStarred ? 'email.primaryEmail' : 'email.additionalEmail';

    return (
      <DisplayCard
        onEditClick={() => this.handleOpenEditModal(email)}
        onDeleteClick={() => this.handleEmailDelete(email.id)}
        key={`card-${email.id}`}
        className={styles.fieldMargin}
        isStarred={isStarred}
        titleMessageId={titleMessageId}
      >
        <div className={styles.fieldRow}>
          <FlaggableDisplayField
            labelMessageId="email.emailAddress"
            value={email.emailAddress || null}
          />
          {description}
        </div>
      </DisplayCard>
    );
  }

  renderPrimaryEmail() {
    const { primaryEmail, hasEmail } = this.props;

    const emptyComponent =
      hasEmail !== false ? (
        <div className={styles.emptyRequiredBlock} onClick={this.handleAddPrimaryEmailClick}>
          <DefaultText messageId="email.addPrimary" />
        </div>
      ) : null;

    const emailComponent = primaryEmail
      ? this.renderEmailDisplayCard(primaryEmail)
      : emptyComponent;

    return emailComponent;
  }

  render() {
    const { emails, patientId, patientInfoId, primaryEmail, hasEmail, className } = this.props;
    const { isEditModalVisible, isCreateModalVisible, isPrimary, currentEmail } = this.state;

    const emailCards =
      emails && emails.length
        ? values(emails).map(email => this.renderEmailDisplayCard(email))
        : null;

    const addEmailButon = primaryEmail ? (
      <Button
        className={styles.emailButton}
        onClick={this.handleAddEmailClick}
        fullWidth={true}
        messageId="email.addAdditional"
      />
    ) : null;

    const onSavedFn = isPrimary ? this.handleSavePrimarySuccess : this.handleSaveSuccess;

    return (
      <div className={className}>
        <CreateEmailModal
          isVisible={isCreateModalVisible}
          isPrimary={isPrimary}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          onSaved={onSavedFn}
        />
        <EditEmailModal
          isVisible={isEditModalVisible}
          isPrimary={isPrimary}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          patientInfoId={patientInfoId}
          onSaved={this.handleEditSuccess}
          email={currentEmail}
        />
        <FormattedMessage id="email.emailAddresses">
          {(message: string) => <h3 className={styles.emailTitle}>{message}</h3>}
        </FormattedMessage>
        <Checkbox
          name="hasEmail"
          isChecked={hasEmail === false}
          labelMessageId="email.hasEmail"
          onChange={this.handleChange}
          className={styles.fieldMargin}
        />
        {this.renderPrimaryEmail()}
        {emailCards}
        {addEmailButon}
      </div>
    );
  }
}
