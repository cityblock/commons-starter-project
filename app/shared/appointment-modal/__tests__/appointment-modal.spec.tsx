import { format } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import Modal from '../../../shared/library/modal/modal';
import {
  getFamilyMemberInfo,
  getUserInfo,
} from '../../../shared/user-multi-select/get-info-helpers';
import { currentUser, featureFlags, healthcareProxy, user } from '../../../shared/util/test-data';
import AppointmentForm from '../appointment-form';
import { AppointmentModal } from '../appointment-modal';

describe('Render Patient Appointment Modal', () => {
  const closePopup = () => true;
  const getCalendarEventUrl = jest.fn();
  const patientId = '123';

  const wrapper = shallow(
    <AppointmentModal
      closePopup={closePopup}
      onSubmit={closePopup}
      currentUser={currentUser}
      featureFlags={featureFlags}
      isVisible={false}
      patientId={patientId}
      getCalendarEventUrlForPatient={getCalendarEventUrl}
      getCalendarEventUrlForUser={getCalendarEventUrl}
    />,
  );

  it('renders appointment modal popup', () => {
    expect(wrapper.find(Modal).length).toBe(1);
    expect(wrapper.find(Modal).props().isVisible).toBeFalsy();
    expect(wrapper.find(Modal).props().onClose).not.toBe(closePopup);
    expect(wrapper.find(Modal).props().cancelMessageId).toBe('appointmentModal.cancel');
    expect(wrapper.find(Modal).props().submitMessageId).toBe('appointmentModal.submit');
    expect(wrapper.find(Modal).props().titleMessageId).toBe('appointmentModal.title');
  });

  it('renders appointment modal form empty', () => {
    expect(wrapper.find(AppointmentForm).length).toBe(1);

    const formProps = wrapper.find(AppointmentForm).props();
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

    const formProps = wrapper.find(AppointmentForm).props();
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
