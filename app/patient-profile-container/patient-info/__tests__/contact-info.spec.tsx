import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { contactInfo } from '../../../shared/util/test-data';
import ContactInfo from '../contact-info';
import EmailInfo from '../email-info/email-info';

describe('Render Patient Comtact Info Component', () => {
  const onChange = () => true;
  const wrapper = shallow(<ContactInfo contactInfo={contactInfo} onChange={onChange} />);

  it('renders email info', () => {
    const emailInfo = wrapper.find(EmailInfo);
    expect(emailInfo).toHaveLength(1);

    expect(emailInfo.props().patientId).toBe(contactInfo.patientId);
    expect(emailInfo.props().patientInfoId).toBe(contactInfo.patientInfoId);
    expect(emailInfo.props().primaryEmail).toBe(contactInfo.primaryEmail);
    expect(emailInfo.props().emails).toBe(contactInfo.emails);
  });

  it('renders contact info header', () => {
    expect(wrapper.find(FormattedMessage)).toHaveLength(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('contactInfo.sectionTitle');
  });
});
