import { shallow } from 'enzyme';
import React from 'react';
import DeleteWarning from '../../../shared/library/delete-warning/delete-warning';
import { CBO } from '../../../shared/util/test-data';
import CBOCreate from '../cbo-create';
import { CBODetail } from '../cbo-detail';
import CBOEdit from '../cbo-edit';

describe('Builder CBO Detail', () => {
  const placeholderFn = jest.fn();
  const errorFn = (message: string) => true as any;

  const wrapper = shallow(
    <CBODetail
      close={placeholderFn}
      createMode={false}
      cancelCreateCBO={placeholderFn}
      deleteCBO={placeholderFn}
      CBO={null}
      openErrorPopup={errorFn}
    />,
  );

  it('renders nothing if no CBO selected and not in create mode', () => {
    expect(wrapper.find(CBOEdit).length).toBe(0);
    expect(wrapper.find(DeleteWarning).length).toBe(0);
  });

  it('renders CBO create if in create mode', () => {
    wrapper.setProps({ createMode: true });
    expect(wrapper.find(CBOCreate).length).toBe(1);
  });

  it('renders CBO edit if CBO present', () => {
    wrapper.setProps({ CBO, createMode: false });

    expect(wrapper.find(CBOEdit).length).toBe(1);
    expect(wrapper.find(CBOEdit).props().CBO).toEqual(CBO);

    expect(wrapper.find(DeleteWarning).length).toBe(0);
  });

  it('renders delete warning screen if in delete mode', () => {
    wrapper.setState({ deleteMode: true });

    expect(wrapper.find(DeleteWarning).length).toBe(1);
    expect(wrapper.find(DeleteWarning).props().titleMessageId).toBe('CBOs.deleteWarning');
    expect(wrapper.find(DeleteWarning).props().deletedItemHeaderMessageId).toBe(
      'CBOs.deleteDetail',
    );
    expect(wrapper.find(DeleteWarning).props().deletedItemName).toBe(CBO.name);
  });
});
