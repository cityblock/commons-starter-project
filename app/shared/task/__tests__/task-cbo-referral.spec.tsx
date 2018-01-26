import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Icon from '../../library/icon/icon';
import { CBOReferral } from '../../util/test-data';
import { Divider } from '../task';
import TaskCBODetail from '../task-cbo-detail';
import TaskCBOReferral from '../task-cbo-referral';

describe('Task CBO Referral', () => {
  const wrapper = shallow(<TaskCBOReferral CBOReferral={CBOReferral} />);

  it('renders task CBO detail', () => {
    expect(wrapper.find(TaskCBODetail).length).toBe(1);
    expect(wrapper.find(TaskCBODetail).props().CBOReferral).toEqual(CBOReferral);
  });

  it('renders button to view form', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().className).toBe('viewForm');
  });

  it('renders icon and formatted message inside link', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('pictureAsPDF');

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('CBO.viewForm');
  });

  it('renders divider', () => {
    expect(wrapper.find(Divider).length).toBe(1);
  });
});
