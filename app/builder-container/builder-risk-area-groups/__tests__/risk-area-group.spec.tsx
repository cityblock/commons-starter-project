import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import RiskAreaGroup from '../risk-area-group';

describe('Builder Risk Area Group Row Component', () => {
  const id = 'viscerion';
  const title = 'Viscerion is an ice dragon :(';
  const shortTitle = 'Viscerion';
  const createdAt = 'nightKingJavelin';
  const order = 2;
  const mediumRiskThreshold = 50;
  const highRiskThreshold = 80;
  const routeBase = '/destroy/wall';

  const riskAreaGroup = {
    id,
    title,
    shortTitle,
    order,
    createdAt,
    updatedAt: createdAt,
    deletedAt: null,
    mediumRiskThreshold,
    highRiskThreshold,
  };

  const wrapper = shallow(
    <RiskAreaGroup riskAreaGroup={riskAreaGroup} routeBase={routeBase} selected={false} />,
  );

  it('renders link to risk area group', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().className).toBe('container');
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${riskAreaGroup.id}`);
  });

  it('renders title of risk area group', () => {
    expect(wrapper.find('.title').length).toBe(1);
    expect(wrapper.find('.title').text()).toBe(title);
  });

  it('renders order', () => {
    expect(wrapper.find('.dateValue').length).toBe(3);
    expect(
      wrapper
        .find('.dateValue')
        .at(0)
        .text(),
    ).toBe(`${order}`);
  });

  it('renders medium risk threshold', () => {
    expect(
      wrapper
        .find('.dateValue')
        .at(1)
        .text(),
    ).toBe(`${mediumRiskThreshold}`);
  });

  it('renders high risk threshold', () => {
    expect(
      wrapper
        .find('.dateValue')
        .at(2)
        .text(),
    ).toBe(`${highRiskThreshold}`);
  });

  it('renders relative created at', () => {
    expect(wrapper.find(FormattedRelative).length).toBe(1);
    expect(wrapper.find(FormattedRelative).props().value).toBe(createdAt);
  });

  it('applies selected styles if specified', () => {
    wrapper.setProps({ selected: true });
    expect(wrapper.find(Link).props().className).toBe('container selected');
  });
});
