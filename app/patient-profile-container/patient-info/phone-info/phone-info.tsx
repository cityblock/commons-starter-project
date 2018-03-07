import { concat, findIndex, slice, values } from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../shared/library/button/button';
import DefaultText from '../../../shared/library/default-text/default-text';
import { ISavedPhone } from '../../../shared/phone-modal/phone-modal';
import DisplayCard from '../display-card';
import FlaggableDisplayField from '../flaggable-display-field';
import { IEditableFieldState } from '../patient-info';
import CreatePhoneModal from './create-phone-modal';
import * as styles from './css/phone-info.css';
import EditPhoneModal from './edit-phone-modal';

interface IProps {
  onChange: (field: IEditableFieldState) => void;
  patientId: string;
  patientInfoId: string;
  primaryPhone?: ISavedPhone | null;
  phones?: ISavedPhone[];
  className?: string;
}

interface IState {
  isEditModalVisible: boolean;
  isCreateModalVisible: boolean;
  isPrimary: boolean;
  currentPhone?: ISavedPhone | null;
}

export default class PhoneInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isEditModalVisible: false,
      isCreateModalVisible: false,
      isPrimary: false,
    };
  }

  handlePhoneDelete(phoneId: string) {
    // TODO: implement phone delete
  }

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
    const { onChange } = this.props;
    const phones = this.props.phones || [];
    const index = findIndex(phones, phone => phone.id === savedPhone.id);

    if (index < 0) {
      const updatedPhones = [...phones, savedPhone];
      onChange({ phones: updatedPhones });
    }
  };

  handleEditSuccess = (savedPhone: ISavedPhone) => {
    const { onChange, primaryPhone } = this.props;

    if (primaryPhone && savedPhone.id === primaryPhone.id) {
      onChange({ primaryPhone: savedPhone });
      return;
    }

    const phones = this.props.phones || [];
    const index = findIndex(phones, phone => phone.id === savedPhone.id);

    if (index > -1) {
      const updatedPhones = concat(slice(phones, 0, index), savedPhone, slice(phones, index + 1));
      onChange({ phones: updatedPhones });
    }
  };

  handleSavePrimarySuccess = (savedPhone: ISavedPhone) => {
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
        onDeleteClick={() => this.handlePhoneDelete(phone.id)}
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
    const { isEditModalVisible, isCreateModalVisible, isPrimary, currentPhone } = this.state;

    const phoneCards =
      phones && phones.length
        ? values(phones).map(phone => this.renderPhoneDisplayCard(phone))
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
