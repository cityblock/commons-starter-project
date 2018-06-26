import { getPatientDocuments, patientDocumentCreated } from '../../../../graphql/types';

interface ISubscriptionData {
  subscriptionData: {
    data?: {
      patientDocumentCreated: patientDocumentCreated['patientDocumentCreated'];
    };
  };
}

export const patientDocumentsUpdateQuery = (
  previousResult: getPatientDocuments,
  { subscriptionData }: ISubscriptionData,
) => {
  if (!subscriptionData.data) return previousResult;

  const newDocument = subscriptionData.data.patientDocumentCreated;
  // ensure we don't double add
  if (
    previousResult.patientDocuments &&
    !previousResult.patientDocuments.find(document => document.id === newDocument.id)
  ) {
    return { patientDocuments: [newDocument, ...previousResult.patientDocuments] };
  }

  return previousResult;
};
