import { DataModels, EventTypes } from '../types';

export function formatRequestMeta(dataModel: DataModels, eventType: EventTypes) {
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
        ID: 'aed98aae-5e94-404f-912d-9ca0b6ebe869',
        Name: 'athenahealth sandbox',
      },
    ],
  };
}
