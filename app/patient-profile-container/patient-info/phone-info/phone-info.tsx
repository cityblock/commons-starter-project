import { concat, filter, findIndex, slice, values } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as phonesQuery from '../../../graphql/queries/get-patient-phones.graphql';
import * as phoneDeleteMutationGraphql from '../../../graphql/queries/phone-delete-for-patient-mutation.graphql';
import {
  getPatientPhonesQuery,
  phoneDeleteForPatientMutation,
  phoneDeleteForPatientMutationVariables,
} from '../../../graphql/types';
import Button from '../../../shared/library/button/button';
import DefaultText from '../../../shared/library/default-text/default-text';
import { ISavedPhone } from '../../../shared/phone-modal/phone-modal';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../../shared/with-error-handler/with-error-handler';
import DisplayCard from '../display-card';
import FlaggableDisplayField from '../flaggable-display-field';
import { IEditableFieldState } from '../patient-info';
import CreatePhoneModal from './create-phone-modal';
import * as styles from './css/phone-info.css';
import EditPhoneModal from './edit-phone-modal';

interface IProps extends IInjectedErrorProps {
  onChange: (field: IEditableFieldState) => void;
  patientId: string;
  patientInfoId: string;
  primaryPhone?: ISavedPhone | null;
  className?: string;
}

interface IGraphqlProps {
  phoneDeleteMutation: (
    options: { variables: phoneDeleteForPatientMutationVariables },
  ) => { data: phoneDeleteForPatientMutation };
  phones?: getPatientPhonesQuery['patientPhones'];
  loading?: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isEditModalVisible: boolean;
  isCreateModalVisible: boolean;
  isPrimary: boolean;
  currentPhone?: ISavedPhone | null;
  updatedPhones: ISavedPhone[] | null;
}

