import { shallow } from 'enzyme';
import React from 'react';
import DateInput from '../../../shared/library/date-input/date-input';
import FormLabel from '../../../shared/library/form-label/form-label';
import TextInput from '../../../shared/library/text-input/text-input';
import TextArea from '../../../shared/library/textarea/textarea';
import ExternalCareTeamMultiSelect from '../../../shared/user-multi-select/external-care-team-multi-select';
import {
  getFamilyMemberInfo,
  getUserInfo,
} from '../../../shared/user-multi-select/get-info-helpers';
import InternalCareTeamMultiSelect from '../../../shared/user-multi-select/internal-care-team-multi-select';
import { currentUser, healthcareProxy, user } from '../../../shared/util/test-data';
import AddressSelect from '../address-select';
import AppointmentForm from '../appointment-form';

describe('Render Patient Appointment Form', () => {
  const onChange = (values: { [key: string]: any }) => true;
  const patientId = '123';
  const appointmentDate = '2018-05-15';
  const wrapper = shallow(
    <AppointmentForm
      onChange={onChange}
      patientId={patientId}
      internalGuests={[]}
      externalGuests={[]}
      appointmentDate={appointmentDate}
      startTime={null}
      endTime={null}
      currentUser={currentUser}
    />,
  );

  it('renders empty external provider form', () => {
    const labels = wrapper.find(FormLabel);
    const inputs = wrapper.find(TextInput);
    const externalSelect = wrapper.find(ExternalCareTeamMultiSelect);
    const internalSelect = wrapper.find(InternalCareTeamMultiSelect);
    const addressSelect = wrapper.find(AddressSelect);
    const textArea = wrapper.find(TextArea);
    const date = wrapper.find(DateInput);
    expect(labels).toHaveLength(8);
    expect(inputs).toHaveLength(3);
    expect(internalSelect).toHaveLength(1);
    expect(externalSelect).toHaveLength(1);
    expect(addressSelect).toHaveLength(1);
    expect(textArea).toHaveLength(1);
    expect(date).toHaveLength(1);

    const titleProps = inputs.at(0).props();
    expect(labels.at(0).props().messageId).toBe('appointmentModal.appointmentTitle');
    expect(titleProps.value).toBeFalsy();
    expect(titleProps.name).toBe('title');
    expect(titleProps.placeholderMessageId).toBe('appointmentModal.appointmentTitlePlaceholder');

    expect(labels.at(1).props().messageId).toBe('appointmentModal.guest');
    expect(internalSelect.props().selectedUsers).toMatchObject([]);
    expect(internalSelect.props().patientId).toBe(patientId);
    expect(internalSelect.props().name).toBe('internalGuests');
    expect(internalSelect.props().placeholderMessageId).toBe('appointmentModal.guestPlaceholder');

    expect(labels.at(2).props().messageId).toBe('appointmentModal.externalGuest');
    expect(externalSelect.props().selectedUsers).toMatchObject([]);
    expect(externalSelect.props().patientId).toBe(patientId);
    expect(externalSelect.props().name).toBe('externalGuests');
    expect(externalSelect.props().placeholderMessageId).toBe(
      'appointmentModal.externalGuestPlaceholder',
    );

    expect(labels.at(3).props().messageId).toBe('appointmentModal.location');
    expect(addressSelect.props().patientId).toBe(patientId);
    expect(addressSelect.props().onChange).toBe(onChange);
    expect(addressSelect.props().selectedAddress).toBeFalsy();
    expect(addressSelect.props().location).toBeFalsy();

    expect(labels.at(4).props().messageId).toBe('appointmentModal.description');
    expect(textArea.props().value).toBeFalsy();
    expect(textArea.props().name).toBe('description');
    expect(textArea.props().placeholderMessageId).toBe('appointmentModal.descriptionPlaceholder');

    expect(labels.at(5).props().messageId).toBe('appointmentModal.date');
    expect(date.props().value).toBe(appointmentDate);
    expect(date.props().name).toBe('appointmentDate');

    const startTimeProps = inputs.at(1).props();
    expect(labels.at(6).props().messageId).toBe('appointmentModal.startTime');
    expect(startTimeProps.value).toBeFalsy();
    expect(startTimeProps.inputType).toBe('time');
    expect(startTimeProps.name).toBe('startTime');
    expect(startTimeProps.required).toBeTruthy();

    const endTimeProps = inputs.at(2).props();
    expect(labels.at(7).props().messageId).toBe('appointmentModal.endTime');
    expect(endTimeProps.value).toBeFalsy();
    expect(endTimeProps.inputType).toBe('time');
    expect(endTimeProps.name).toBe('endTime');
    expect(endTimeProps.required).toBeTruthy();
  });

  it('renders filled out external provider form', () => {
    wrapper.setProps({
      appointmentDate: '2018-12-20',
      startTime: '13:30:00',
      endTime: '15:00:00',
      title: 'Some event',
      description: 'reason',
      internalGuests: [getUserInfo(user)],
      externalGuests: [getFamilyMemberInfo(healthcareProxy)],
      location: '123 Sesame St',
      selectedAddress: { description: 'External location' },
    });

    const inputs = wrapper.find(TextInput);
    const externalSelect = wrapper.find(ExternalCareTeamMultiSelect);
    const internalSelect = wrapper.find(InternalCareTeamMultiSelect);
    const addressSelect = wrapper.find(AddressSelect);
    const textArea = wrapper.find(TextArea);
    const date = wrapper.find(DateInput);

    const titleProps = inputs.at(0).props();
    expect(titleProps.value).toBe('Some event');
    expect(titleProps.name).toBe('title');

    expect(internalSelect.props().selectedUsers).toMatchObject([getUserInfo(user)]);

    expect(externalSelect.props().selectedUsers).toMatchObject([
      getFamilyMemberInfo(healthcareProxy),
    ]);

    expect(addressSelect.props().selectedAddress).toMatchObject({
      description: 'External location',
    });
    expect(addressSelect.props().location).toBe('123 Sesame St');

    expect(textArea.props().value).toBe('reason');

    expect(date.props().value).toBe('2018-12-20');

    const startTimeProps = inputs.at(1).props();
    expect(startTimeProps.value).toBe('13:30:00');
    expect(startTimeProps.name).toBe('startTime');

    const endTimeProps = inputs.at(2).props();
    expect(endTimeProps.value).toBe('15:00:00');
    expect(endTimeProps.name).toBe('endTime');
  });
});
