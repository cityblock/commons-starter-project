import { Document, Page, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { taskWithComment as task, CBOReferralOther } from '../../../shared/util/test-data';
import CBOReferral from '../cbo-referral';
import Footer from '../footer';
import Header from '../header';
import Introduction from '../introduction';
import PatientInfo from '../patient-info';
import Title from '../title';

describe('CBO Referral PDF', () => {
  const wrapper = shallow(<CBOReferral task={task as any} />);

  it('renders Document', () => {
    expect(wrapper.find(Document).length).toBe(1);
  });

  it('renders single page', () => {
    expect(wrapper.find(Page).length).toBe(1);
  });

  it('renders top border and container', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders header', () => {
    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find(Header).props().referredOn).toBe(task.CBOReferral.sentAt);
  });

  it('renders title', () => {
    expect(wrapper.find(Title).length).toBe(1);
    expect(wrapper.find(Title).props().CBOName).toBe(task.CBOReferral.CBO.name);
  });

  it('renders introduction', () => {
    expect(wrapper.find(Introduction).length).toBe(1);
    expect(wrapper.find(Introduction).props().task).toEqual(task);
  });

  it('renders patient info', () => {
    expect(wrapper.find(PatientInfo).length).toBe(1);
    expect(wrapper.find(PatientInfo).props().patient).toEqual(task.patient);
    expect(wrapper.find(PatientInfo).props().description).toBe(task.description);
  });

  it('renders footer', () => {
    expect(wrapper.find(Footer).length).toBe(1);
  });

  it('renders custom name if other CBO selected', () => {
    wrapper.setProps({
      task: {
        ...task,
        CBOReferral: CBOReferralOther,
      },
    });

    expect(wrapper.find(Title).props().CBOName).toBe(CBOReferralOther.name);
  });
});
