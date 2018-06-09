import { shallow } from 'enzyme';
import * as React from 'react';
import ModalButtons from '../../modal-buttons/modal-buttons';
import PhotoModalButtons from '../photo-modal-buttons';

describe('Library Photo Modal Buttons Component', () => {
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <PhotoModalButtons
      isPhotoTaken={false}
      onClose={placeholderFn}
      onTakePhoto={placeholderFn}
      onRetakePhoto={placeholderFn}
      onSavePhoto={placeholderFn}
      isLoading={false}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders buttons to cancel and take photo if photo not taken yet', () => {
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('patientPhoto.takePhoto');

    // uses default modal buttons cancel message of "Cancel"
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBeFalsy();
  });

  it('renders buttons to save and retake photo if photo is taken', () => {
    wrapper.setProps({ isPhotoTaken: true });

    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('patientPhoto.savePhoto');
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('patientPhoto.retakePhoto');
    expect(wrapper.find(ModalButtons).props().isLoading).toBeFalsy();
  });
});
