import { shallow } from 'enzyme';
import * as React from 'react';
import ModalButtons from '../../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../../shared/library/modal-header/modal-header';
import { Popup } from '../../../shared/popup/popup';
import ConcernSelect, { IProps } from '../concern-select';
import { CreateConcernModal } from '../create-concern';

describe('Create Concern Modal Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <CreateConcernModal visible={false} closePopup={placeholderFn} patientId={'patient-id'} />,
  );

  it('renders popup', () => {
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('renders a modal header', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('concernCreate.title');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('concernCreate.detail');
  });

  it('renders select to choose concern', () => {
    const concernSelect = wrapper.find<IProps>(ConcernSelect);
    expect(concernSelect.length).toBe(1);
    expect(concernSelect.props().concernId).toBeFalsy();
  });

  it('updates concern id', () => {
    const concernId = 'nancyWheeler';
    wrapper.setState({ concernId });
    const concernSelect = wrapper.find<IProps>(ConcernSelect);
    expect(concernSelect.props().concernId).toBe(concernId);
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('concernCreate.cancel');
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('concernCreate.submit');
  });

  it('opens popup', () => {
    wrapper.setProps({ visible: true });
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
  });
});
