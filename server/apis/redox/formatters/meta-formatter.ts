import { DataModels, EventTypes } from '../types';

export function formatRequestMeta(dataModel: DataModels, eventType: EventTypes) {
  const destinationId =
    dataModel === 'Clinical Summary'
      ? '2b165ef9-95f1-48d5-962a-82f5f35ba683'
      : 'aed98aae-5e94-404f-912d-9ca0b6ebe869';
  return {
    DataModel: dataModel,
    EventType: eventType,
    EventDateTime: new Date().toISOString(), // '2017-05-26T08:34:07.251Z',
    Source: {
      ID: '87c226a2-9e53-481e-a9e9-68b5fbdb6471',
      Name: 'Athena Sandbox',
    },
    Destinations: [
      {
        ID: destinationId, // TODO: go back to single ID once Redox fixes the ClinicalSummary model
        Name: 'athenahealth sandbox',
      },
    ],
  };
}
