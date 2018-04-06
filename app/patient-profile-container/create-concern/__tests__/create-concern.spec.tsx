import { shallow } from 'enzyme';
import * as React from 'react';
import Modal from '../../../shared/library/modal/modal';
import ConcernSearch, { IProps } from '../concern-search';
import { CreateConcernModal } from '../create-concern';

describe('Create Concern Modal Component', () => {
  const placeholderFn = () => true as any;
  const patientId = 'willByers';
  const wrapper = shallow(
    <CreateConcernModal visible={false} closePopup={placeholderFn} patientId={patientId} />,
  );

  it('renders a modal', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);

    const modalProps = wrapper.find(Modal).props();
    expect(modalProps.titleMessageId).toBe('concernCreate.title');
    expect(modalProps.subTitleMessageId).toBe('concernCreate.detail');
    expect(modalProps.cancelMessageId).toBe('concernCreate.cancel');
    expect(modalProps.submitMessageId).toBe('concernCreate.submit');
    expect(modalProps.isVisible).toBeFalsy();
    expect(modalProps.className).toBe('popup');
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

  it('opens popup', () => {
    wrapper.setProps({ visible: true });
    expect(wrapper.find(Modal).props().isVisible).toBeTruthy();
  });
});
