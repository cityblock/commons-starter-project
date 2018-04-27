import { format } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import { getFamilyMemberInfo } from '../../../shared/care-team-multi-select/external-care-team-multi-select';
import { getUserInfo } from '../../../shared/care-team-multi-select/internal-care-team-multi-select';
import Modal from '../../../shared/library/modal/modal';
import { healthcareProxy, user } from '../../../shared/util/test-data';
import PatientAppointmentForm from '../patient-appointment-form';
import { PatientAppointmentModal } from '../patient-appointment-modal';

describe('Render Patient Appointment Modal', () => {
  const closePopup = () => true;
  const getCalendarEventUrl = jest.fn();
  const patientId = '123';

  const wrapper = shallow(
    <PatientAppointmentModal
      closePopup={closePopup}
      isVisible={false}
      patientId={patientId}
      getCalendarEventUrl={getCalendarEventUrl}
    />,
  );

  it('renders appointment modal popup', () => {
    expect(wrapper.find(Modal).length).toBe(1);
    expect(wrapper.find(Modal).props().isVisible).toBeFalsy();
    expect(wrapper.find(Modal).props().onClose).not.toBe(closePopup);
    expect(wrapper.find(Modal).props().cancelMessageId).toBe('patientAppointmentModal.cancel');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('patientAppointmentModal.submit');
    expect(wrapper.find(Modal).props().titleMessageId).toBe('patientAppointmentModal.title');
  });

  it('renders appointment modal form empty', () => {
    expect(wrapper.find(PatientAppointmentForm).length).toBe(1);

    const formProps = wrapper.find(PatientAppointmentForm).props();
    expect(formProps.patientId).toBe(patientId);
    expect(formProps.onChange).not.toBe(closePopup);
    expect(formProps.appointmentDate).toBe(format(new Date(), 'YYYY-MM-DD'));
    expect(formProps.startTime).toBeFalsy();
    expect(formProps.endTime).toBeFalsy();
    expect(formProps.title).toBeFalsy();
    expect(formProps.description).toBeFalsy();
    expect(formProps.internalGuests).toMatchObject([]);
    expect(formProps.externalGuests).toMatchObject([]);
    expect(formProps.location).toBeFalsy();
    expect(formProps.selectedAddress).toBeFalsy();
  });

  it('renders address modal form with partial info', () => {
    wrapper.setState({
      appointmentDate: '2018-12-20',
      startTime: '13:30:00',
      endTime: '15:00:00',
      title: 'Some event',
      description: 'reason',
      internalGuests: getUserInfo(user),
      externalGuests: getFamilyMemberInfo(healthcareProxy),
      location: '123 Sesame St',
      selectedAddress: { description: 'External location' },
    });

    const formProps = wrapper.find(PatientAppointmentForm).props();
    expect(formProps.appointmentDate).toBe('2018-12-20');
    expect(formProps.startTime).toBe('13:30:00');
    expect(formProps.endTime).toBe('15:00:00');
    expect(formProps.title).toBe('Some event');
    expect(formProps.description).toBe('reason');
    expect(formProps.internalGuests).toMatchObject(getUserInfo(user));
    expect(formProps.externalGuests).toMatchObject(getFamilyMemberInfo(healthcareProxy));
    expect(formProps.location).toBe('123 Sesame St');
    expect(formProps.selectedAddress).toMatchObject({ description: 'External location' });
  });
});
