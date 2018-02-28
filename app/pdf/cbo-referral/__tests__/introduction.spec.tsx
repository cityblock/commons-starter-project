import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import { patient, taskWithComment, user } from '../../../shared/util/test-data';
import BodyText from '../../shared/body-text';
import HeaderText from '../../shared/header-text';
import copy from '../copy/copy';
import Divider from '../divider';
import Introduction from '../introduction';
import TextGroup from '../text-group';

describe('CBO Referral PDF Introduction', () => {
  const task = {
    ...taskWithComment,
    patient: {
      ...patient,
      careTeam: [user],
    },
  };

  const wrapper = shallow(<Introduction task={task as any} />);

  it('renders view containers', () => {
    expect(wrapper.find(View).length).toBe(5);
  });

  it('renders introduction header', () => {
    expect(wrapper.find(HeaderText).length).toBe(1);
    expect(wrapper.find(HeaderText).props().label).toBe(copy.introduction);
  });

  it('renders introduction body', () => {
    expect(wrapper.find(BodyText).length).toBe(1);
    expect(wrapper.find(BodyText).props().label).toBe(copy.introBody);
  });

  it('renders text indicating category of CBO', () => {
    expect(wrapper.find(Text).length).toBe(1);
    expect(wrapper.find(Text).text()).toBe(task.CBOReferral.category.title);
  });

  it('renders referred by', () => {
    expect(wrapper.find(TextGroup).length).toBe(4);
    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().headerLabel,
    ).toBe(copy.referredBy);
    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().bodyLabel,
    ).toBe(formatFullName(task.assignedTo.firstName, task.assignedTo.lastName));
  });

  it('renders care team phone', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().headerLabel,
    ).toBe(copy.careTeamPhone);
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().bodyLabel,
    ).toBe(task.assignedTo.phone);
  });

  it('renders care team email', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(2)
        .props().headerLabel,
    ).toBe(copy.careTeamEmail);
    expect(
      wrapper
        .find(TextGroup)
        .at(2)
        .props().bodyLabel,
    ).toBe(task.assignedTo.email);
  });

  it('renders care team PCP', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(3)
        .props().headerLabel,
    ).toBe(copy.careTeamPCP);
    expect(
      wrapper
        .find(TextGroup)
        .at(3)
        .props().bodyLabel,
    ).toBe(`Dr. ${formatFullName(user.firstName, user.lastName)}`);
  });

  it('renders divider', () => {
    expect(wrapper.find(Divider).length).toBe(1);
  });
});
