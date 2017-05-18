import { IPatientMedication, IPatientMedications } from 'schema';
import {
  IPatientMedicationsResponse,
  IPatientMedicationEvent,
  IPatientMedicationResource,
} from '../types';

export function formatPatientMedications(
  medicationsResponse: IPatientMedicationsResponse,
): IPatientMedications {
  if (medicationsResponse.nomedicationsreported) {
    return {
      medications: {
        active: [],
        inactive: [],
      },
    };
  } else {
    const active: IPatientMedication[] = [];
    const inactive: IPatientMedication[] = [];
    const medications = medicationsResponse.medications;

    for (const medicationHistory of medications) {
      const sortedResources = medicationHistory.sort(sortMedicationResources);
      const currentResource = sortedResources[0];
      const sortedEvents = currentResource.events
        .sort(sortMedicationEvents)
        .map(event => ({ date: event.eventdate, event: event.type }));

      const medication = {
        name: currentResource.medication,
        medicationId: currentResource.medicationid,
        medicationEntryId: currentResource.medicationentryid,
        quantity: currentResource.quantity,
        quantityUnit: currentResource.quantityunit,
        refillsAllowed: currentResource.refillsallowed,
        renewable: currentResource.issafetorenew,
        dosageInstructions: currentResource.unstructuredsig,
        source: currentResource.source,
        status: sortedEvents[0].event,
        lastUpdated: sortedEvents[0].date,
        historical: currentResource.medicationentryid.startsWith('H'),
        stopReason: currentResource.stopreason,
        history: {
          events: sortedEvents,
        },
      };

      if (medication.status === 'END' || medication.status === 'HIDE') {
        inactive.push(medication);
      } else {
        active.push(medication);
      }
    }

    return {
      medications: {
        active: active.sort(sortMedicationEvents),
        inactive: inactive.sort(sortMedicationEvents),
      },
    };
  }
}

function sortMedicationResources(
  resourceA: IPatientMedicationResource,
  resourceB: IPatientMedicationResource,
): number {
  const resourceASortedEvents = resourceA.events.sort(sortMedicationEvents);
  const resourceBSortedEvents = resourceB.events.sort(sortMedicationEvents);

  const resourceALatestEventDate = new Date(resourceASortedEvents[0].eventdate);
  const resourceBLatestEventDate = new Date(resourceBSortedEvents[0].eventdate);

  return reverseCompareDates(resourceALatestEventDate, resourceBLatestEventDate);
}

function sortMedicationEvents(
  eventA: IPatientMedicationEvent & IPatientMedication,
  eventB: IPatientMedicationEvent & IPatientMedication,
): number {
  const eventADate = new Date(eventA.eventdate || eventA.lastUpdated);
  const eventBDate = new Date(eventB.eventdate || eventB.lastUpdated);
  const dateComparison = reverseCompareDates(eventADate, eventBDate);

  if (dateComparison !== 0) {
    return dateComparison;
  } else {
    const comparableAType = eventA.type || eventA.status;
    const comparableBType = eventB.type || eventB.status;

    return reverseCompareMedicationEventTypes(comparableAType, comparableBType);
  }
}

function reverseCompareDates(dateA: Date, dateB: Date): number {
  if (dateA > dateB) {
    return -1;
  } else if (dateA < dateB) {
    return 1;
  } else {
    return 0;
  }
}

function reverseCompareMedicationEventTypes(typeA: string, typeB: string): number {
  const typeHierarchy = ['ENTER', 'ORDER', 'START', 'FILL', 'END', 'HIDE'];
  const typeAIndex = typeHierarchy.indexOf(typeA);
  const typeBIndex = typeHierarchy.indexOf(typeB);

  if (typeAIndex > typeBIndex) {
    return -1;
  } else if (typeAIndex < typeBIndex) {
    return 1;
  } else {
    return 0;
  }
}
