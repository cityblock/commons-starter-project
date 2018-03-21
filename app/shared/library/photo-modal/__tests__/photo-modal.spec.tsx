import { shallow } from 'enzyme';
import * as React from 'react';
import { Popup } from '../../../popup/popup';
import ModalHeader from '../../modal-header/modal-header';
import Spinner from '../../spinner/spinner';
import PhotoModal from '../photo-modal';
import PhotoModalButtons from '../photo-modal-buttons';

describe('Library Photo Modal Component', () => {
  const placeholderFn = () => true as any;
  const imgData = new Blob(['daenerysTargaryen']);

  const wrapper = shallow(
    <PhotoModal isVisible={true} closePopup={placeholderFn} onSave={placeholderFn} />,
  );

  it('renders popup', () => {
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('renders modal header', () => {
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('patientPhoto.popupTitle');
  });

  it('renders spinner if video stream still loading', () => {
    expect(wrapper.find(Spinner).length).toBe(1);
  });

  it('does not display face outline by default', () => {
    expect(wrapper.find('.faceOutline').length).toBe(0);
  });

  it('renders video without hidden styling', () => {
    expect(wrapper.find('video').props().className).toBe('video');
  });

  it('renders hidden canvases to draw intermediate image data', () => {
    expect(wrapper.find('canvas').length).toBe(2);

    expect(
      wrapper
        .find('canvas')
        .at(0)
        .props().className,
    ).toBe('canvas');
    expect(
      wrapper
        .find('canvas')
        .at(1)
        .props().className,
    ).toBe('canvas');
  });

  it('does not render image if no data yet', () => {
    expect(wrapper.find('img').length).toBe(0);
  });

  it('renders photo modal buttons', () => {
    expect(wrapper.find(PhotoModalButtons).props().isPhotoTaken).toBeFalsy();
  });

  it('does not render spinner once stream established', () => {
    wrapper.setState({ stream: true as any });

    expect(wrapper.find(Spinner).length).toBe(0);
  });

  it('hides video once image data captured', () => {
    wrapper.setState({ imgData });

    expect(wrapper.find('video').props().className).toBe('video hidden');
  });

  it('renders image of caputred data', () => {
    expect(wrapper.find('img').props().src).toBe(imgData);
  });

  it('renders face outline if specified', () => {
    wrapper.setProps({ showFaceOutline: true });
    wrapper.setState({ imgData: null });

    expect(wrapper.find('.faceOutline').length).toBe(1);
  });

  it('hides face outline after image taken', () => {
    wrapper.setState({ imgData });

    expect(wrapper.find('.faceOutline').length).toBe(0);
  });
});
