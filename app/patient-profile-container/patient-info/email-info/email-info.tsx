import { concat, filter, findIndex, slice, values } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as emailDeleteMutationGraphql from '../../../graphql/queries/email-delete-for-patient-mutation.graphql';
import * as emailsQuery from '../../../graphql/queries/get-patient-emails.graphql';
import {
  emailDeleteForPatientMutation,
  emailDeleteForPatientMutationVariables,
  getPatientEmailsQuery,
} from '../../../graphql/types';
import { ISavedEmail } from '../../../shared/email-modal/email-modal';
import Button from '../../../shared/library/button/button';
import Checkbox from '../../../shared/library/checkbox/checkbox';
import DefaultText from '../../../shared/library/default-text/default-text';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../../shared/with-error-handler/with-error-handler';
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
  className?: string;
}

interface IGraphqlProps {
  emailDeleteMutation: (
    options: { variables: emailDeleteForPatientMutationVariables },
  ) => { data: emailDeleteForPatientMutation };
  emails?: getPatientEmailsQuery['patientEmails'];
  loading?: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

interface IState {
  isEditModalVisible: boolean;
  isCreateModalVisible: boolean;
  isPrimary: boolean;
  currentEmail?: ISavedEmail | null;
  updatedEmails: ISavedEmail[] | null;
}

export class EmailInfo extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isPrimary: false,
      updatedEmails: null,
    };
  }

  handleEmailDelete = async (emailId: string, isPrimary: boolean) => {
    const { emailDeleteMutation, patientId, onChange, emails, openErrorPopup } = this.props;
    try {
      await emailDeleteMutation({
        variables: {
          patientId,
          emailId,
          isPrimary,
        },
      });

      const currentEmails = this.state.updatedEmails || emails || [];
      const updatedEmails = filter(currentEmails, email => email.id !== emailId);
      this.setState({ updatedEmails });

      if (isPrimary) {
        onChange({ primaryEmail: null });
      }
    } catch (err) {
      openErrorPopup(err.message);
    }
  };

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
    const { emails } = this.props;
    const currentEmails = this.state.updatedEmails || emails || [];
    const index = findIndex(currentEmails, email => email.id === savedEmail.id);

    if (index < 0) {
      const updatedEmails = [...currentEmails, savedEmail];
      this.setState({ updatedEmails });
    }
  };

  handleEditSuccess = (savedEmail: ISavedEmail, isPrimaryUpdatedToTrue: boolean) => {
    const { onChange, emails } = this.props;
    const currentEmails = this.state.updatedEmails || emails || [];

    const index = findIndex(currentEmails, email => email.id === savedEmail.id);
    if (index > -1) {
      // insert updated email into the correct position in the array of emails
      const updatedEmails = concat(
        slice(currentEmails, 0, index),
        savedEmail,
        slice(currentEmails, index + 1),
      );
      this.setState({ updatedEmails });
    }

    if (isPrimaryUpdatedToTrue) {
      onChange({ primaryEmail: savedEmail });
    }
  };

  handleSavePrimarySuccess = (savedEmail: ISavedEmail) => {
    this.handleSaveSuccess(savedEmail);

    const { onChange } = this.props;
    onChange({ primaryEmail: savedEmail });
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { name, checked } = event.target;
    onChange({ [name]: !checked });
  };

  renderEmailDisplayCard(email: ISavedEmail) {
    const description = email.description ? (
      <FlaggableDisplayField labelMessageId="email.description" value={email.description} />
    ) : null;

    const isStarred = !!this.props.primaryEmail && this.props.primaryEmail.id === email.id;
    const titleMessageId = isStarred ? 'email.primaryEmail' : 'email.additionalEmail';

    return (
      <DisplayCard
        onEditClick={() => this.handleOpenEditModal(email)}
        onDeleteClick={async () => this.handleEmailDelete(email.id, isStarred)}
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
    const {
      isEditModalVisible,
      isCreateModalVisible,
      isPrimary,
      currentEmail,
      updatedEmails,
    } = this.state;

    const currentEmails = updatedEmails || emails;
    const nonPrimaryEmails = primaryEmail
      ? filter(currentEmails, email => email.id !== primaryEmail.id)
      : currentEmails;

    const emailCards =
      nonPrimaryEmails && nonPrimaryEmails.length
        ? values(nonPrimaryEmails).map(email => this.renderEmailDisplayCard(email))
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

export default compose(
  withErrorHandler(),
  graphql(emailDeleteMutationGraphql as any, {
    name: 'emailDeleteMutation',
  }),
  graphql(emailsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      emails: data ? (data as any).patientEmails : null,
    }),
  }),
)(EmailInfo) as React.ComponentClass<IProps>;
