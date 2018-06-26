import { textConsentDocument } from '../../../../../shared/util/test-data';
import { patientDocumentsUpdateQuery } from '../patient-documents';

describe('patientDocumentsUpdateQuery', () => {
  it('returns previous result if no new data', () => {
    const result = patientDocumentsUpdateQuery(
      { patientDocuments: [] },
      {
        subscriptionData: {},
      },
    );

    expect(result).toEqual({ patientDocuments: [] });
  });

  it('adds document to store', () => {
    const result = patientDocumentsUpdateQuery(
      { patientDocuments: [] },
      {
        subscriptionData: { data: { patientDocumentCreated: textConsentDocument } },
      },
    );

    expect(result).toEqual({
      patientDocuments: [textConsentDocument],
    });
  });

  it('does not double add document', () => {
    const result = patientDocumentsUpdateQuery(
      { patientDocuments: [textConsentDocument] },
      {
        subscriptionData: { data: { patientDocumentCreated: textConsentDocument } },
      },
    );

    expect(result).toEqual({
      patientDocuments: [textConsentDocument],
    });
  });
});
