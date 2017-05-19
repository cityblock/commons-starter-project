import { IPatientMedication, IPatientMedications } from 'schema';
import {
  IPatientMedicationsResponse,
  IPatientMedicationEvent,
  IPatientMedicationResource,
} from '../types';

/* The medications response from Athena forces this function to be a bit complex.
 *
 * The general structure of the part of the response that we care about looks like this:
 *
 * {
 *   medications: [
 *     [{
 *       medication: 'Medication Name',
 *       events: [{
 *         eventdate: '01/01/1979',
 *         type: 'ENTRY'
 *       }, {
 *         eventdate: '01/02/1979',
 *         type: 'FILL'
 *       }]
 *     }, {
 *       medication: 'Medication Name'
 *       events: [{
 *         eventdate: '01/02/1999',
 *         type: 'HIDE'
 *       }]
 *     }], [{
 *       medication: 'Different Medication',
 *       events: [{
 *         eventdate: '01/01/2016',
 *         type: 'START'
 *       }]
 *     }]
 *   ]
 * }
 *
 * There is significantly more data that gets returned, but for the purposes of resolving
 * medications, those are the pieces of the response that matter. Before anything, we must
 * sort the events by 'eventdate' and 'type'. Once we've accomplished this, we can then
 * determine which object in each array represents the most current record for a given
 * medication.
 *
 * Further comments below.
 */
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

// Sorts each sub-array within the returned `medications` array.
function sortMedicationResources(
  resourceA: IPatientMedicationResource,
  resourceB: IPatientMedicationResource,
): number {
  // First, sort the events for each medication object
  const resourceASortedEvents = resourceA.events.sort(sortMedicationEvents);
  const resourceBSortedEvents = resourceB.events.sort(sortMedicationEvents);

  const resourceALatestEventDate = new Date(resourceASortedEvents[0].eventdate);
  const resourceBLatestEventDate = new Date(resourceBSortedEvents[0].eventdate);

  // Then, sort based on the most recent event of each medication object
  return reverseCompareDates(resourceALatestEventDate, resourceBLatestEventDate);
}

// Sorts events based on both date and type
function sortMedicationEvents(
  eventA: IPatientMedicationEvent & IPatientMedication,
  eventB: IPatientMedicationEvent & IPatientMedication,
): number {
  const eventADate = new Date(eventA.eventdate || eventA.lastUpdated);
  const eventBDate = new Date(eventB.eventdate || eventB.lastUpdated);
  const dateComparison = reverseCompareDates(eventADate, eventBDate);

  // If the date alone resolves the sort order, move along
  if (dateComparison !== 0) {
    return dateComparison;
  } else {
    // Otherwise, sort based on type
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

// Sorts types based on a basic hierarchy. This will eventuall fall down, but works in most cases
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
