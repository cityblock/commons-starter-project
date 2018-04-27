import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullAddressFragment, FullUserFragment } from '../../graphql/types';
import DateInput from '../../shared/library/date-input/date-input';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from '../../shared/library/form/css/form.css';
import TextInput from '../../shared/library/text-input/text-input';
import TextArea from '../../shared/library/textarea/textarea';
import AllCareWorkerMultiSelect from '../../shared/user-multi-select/all-care-worker-multi-select';
import ExternalCareTeamMultiSelect from '../../shared/user-multi-select/external-care-team-multi-select';
import { getUserInfo } from '../../shared/user-multi-select/get-info-helpers';
import InternalCareTeamMultiSelect from '../../shared/user-multi-select/internal-care-team-multi-select';
import { IUser } from '../../shared/user-multi-select/user-multi-select';
import AddressSelect from './address-select';

interface IProps {
  patientId?: string;
  currentUser?: FullUserFragment | null;
  onChange: (values: { [key: string]: any }) => void;
  appointmentDate: string | null;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
  description?: string | null;
  internalGuests: IUser[];
  externalGuests: IUser[];
  location?: string | null;
  selectedAddress?: FullAddressFragment | { description: 'External location' } | null;
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
      <React.Fragment>
        <InternalCareTeamMultiSelect
          patientId={patientId}
          onChange={this.handleChange}
          selectedUsers={internalGuests}
          name="internalGuests"
          placeholderMessageId="appointmentModal.guestPlaceholder"
        />
        {addSelfLink}
      </React.Fragment>
    ) : (
      <AllCareWorkerMultiSelect
        onChange={this.handleChange}
        selectedUsers={internalGuests}
        name="internalGuests"
        placeholderMessageId="appointmentModal.guestPlaceholder"
      />
    );

    return (
      <React.Fragment>
        <div className={styles.field}>
          <FormLabel messageId="appointmentModal.appointmentTitle" />
          <TextInput
            name="title"
            value={title || ''}
            onChange={this.handleInputChange}
            placeholderMessageId="appointmentModal.appointmentTitlePlaceholder"
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="appointmentModal.guest" />
          {cityblockUserSelect}
        </div>

        {externalSelect}

        <FormLabel messageId="appointmentModal.location" />
        <AddressSelect
          patientId={patientId}
          onChange={onChange}
          placeholderMessageId="appointmentModal.locationPlaceholder"
          selectedAddress={selectedAddress}
          location={location}
        />

        <div className={styles.field}>
          <FormLabel messageId="appointmentModal.description" />
          <TextArea
            name="description"
            value={description || ''}
            onChange={this.handleInputChange}
            placeholderMessageId="appointmentModal.descriptionPlaceholder"
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="appointmentModal.date" />
          <DateInput value={appointmentDate} onChange={this.handleChange} name="appointmentDate" />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="appointmentModal.startTime" />
            <TextInput
              onChange={this.handleInputChange}
              value={startTime || ''}
              inputType="time"
              name="startTime"
              required
            />
          </div>
          <div className={styles.field}>
            <FormLabel messageId="appointmentModal.endTime" />
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