export class PhoneInfo extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isPrimary: false,
      updatedPhones: null,
    };
  }

  handlePhoneDelete = async (phoneId: string, isPrimary: boolean) => {
    const { phoneDeleteMutation, patientId, onChange, phones, openErrorPopup } = this.props;
    try {
      await phoneDeleteMutation({
        variables: {
          patientId,
          phoneId,
          isPrimary,
        },
      });

      const currentPhones = this.state.updatedPhones || phones || [];
      const updatedPhones = filter(currentPhones, phone => phone.id !== phoneId);
      this.setState({ updatedPhones });

      if (isPrimary) {
        onChange({ primaryPhone: null });
      }
    } catch (err) {
      openErrorPopup(err.message);
    }
  };

  handleAddPhoneClick = () => {
    this.setState({ isCreateModalVisible: true });
  };

  handleAddPrimaryPhoneClick = () => {
    this.setState({ isPrimary: true, isCreateModalVisible: true });
  };

  handleCloseModal = () => {
    this.setState({
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isPrimary: false,
    });
  };

  handleOpenEditModal = (phone: ISavedPhone) => {
    const { primaryPhone } = this.props;
    const isPrimary = !!(primaryPhone && primaryPhone.id === phone.id);

    this.setState({
      currentPhone: phone,
      isEditModalVisible: true,
      isPrimary,
    });
  };

  handleSaveSuccess = (savedPhone: ISavedPhone) => {
    const { phones } = this.props;
    const currentPhones = this.state.updatedPhones || phones || [];
    const index = findIndex(currentPhones, phone => phone.id === savedPhone.id);

    if (index < 0) {
      const updatedPhones = [...currentPhones, savedPhone];
      this.setState({ updatedPhones });
    }
  };

  handleEditSuccess = (savedPhone: ISavedPhone, isPrimaryUpdatedToTrue: boolean) => {
    const { onChange, phones } = this.props;
    const currentPhones = this.state.updatedPhones || phones || [];

    const index = findIndex(currentPhones, phone => phone.id === savedPhone.id);
    if (index > -1) {
      // insert updated phone into the correct position in the array of phones
      const updatedPhones = concat(
        slice(currentPhones, 0, index),
        savedPhone,
        slice(currentPhones, index + 1),
      );
      this.setState({ updatedPhones });
    }

    if (isPrimaryUpdatedToTrue) {
      onChange({ primaryPhone: savedPhone });
    }
  };

  handleSavePrimarySuccess = (savedPhone: ISavedPhone) => {
    this.handleSaveSuccess(savedPhone);

    const { onChange } = this.props;
    onChange({ primaryPhone: savedPhone });
  };

  renderPhoneDisplayCard(phone: ISavedPhone, isPrimary?: boolean) {
    const descriptionClassName = !phone.description ? styles.hiddenField : '';

    const isStarred = !!this.props.primaryPhone && this.props.primaryPhone.id === phone.id;
    const titleMessageId = isStarred ? 'phone.primaryPhone' : 'phone.additionalPhone';

    const typeComponent = phone.type ? (
      <FormattedMessage id={`phone.${phone.type}`}>
        {(message: string) => (
          <FlaggableDisplayField labelMessageId="phone.type" value={message || null} />
        )}
      </FormattedMessage>
    ) : (
      <FlaggableDisplayField
        labelMessageId="phone.type"
        value={null}
        className={styles.hiddenField}
      />
    );

    return (
      <DisplayCard
        onEditClick={() => this.handleOpenEditModal(phone)}
        onDeleteClick={async () => this.handlePhoneDelete(phone.id, isStarred)}
        key={`card-${phone.id}`}
        className={styles.fieldMargin}
        isStarred={isStarred}
        titleMessageId={titleMessageId}
      >
        <div className={styles.fieldRow}>
          <FlaggableDisplayField
            labelMessageId="phone.phoneNumber"
            value={phone.phoneNumber || null}
          />
          {typeComponent}
          <FlaggableDisplayField
            labelMessageId="phone.description"
            value={phone.description || null}
            className={descriptionClassName}
          />
        </div>
      </DisplayCard>
    );
  }

  renderPrimaryPhone() {
    const { primaryPhone } = this.props;

    const phoneComponent = primaryPhone ? (
      this.renderPhoneDisplayCard(primaryPhone)
    ) : (
      <div className={styles.emptyRequiredBlock} onClick={this.handleAddPrimaryPhoneClick}>
        <DefaultText messageId="phone.addPrimary" />
      </div>
    );

    return phoneComponent;
  }

  render() {
    const { phones, patientId, patientInfoId, primaryPhone, className } = this.props;
    const {
      isEditModalVisible,
      isCreateModalVisible,
      isPrimary,
      currentPhone,
      updatedPhones,
    } = this.state;

    const currentPhones = updatedPhones || phones;
    const nonPrimaryPhones = primaryPhone
      ? filter(currentPhones, phone => phone.id !== primaryPhone.id)
      : currentPhones;

    const phoneCards =
      nonPrimaryPhones && nonPrimaryPhones.length
        ? values(nonPrimaryPhones).map(phone => this.renderPhoneDisplayCard(phone))
        : null;

    const addPhoneButon = primaryPhone ? (
      <Button
        className={styles.phoneButton}
        onClick={this.handleAddPhoneClick}
        fullWidth={true}
        messageId="phone.addAdditional"
      />
    ) : null;

    const onSavedFn = isPrimary ? this.handleSavePrimarySuccess : this.handleSaveSuccess;

    return (
      <div className={className}>
        <CreatePhoneModal
          isVisible={isCreateModalVisible}
          isPrimary={isPrimary}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          onSaved={onSavedFn}
        />
        <EditPhoneModal
          isVisible={isEditModalVisible}
          isPrimary={isPrimary}
          closePopup={this.handleCloseModal}
          patientId={patientId}
          patientInfoId={patientInfoId}
          onSaved={this.handleEditSuccess}
          phone={currentPhone}
        />
        <FormattedMessage id="phone.phoneNumbers">
          {(message: string) => <h3 className={styles.phoneTitle}>{message}</h3>}
        </FormattedMessage>
        {this.renderPrimaryPhone()}
        {phoneCards}
        {addPhoneButon}
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql<IGraphqlProps, IProps, allProps>(phoneDeleteMutationGraphql as any, {
    name: 'phoneDeleteMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(phonesQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      phones: data ? (data as any).patientPhones : null,
    }),
  }),
)(PhoneInfo);
