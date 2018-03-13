import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../library/form-label/form-label';
import ModalButtons from '../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../library/modal-header/modal-header';
import Option from '../../library/option/option';
import Select from '../../library/select/select';
import TextArea from '../../library/textarea/textarea';
import { Popup } from '../../popup/popup';
import GlassBreakModal from '../glass-break-modal';
import { reasonOptions } from '../reason-options';

describe('Glass Break Modal', () => {
  const placeholderFn = () => true as any;
  const reason = 'Other';
  const note = 'Winter is Coming';

  const wrapper = shallow(
    <GlassBreakModal
      isPopupVisible={true}
      createGlassBreak={placeholderFn}
      closePopup={placeholderFn}
      resource="patient"
    />,
  );

  wrapper.setState({ reason, note });

  it('renderes popup', () => {
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('renders modal header', () => {
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('glassBreak.popupTitle');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('glassBreak.popupBody');
  });

  it('renders form label for reason', () => {
    expect(wrapper.find(FormLabel).length).toBe(2);

    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().messageId,
    ).toBe('glassBreak.reason');
    expect(
      wrapper
        .find(FormLabel)
        .at(0)
        .props().topPadding,
    ).toBeTruthy();
  });

  it('renders select input for reason', () => {
    expect(wrapper.find(Select).props().value).toBe(reason);
    expect(wrapper.find(Select).props().large).toBeTruthy();
  });

  it('renders options for selecting reason', () => {
    expect(wrapper.find(Option).length).toBe(Object.keys(reasonOptions).length + 1);

    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('glassBreak.selectReason');
  });

  it('renders form label for note', () => {
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().messageId,
    ).toBe('glassBreak.note');
    expect(
      wrapper
        .find(FormLabel)
        .at(1)
        .props().topPadding,
    ).toBeTruthy();
  });

  it('renders text area for note', () => {
    expect(wrapper.find(TextArea).props().value).toBe(note);
    expect(wrapper.find(TextArea).props().placeholderMessageId).toBe('glassBreak.inputNote');
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('glassBreak.breakGlasspatient');
  });

  it('changes button message for progress note', () => {
    wrapper.setProps({ resource: 'progressNote' });

    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe(
      'glassBreak.breakGlassprogressNote',
    );
  });
});
