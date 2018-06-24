import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullAddress, FullUser } from '../../graphql/types';
import DateInput from '../library/date-input/date-input';
import FormLabel from '../library/form-label/form-label';
import styles from '../library/form/css/form.css';
import TextInput from '../library/text-input/text-input';
import TextArea from '../library/textarea/textarea';
import AllCareWorkerMultiSelect from '../user-multi-select/all-care-worker-multi-select';
import ExternalCareTeamMultiSelect from '../user-multi-select/external-care-team-multi-select';
import { getUserInfo } from '../user-multi-select/get-info-helpers';
import InternalCareTeamMultiSelect from '../user-multi-select/internal-care-team-multi-select';
import { IUser } from '../user-multi-select/user-multi-select';
import AddressSelect from './address-select';

interface IProps {
  patientId?: string;
  currentUser?: FullUser | null;
  onChange: (values: { [key: string]: any }) => void;
  appointmentDate: string | null;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
  description?: string | null;
  internalGuests: IUser[];
  externalGuests: IUser[];
  location?: string | null;
  selectedAddress?: FullAddress | { description: 'External location' } | null;
  isSaving?: boolean;
  error?: string | null;
}

export class AppointmentForm extends React.Component<IProps> {
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { onChange } = this.props;
    const { name, value } = event.target;
    onChange({ [name as any]: value });
  };

  handleChange = (value: any, name?: string) => {
    const { onChange } = this.props;
    onChange({ [name as any]: value });
  };

  render() {
    const {
      title,
      description,
      appointmentDate,
      startTime,
      endTime,
      internalGuests,
      externalGuests,
      location,
      patientId,
      currentUser,
      onChange,
      selectedAddress,
    } = this.props;
    const addSelfLink =
      currentUser && !internalGuests.find(guest => guest.id === currentUser.id) ? (
        <a
          onClick={() =>
            onChange({ internalGuests: [...internalGuests, getUserInfo(currentUser)] })
          }
          className={styles.link}
        >
          <FormattedMessage id="appointmentModal.addYourself" />
        </a>
      ) : null;

    const externalSelect = patientId ? (
      <div className={styles.field}>
        <FormLabel messageId="appointmentModal.externalGuest" />
        <ExternalCareTeamMultiSelect
          patientId={patientId}
          onChange={this.handleChange}
          selectedUsers={externalGuests}
          name="externalGuests"
          placeholderMessageId="appointmentModal.externalGuestPlaceholder"
        />
      </div>
    ) : null;

    const cityblockUserSelect = patientId ? (
      <div className={styles.field}>
        <FormLabel messageId="appointmentModal.guest" className={styles.required} />
        <InternalCareTeamMultiSelect
          patientId={patientId}
          onChange={this.handleChange}
          selectedUsers={internalGuests}
          name="internalGuests"
          placeholderMessageId="appointmentModal.guestPlaceholder"
        />
        {addSelfLink}
      </div>
    ) : (
      <div className={styles.field}>
        <FormLabel messageId="appointmentModal.guest" />
        <AllCareWorkerMultiSelect
          onChange={this.handleChange}
          selectedUsers={internalGuests}
          name="internalGuests"
          placeholderMessageId="appointmentModal.guestPlaceholder"
        />
      </div>
    );

    return (
      <React.Fragment>
        <div className={styles.field}>
          <FormLabel messageId="appointmentModal.appointmentTitle" className={styles.required} />
          <TextInput
            name="title"
            value={title || ''}
            onChange={this.handleInputChange}
            placeholderMessageId="appointmentModal.appointmentTitlePlaceholder"
          />
        </div>

        {cityblockUserSelect}
        {externalSelect}

        <FormLabel messageId="appointmentModal.location" className={styles.required} />
        <AddressSelect
          patientId={patientId}
          onChange={onChange}
          placeholderMessageId="appointmentModal.locationPlaceholder"
          selectedAddress={selectedAddress}
          location={location}
        />

        <div className={styles.field}>
          <FormLabel messageId="appointmentModal.description" className={styles.required} />
          <TextArea
            name="description"
            value={description || ''}
            onChange={this.handleInputChange}
            placeholderMessageId="appointmentModal.descriptionPlaceholder"
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="appointmentModal.date" className={styles.required} />
          <DateInput value={appointmentDate} onChange={this.handleChange} name="appointmentDate" />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="appointmentModal.startTime" className={styles.required} />
            <TextInput
              onChange={this.handleInputChange}
              value={startTime || ''}
              inputType="time"
              name="startTime"
              required
            />
          </div>
          <div className={styles.field}>
            <FormLabel messageId="appointmentModal.endTime" className={styles.required} />
            <TextInput
              onChange={this.handleInputChange}
              value={endTime || ''}
              inputType="time"
              name="endTime"
              required
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AppointmentForm;
