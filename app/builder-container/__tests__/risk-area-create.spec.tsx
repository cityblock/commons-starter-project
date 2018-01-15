import { shallow } from 'enzyme';
import * as React from 'react';
import Option from '../../shared/library/option/option';
import Select from '../../shared/library/select/select';
import Spinner from '../../shared/library/spinner/spinner';
import TextInput from '../../shared/library/text-input/text-input';
import { RiskAreaCreate } from '../risk-area-create';

describe('Builder Risk Area Create component', () => {
  const riskAreaGroup1 = {
    id: 'ghost',
    title: "Jon Snow's Direwolf",
  };
  const riskAreaGroup2 = {
    id: 'lady',
    title: "Sansa Stark's Direwolf",
  };
  const riskAreaGroup3 = {
    id: 'greyWind',
    title: "Robb Stark's Direwolf",
  };
  const riskAreaGroups = [riskAreaGroup1, riskAreaGroup2, riskAreaGroup3] as any;
  const placeholderFn = () => true as any;
  const history = { push: jest.fn() } as any;

  const wrapper = shallow(
    <RiskAreaCreate
      history={history}
      onClose={placeholderFn}
      riskAreaGroups={riskAreaGroups}
      routeBase="/direwolves"
    />,
  );

  it('renders title input', () => {
    const title = 'Direwolves unite!';
    wrapper.setState({ title });
    expect(wrapper.find(TextInput).length).toBe(4);
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().value,
    ).toBe(title);
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().placeholderMessageId,
    ).toBe('riskArea.title');
  });

  it('renders order input', () => {
    const order = '1';
    wrapper.setState({ order });
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().value,
    ).toBe(order);
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('riskArea.order');
  });

  it('renders medium risk threshold input', () => {
    const mediumRiskThreshold = '5';
    wrapper.setState({ mediumRiskThreshold });
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().value,
    ).toBe(mediumRiskThreshold);
    expect(
      wrapper
        .find(TextInput)
        .at(2)
        .props().placeholderMessageId,
    ).toBe('riskArea.mediumRiskThreshold');
  });

  it('renders high risk threshold input', () => {
    const highRiskThreshold = '5';
    wrapper.setState({ highRiskThreshold });
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().value,
    ).toBe(highRiskThreshold);
    expect(
      wrapper
        .find(TextInput)
        .at(3)
        .props().placeholderMessageId,
    ).toBe('riskArea.highRiskThreshold');
  });

  it('renders select for risk area group', () => {
    const riskAreaGroupId = 'lady';
    wrapper.setState({ riskAreaGroupId });

    expect(wrapper.find(Select).length).toBe(2);
    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().value,
    ).toBe(riskAreaGroupId);
    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().children[1].length,
    ).toBe(3);
    expect(wrapper.find(Option).length).toBe(7);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('riskArea.riskAreaGroupId');
  });

  it('renders select for assessment type', () => {
    const assessmentType = 'manual';
    wrapper.setState({ assessmentType });

    expect(
      wrapper
        .find(Select)
        .at(1)
        .props().value,
    ).toBe(assessmentType);
    expect(
      wrapper
        .find(Select)
        .at(1)
        .props().children.length,
    ).toBe(3);
    expect(
      wrapper
        .find(Option)
        .at(4)
        .props().messageId,
    ).toBe('riskArea.assessmentType');
  });

  it('renders a loading spinner if loading', () => {
    wrapper.setProps({ riskAreaGroupsLoading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find('.container').length).toBe(0);
  });
});
