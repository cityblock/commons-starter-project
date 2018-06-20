import { mount } from 'enzyme';
import React from 'react';
import { DocumentTypeOptions } from 'schema';
import Text from '../../../../shared/library/text/text';
import ApolloTestProvider from '../../../../shared/util/apollo-test-provider';
import DocumentPlaceholder from '../document-placeholder';

describe('Document Placeholder Component', () => {
  const patientId = 'sansaStark';
  const documentType = 'textConsent' as DocumentTypeOptions;

  const wrapper = mount(
    <ApolloTestProvider graphqlMocks={{}}>
      <DocumentPlaceholder patientId={patientId} documentType={documentType} />
    </ApolloTestProvider>,
  );

  it('renders text', () => {
    expect(wrapper.find(Text).props().color).toBe('red');
    expect(wrapper.find(Text).props().isBold).toBeTruthy();
    expect(wrapper.find(Text).props().font).toBe('basetica');
    expect(wrapper.find(Text).props().size).toBe('medium');
    expect(wrapper.find(Text).props().messageId).toBe('patientDocument.textConsent');
  });
});
