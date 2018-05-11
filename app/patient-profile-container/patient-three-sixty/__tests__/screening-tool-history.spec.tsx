import { shallow } from 'enzyme';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { formatFullName, formatScreeningToolScore } from '../../../shared/helpers/format-helpers';
import DateInfo from '../../../shared/library/date-info/date-info';
import Icon from '../../../shared/library/icon/icon';
import SmallText from '../../../shared/library/small-text/small-text';
import TextInfo from '../../../shared/library/text-info/text-info';
import {
  riskArea,
  shortPatientScreeningToolSubmission as submission,
  shortPatientScreeningToolSubmission2 as prevSubmission,
} from '../../../shared/util/test-data';
import { ScreeningToolHistory } from '../screening-tool-history';

describe('Patient 360 Screening Tool History Component', () => {
  const routeBase = '/nymeria';
  const wrapper = shallow(
    <ScreeningToolHistory
      submission={submission}
      prevSubmission={prevSubmission}
      routeBase={routeBase}
      riskArea={{ id: 'id', title: riskArea.title }}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders link to screening tool page', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/tools/${submission.screeningTool.id}/submission/${submission.id}`);
    expect(wrapper.find(Link).props().className).toBe('link');
  });

  it('renders screening tool title', () => {
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('h2').text()).toBe(submission.screeningTool.title);
  });

  it('renders risk area of screening tool', () => {
    expect(wrapper.find(SmallText).length).toBe(1);
    expect(wrapper.find(SmallText).props().text).toBe(riskArea.title);
  });

  it('renders information about when screening tool was administered', () => {
    expect(wrapper.find(TextInfo).length).toBe(2);
    expect(
      wrapper
        .find(TextInfo)
        .at(0)
        .props().messageId,
    ).toBe('history360.administered');
    expect(
      wrapper
        .find(TextInfo)
        .at(0)
        .props().text,
    ).toBe(formatFullName(submission.user.firstName, submission.user.lastName));
  });

  it('renders information about who conducted screening tool', () => {
    expect(wrapper.find(DateInfo).length).toBe(1);
    expect(wrapper.find(DateInfo).props().date).toBe(submission.createdAt);
    expect(wrapper.find(DateInfo).props().messageId).toBe('history360.conducted');
  });

  it('renders score text', () => {
    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').props().className).toBe('score yellow');
    expect(wrapper.find('h3').text()).toBe(formatScreeningToolScore(submission));
  });

  it('renders icon to indicate link', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowRight');
  });

  it('renders previous score text', () => {
    expect(
      wrapper
        .find(TextInfo)
        .at(1)
        .props().textColor,
    ).toBe('lightGray');
    expect(
      wrapper
        .find(TextInfo)
        .at(1)
        .props().messageId,
    ).toBe('history360.previous');
    expect(
      wrapper
        .find(TextInfo)
        .at(1)
        .props().text,
    ).toBe(formatScreeningToolScore(prevSubmission));
    expect(
      wrapper
        .find(TextInfo)
        .at(1)
        .props().textMessageId,
    ).toBeFalsy();
  });

  it('renders no record text if no previous submission', () => {
    wrapper.setProps({ prevSubmission: null });
    expect(
      wrapper
        .find(TextInfo)
        .at(1)
        .props().text,
    ).toBeFalsy();
    expect(
      wrapper
        .find(TextInfo)
        .at(1)
        .props().textMessageId,
    ).toBe('history360.noRecord');
  });
});
