import { shallow } from 'enzyme';
import * as React from 'react';
import DeleteWarning from '../../../shared/library/delete-warning/delete-warning';
import { riskAreaGroup } from '../../../shared/util/test-data';
import RiskAreaGroupCreate from '../risk-area-group-create';
import { RiskAreaGroupDetail } from '../risk-area-group-detail';
import RiskAreaGroupEdit from '../risk-area-group-edit';

describe('Builder Risk Area Group Detail', () => {
  const placeholderFn = () => true as any;
  const errorFn = (message: string ) => true as any;

  const wrapper = shallow(
    <RiskAreaGroupDetail
      close={placeholderFn}
      createMode={false}
      cancelCreateRiskAreaGroup={placeholderFn}
      deleteRiskAreaGroup={placeholderFn}
      riskAreaGroup={null}
      openErrorPopup={errorFn}
    />,
  );

  it('renders nothing if no risk area group selected and not in create mode', () => {
    expect(wrapper.find(RiskAreaGroupEdit).length).toBe(0);
    expect(wrapper.find(DeleteWarning).length).toBe(0);
  });

  it('renders risk area group create if in create mode', () => {
    wrapper.setProps({ createMode: true });
    expect(wrapper.find(RiskAreaGroupCreate).length).toBe(1);
  });

  it('renders risk area group edit if risk area group present', () => {
    wrapper.setProps({ riskAreaGroup, createMode: false });

    expect(wrapper.find(RiskAreaGroupEdit).length).toBe(1);
    expect(wrapper.find(RiskAreaGroupEdit).props().riskAreaGroup).toEqual(riskAreaGroup);

    expect(wrapper.find(DeleteWarning).length).toBe(0);
  });

  it('renders delete warning screen if in delete mode', () => {
    wrapper.setState({ deleteMode: true });

    expect(wrapper.find(DeleteWarning).length).toBe(1);
    expect(wrapper.find(DeleteWarning).props().titleMessageId).toBe('riskAreaGroup.deleteWarning');
    expect(wrapper.find(DeleteWarning).props().deletedItemHeaderMessageId).toBe(
      'riskAreaGroup.deleteDetail',
    );
    expect(wrapper.find(DeleteWarning).props().deletedItemName).toBe(riskAreaGroup.title);
  });
});
