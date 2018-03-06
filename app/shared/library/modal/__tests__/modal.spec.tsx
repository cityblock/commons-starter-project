import { shallow } from 'enzyme';
import * as React from 'react';
import { Popup } from '../../../popup/popup';
import ModalButtons from '../../modal-buttons/modal-buttons';
import ModalError from '../../modal-error/modal-error';
import ModalHeader from '../../modal-header/modal-header';
import Modal from '../modal';

describe('Render Modal Component', () => {
  const onClose = () => true;
  const onSubmit = () => true;
  const titleMessageId = 'modal.title';
  const cancelMessageId = 'modal.cancel';
  const submitMessageId = 'modal.submit';
  const errorMessageId = 'modal.error';

  const wrapper = shallow(
    <Modal
      onClose={onClose}
      onSubmit={onSubmit}
      isVisible={true}
      titleMessageId={titleMessageId}
      cancelMessageId={cancelMessageId}
      submitMessageId={submitMessageId}
      errorMessageId={errorMessageId}
    >
      <input />
    </Modal>,
  );

  it('renders address modal popup', () => {
    expect(wrapper.find(Popup)).toHaveLength(1);
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
    expect(wrapper.find(Popup).props().closePopup).toBe(onClose);
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('renders address modal header', () => {
    expect(wrapper.find(ModalHeader)).toHaveLength(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe(titleMessageId);
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBeFalsy();
    expect(wrapper.find(ModalHeader).props().closePopup).toBe(onClose);
  });

  it('renders address modal buttons', () => {
    expect(wrapper.find(ModalButtons)).toHaveLength(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe(cancelMessageId);
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe(submitMessageId);
    expect(wrapper.find(ModalButtons).props().cancel).toBe(onClose);
    expect(wrapper.find(ModalButtons).props().submit).toBe(onSubmit);
  });

  it('renders an error bar if there is an error', () => {
    expect(wrapper.find(ModalError)).toHaveLength(0);

    const error = 'this is messed up';
    wrapper.setProps({ error });

    expect(wrapper.find(ModalError)).toHaveLength(1);
    expect(wrapper.find(ModalError).props().errorMessageId).toBe(errorMessageId);
    expect(wrapper.find(ModalError).props().error).toBe(error);
  });

  it('renders all children', () => {
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('renders subtitle if associated message id given', () => {
    const subTitleMessageId = 'modal.subtitle';
    wrapper.setProps({ subTitleMessageId });

    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe(subTitleMessageId);
  });
});
