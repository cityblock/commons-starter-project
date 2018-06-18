import { shallow } from 'enzyme';
import React from 'react';
import EmailModal, { ISavedEmail } from '../../../../shared/email-modal/email-modal';
import { patient } from '../../../../shared/util/test-data';
import { CreateEmailModal } from '../create-email-modal';

describe('Render Create Email Modal', () => {
  const onSaved = (email: ISavedEmail) => true;
  const closePopup = () => true;
  const createEmailMutation = jest.fn();

  const wrapper = shallow(
    <CreateEmailModal
      onSaved={onSaved}
      patientId={patient.id}
      isVisible={false}
      closePopup={closePopup}
      createEmailMutation={createEmailMutation}
    />,
  );

  it('renders email  modal in not visible state', () => {
    expect(wrapper.find(EmailModal).length).toBe(1);

    const modal = wrapper.find(EmailModal).props();
    expect(modal.isVisible).toBeFalsy();
    expect(modal.closePopup).toBe(closePopup);
    expect(modal.titleMessageId).toBe('email.addAdditional');
  });

  it('renders email modal in visible state', () => {
    wrapper.setProps({ isVisible: true });
    expect(wrapper.find(EmailModal).length).toBe(1);

    const modal = wrapper.find(EmailModal).props();
    expect(modal.isVisible).toBeTruthy();
  });

  it('renders email modal for primary email', () => {
    wrapper.setProps({ isPrimary: true });
    expect(wrapper.find(EmailModal).props().titleMessageId).toBe('email.addPrimary');
  });
});
