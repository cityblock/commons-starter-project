import { shallow } from 'enzyme';
import React from 'react';
import { DocumentTypeOptions } from 'schema';
import Text from '../../../../shared/library/text/text';
import { DocumentPlaceholder } from '../document-placeholder';

describe('Document Placeholder Component', () => {
  const patientId = 'sansaStark';
  const documentType = 'textConsent' as DocumentTypeOptions;

  const wrapper = shallow(
    <DocumentPlaceholder
      patientId={patientId}
      documentType={documentType}
      getHelloSignUrl={() => true as any}
      transferHelloSign={() => true as any}
    />,
  );

  it('renders text', () => {
    expect(wrapper.find(Text).props().color).toBe('red');
    expect(wrapper.find(Text).props().isBold).toBeTruthy();
    expect(wrapper.find(Text).props().font).toBe('basetica');
    expect(wrapper.find(Text).props().size).toBe('medium');
    expect(wrapper.find(Text).props().messageId).toBe('patientDocument.textConsent');
  });

  it('renders loading message if loading', () => {
    wrapper.setState({ loading: true });

    expect(wrapper.find(Text).props().messageId).toBe('patientDocument.loading');
  });
});
