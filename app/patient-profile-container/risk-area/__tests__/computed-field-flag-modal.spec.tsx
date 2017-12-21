import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../shared/library/form-label/form-label';
import ModalButtons from '../../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../../shared/library/modal-header/modal-header';
import Spinner from '../../../shared/library/spinner/spinner';
import TextArea from '../../../shared/library/textarea/textarea';
import { Popup } from '../../../shared/popup/popup';
import { ComputedFieldFlagModal } from '../computed-field-flag-modal';

describe('Computed Field Flag Modal', () => {
  const placeholderFn = () => true as any;
  const wrapper = shallow(
    <ComputedFieldFlagModal
      visible={true}
      patientAnswerIds={[]}
      flagComputedField={placeholderFn}
      closePopup={placeholderFn}
    />,
  );

  it('renders a popup', () => {
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('renders modal header', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('computedField.flag');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('computedField.flagDetail');
  });

  it('renders form label to enter reason', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('computedField.reason');
  });

  it('renders text area to enter reason', () => {
    const reason = 'Viscerion destroyed the Wall';
    wrapper.setState({ reason });
    expect(wrapper.find(TextArea).length).toBe(1);
    expect(wrapper.find(TextArea).props().value).toBe(reason);
    expect(wrapper.find(TextArea).props().placeholderMessageId).toBe('computedField.reasonDetail');
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
  });

  it('closes popup', () => {
    wrapper.setProps({ visible: false });
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
  });

  it('renders loading spinner if loading', () => {
    wrapper.setState({ loading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
  });
});
