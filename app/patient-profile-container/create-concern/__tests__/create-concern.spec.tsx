import { shallow } from 'enzyme';
import * as React from 'react';
import ModalButtons from '../../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../../shared/library/modal-header/modal-header';
import { Popup } from '../../../shared/popup/popup';
import ConcernSearch, { IProps } from '../concern-search';
import { CreateConcernModal } from '../create-concern';

describe('Create Concern Modal Component', () => {
  const placeholderFn = () => true as any;
  const patientId = 'willByers';
  const wrapper = shallow(
    <CreateConcernModal visible={false} closePopup={placeholderFn} patientId={patientId} />,
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

  it('renders search box to choose concern', () => {
    const concernSelect = wrapper.find<IProps>(ConcernSearch);
    expect(concernSelect.length).toBe(1);
    expect(concernSelect.props().concernId).toBeFalsy();
    expect(concernSelect.props().patientId).toBe(patientId);
    expect(concernSelect.props().searchTerm).toBeFalsy();
    expect(concernSelect.props().hideSearchResults).toBeFalsy();
    expect(concernSelect.props().showAllConcerns).toBeFalsy();
  });

  it('updates concern id', () => {
    const concernId = 'nancyWheeler';
    wrapper.setState({ concernId });
    const concernSelect = wrapper.find<IProps>(ConcernSearch);
    expect(concernSelect.props().concernId).toBe(concernId);
  });

  it('updates search term', () => {
    const searchTerm = 'shadow monster';
    wrapper.setState({ searchTerm });
    const concernSelect = wrapper.find<IProps>(ConcernSearch);
    expect(concernSelect.props().searchTerm).toBe(searchTerm);
  });

  it('updates hide search results and show all concerns', () => {
    wrapper.setState({ hideSearchResults: true, showAllConcerns: true });
    const concernSelect = wrapper.find<IProps>(ConcernSearch);
    expect(concernSelect.props().hideSearchResults).toBeTruthy();
    expect(concernSelect.props().showAllConcerns).toBeTruthy();
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
