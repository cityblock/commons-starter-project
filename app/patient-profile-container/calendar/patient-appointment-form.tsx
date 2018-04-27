import * as React from 'react';
import { FullAddressFragment } from '../../graphql/types';
import { IUser } from '../../shared/care-team-multi-select/care-team-multi-select';
import ExternalCareTeamMultiSelect from '../../shared/care-team-multi-select/external-care-team-multi-select';
import InternalCareTeamMultiSelect, {
  getUserInfo,
} from '../../shared/care-team-multi-select/internal-care-team-multi-select';
import DateInput from '../../shared/library/date-input/date-input';
import FormLabel from '../../shared/library/form-label/form-label';
import * as styles from '../../shared/library/form/css/form.css';
import TextInput from '../../shared/library/text-input/text-input';
import TextArea from '../../shared/library/textarea/textarea';
import withCurrentUser, { IInjectedProps } from '../../shared/with-current-user/with-current-user';
import PatientAddressSelect from './patient-address-select';

interface IProps extends IInjectedProps {
  patientId: string;
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

export class PatientAppointmentForm extends React.Component<IProps> {
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
    const addSelfLink = currentUser ? (
      <a
        onClick={() =>
          this.handleChange({ internalGuests: [...internalGuests, getUserInfo(currentUser)] })
        }
      />
    ) : null;

    return (
      <React.Fragment>
        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.appointmentTitle" />
          <TextInput
            name="title"
            value={title || ''}
            onChange={this.handleInputChange}
            placeholderMessageId="patientAppointmentModal.appointmentTitlePlaceholder"
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.guest" />
          <InternalCareTeamMultiSelect
            patientId={patientId}
            onChange={this.handleChange}
            selectedUsers={internalGuests}
            name="internalGuests"
            placeholderMessageId="patientAppointmentModal.guestPlaceholder"
          />
          {addSelfLink}
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.externalGuest" />
          <ExternalCareTeamMultiSelect
            patientId={patientId}
            onChange={this.handleChange}
            selectedUsers={externalGuests}
            name="externalGuests"
            placeholderMessageId="patientAppointmentModal.externalGuestPlaceholder"
          />
        </div>

        <FormLabel messageId="patientAppointmentModal.location" />
        <PatientAddressSelect
          patientId={patientId}
          onChange={onChange}
          placeholderMessageId="patientAppointmentModal.locationPlaceholder"
          selectedAddress={selectedAddress}
          location={location}
        />

        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.description" />
          <TextArea
            name="description"
            value={description || ''}
            onChange={this.handleInputChange}
            placeholderMessageId="patientAppointmentModal.descriptionPlaceholder"
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientAppointmentModal.date" />
          <DateInput value={appointmentDate} onChange={this.handleChange} name="appointmentDate" />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <FormLabel messageId="patientAppointmentModal.startTime" />
            <TextInput
              onChange={this.handleInputChange}
              value={startTime || ''}
              inputType="time"
              name="startTime"
              required
            />
          </div>
          <div className={styles.field}>
            <FormLabel messageId="patientAppointmentModal.endTime" />
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

export default withCurrentUser()(PatientAppointmentForm);
