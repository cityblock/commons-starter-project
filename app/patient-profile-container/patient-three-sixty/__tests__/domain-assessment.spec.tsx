import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DateInfo from '../../../shared/library/date-info/date-info';
import SmallText from '../../../shared/library/small-text/small-text';
import { riskArea } from '../../../shared/util/test-data';
import DomainAssessment from '../domain-assessment';

describe('Patient 360 Domain Assessment List Item', () => {
  const routeBase = '/winterfell';

  const wrapper = shallow(
    <DomainAssessment
      routeBase={routeBase}
      riskArea={riskArea}
      suppressed={false}
      markAsSuppressed={() => true as any}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders link to individual assessment', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/assessment/${riskArea.id}`);
    expect(wrapper.find(Link).props().className).toBe('link');
  });

  it('renders title of risk area', () => {
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('h2').text()).toBe(riskArea.title);
  });

  it('renders not completed summary if not completed', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('threeSixty.notCompleted');
  });

  it('renders not completed date text', () => {
    expect(wrapper.find(SmallText).length).toBe(1);
    expect(wrapper.find(SmallText).props().messageId).toBe('threeSixty.notCompletedShort');
  });

  const createdAt = 'createdAt';
  const updatedAt = 'updatedAt';
  const summaryText = 'Lady of Winterfell';

  const riskAreaFull = {
    assessmentType: 'manual',
    questions: [
      {
        answers: [
          {
            inSummary: true,
            riskAdjustmentType: 'forceHighRisk',
            summaryText,
            patientAnswers: [
              {
                createdAt,
                updatedAt,
              },
            ],
          },
        ],
      },
    ],
  };

  it('applies border styles if answered', () => {
    wrapper.setProps({ riskArea: riskAreaFull });
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container redBorder');
  });

  it('renders dates for creation and update', () => {
    expect(wrapper.find(DateInfo).length).toBe(2);
    expect(
      wrapper
        .find(DateInfo)
        .at(0)
        .props().messageId,
    ).toBe('threeSixty.initialAssessment');
    expect(
      wrapper
        .find(DateInfo)
        .at(0)
        .props().date,
    ).toBe(createdAt);
    expect(
      wrapper
        .find(DateInfo)
        .at(1)
        .props().label,
    ).toBe('updated');
    expect(
      wrapper
        .find(DateInfo)
        .at(1)
        .props().date,
    ).toBe(updatedAt);
  });

  it('renders summary text', () => {
    expect(wrapper.find('.detail').length).toBe(1);
    expect(wrapper.find('.detail').text()).toBe(summaryText);
  });

  it('renders nothing if suppressed', () => {
    wrapper.setProps({ suppressed: true });
    expect(wrapper.find('div').length).toBe(0);
  });
});
