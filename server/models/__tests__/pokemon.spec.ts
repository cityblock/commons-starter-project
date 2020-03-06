// import axios from 'axios'
// import { Transaction } from 'objection';

import axios from 'axios';
import nock from 'nock';
import { transaction, Transaction } from 'objection';
import Pokemon from '../pokemon'
import { IPokemonCreateFields } from '../pokemon'
import { v4 as uuid } from 'uuid';
//import { IPaginatedResults } from '../../db';
//import { adminTasksConcernTitle } from '../../lib/consts';
import { setupDb } from '../../lib/test-utils';
// import {
//   createMockClinic,
//   createMockPhone,
//   createMockUser,
//   createPatient,
//   getDateOfBirthForAge,
//   getTasksForPatient,
//   mockGoogleCredentials,
//   setupPatientsForPanelFilter,
// } from '../../spec-helpers';
// import Address from '../address';
// import BaselineAssessmentCompletion from '../baseline-assessment-completion';
// import CareTeam from '../care-team';
// import Clinic from '../clinic';
// import ClinicPod from '../clinic-pod';
// import ClinicPodMember from '../clinic-pod-member';
// import ComputedPatientStatus from '../computed-patient-status';
// import Market from '../market';
// import OutreachAttempt from '../outreach-attempt';
// import Patient from '../patient';
// import PatientAcuity from '../patient-acuity';
// import PatientAddress from '../patient-address';
// import PatientClinicHistory from '../patient-clinic-history';
// import PatientConcern from '../patient-concern';
// import PatientDataFlag from '../patient-data-flag';
// import PatientDocument from '../patient-document';
// import PatientInfo from '../patient-info';
// import PatientPhone from '../patient-phone';
// import PatientProgramHistory from '../patient-program-history';
// import PatientState from '../patient-state';
// import Phone from '../phone';
// import TaskV1 from '../task-v1';
// import User from '../user';

//const userRole = 'Pharmacist' as UserRole;

//const geocodioUrl = 'https://api-hipaa.geocod.io/v1.4';
axios.defaults.adapter = require('axios/lib/adapters/http');

// interface ISetup {
//   clinic: Clinic;
//   market: Market;
// }

// async function setup(txn: Transaction): Promise<ISetup> {
//   const clinic = await Clinic.create(createMockClinic(), txn);
//   const market = await Market.findOrCreateNycMarket(txn);

//   return { clinic, market };
// }

// function createMockPokemon(pokemonData: IPokemonCreateFields) {
//   return {
//     name,
//     departmentId,
//   };
// }
/*************************create Pokemon */
// async function setupDb(txn: Transaction): Promise<Pokemon> {
//   const pokemon = {
//     id: uuid(),
//     pokemonNumber: 1,
//     name: "testPokedex",
//     attack: 30,
//     defense: 23,
//     pokeType: "dragon",
//     moves: ["Dragon Tail", "Aqua Tail"],
//     imageUrl: "https://cdn.bulbagarden.net/upload/9/93/148Dragonair.png"

//   }
//   return await Pokemon.create(pokemon, txn);
// }

// interface IPatientsSetup {
//   user: User;
//   patient1: Patient;
//   patient2: Patient;
//   market: Market;
//   testConfig: any;
//   clinic: Clinic;
// }

// interface IHccGapsSetup {
//   chp: User;
//   pcp: User;
//   patient: Patient;
//   hccGaps: string[];
//   outstandingTaskTitle: string;
//   followupTaskTitle: string;
//   market: Market;
//   testConfig: any;
// }

// interface IPatientAddressSetup {
//   market: Market;
// }

// async function patientsSetup(txn: Transaction): Promise<IPatientsSetup> {
//   const { clinic, market } = await setup(txn);
//   const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//   const patient1 = await createPatient(
//     {
//       cityblockId: 123,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       cohortName: 'House Targaryen',
//       firstName: 'merope',
//       lastName: 'gaunt',
//     },
//     txn,
//   );
//   const patient2 = await createPatient(
//     {
//       cityblockId: 234,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'MORFIN',
//       lastName: 'GAUNT',
//     },
//     txn,
//   );
//   const testConfig = mockGoogleCredentials();

//   return { user, patient1, patient2, market, clinic, testConfig };
// }

// async function consentedOrEnrolledPatientsSetup(txn: Transaction) {
//   const { clinic, market, user, patient1, patient2 } = await patientsSetup(txn);
//   const market2 = await Market.create({ name: 'market2' }, txn);

//   // assign consented or enrolled patient state to patient 1 and patient 2
//   await PatientState.updateForPatient(
//     {
//       patientId: patient1.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient2.id,
//       updatedById: user.id,
//       currentState: 'consented' as CurrentPatientState,
//     },
//     txn,
//   );

//   // create 2 more patients in consented and enrolled
//   const patient3 = await createPatient(
//     {
//       cityblockId: 135,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Alice',
//       lastName: 'Longbottom',
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient3.id,
//       updatedById: user.id,
//       currentState: 'consented' as CurrentPatientState,
//     },
//     txn,
//   );
//   const patient4 = await createPatient(
//     {
//       cityblockId: 136,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Frank',
//       lastName: 'Longbottom',
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient4.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );
//   const patient5 = await createPatient(
//     {
//       cityblockId: 137,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Madame',
//       lastName: 'Maxime',
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient5.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );

//   // create 1 patient in a different state
//   const patient6 = await createPatient(
//     {
//       cityblockId: 138,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Igor',
//       lastName: 'Karkaroff',
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient6.id,
//       updatedById: user.id,
//       currentState: 'reached' as CurrentPatientState,
//     },
//     txn,
//   );

//   // create 1 patient in a different market
//   const patient7 = await createPatient(
//     {
//       cityblockId: 139,
//       homeClinicId: clinic.id,
//       homeMarketId: market2.id,
//       firstName: 'Rubeus',
//       lastName: 'Hagrid',
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient7.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );

//   // add user to all patients' care teams BUT patient5
//   await CareTeam.create({ userId: user.id, patientId: patient1.id, marketId: market.id }, txn);
//   await CareTeam.create({ userId: user.id, patientId: patient2.id, marketId: market.id }, txn);
//   await CareTeam.create({ userId: user.id, patientId: patient3.id, marketId: market.id }, txn);
//   await CareTeam.create({ userId: user.id, patientId: patient4.id, marketId: market.id }, txn);
//   await CareTeam.create({ userId: user.id, patientId: patient6.id, marketId: market.id }, txn);
//   await CareTeam.create({ userId: user.id, patientId: patient7.id, marketId: market2.id }, txn);

//   return { clinic, market, user, patient1, patient2, patient3, patient4, patient5 };
// }

// const patientConsentedOrEnrolledFilterSetup = async (
//   user: User,
//   clinic: Clinic,
//   market: Market,
//   txn: Transaction,
// ) => {
//   // create another clinicPod
//   const clinicPod2 = await ClinicPod.create({ name: 'pod2', clinicId: clinic.id, id: uuid() }, txn);

//   // assign user to new clinicPod (NOTE: do this via insert since assignToClinicPod method deletes earlier entry)
//   await ClinicPodMember.query(txn).insert({ userId: user.id, clinicPodId: clinicPod2.id });

//   // create user3 and assign to clinicPod2
//   const user3 = await User.create(createMockUser(13, clinic.id, market.id, userRole), txn);
//   await ClinicPodMember.assignToClinicPod({ userId: user3.id, clinicPodId: clinicPod2.id }, txn);

//   // create user4 which is on a completely separate clinicPod4 (not a clinicPod that user1 is on)
//   const user4 = await User.create(createMockUser(14, clinic.id, market.id, userRole), txn);
//   const clinicPod3 = await ClinicPod.create({ name: 'pod3', clinicId: clinic.id, id: uuid() }, txn);
//   await ClinicPodMember.assignToClinicPod({ userId: user4.id, clinicPodId: clinicPod3.id }, txn);

//   // give patients enrolled state and assign them to user3 and user4, respectively
//   const patient6 = await createPatient(
//     {
//       cityblockId: 222,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Katniss',
//       lastName: 'Everdeen',
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient6.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );
//   await CareTeam.create({ userId: user3.id, patientId: patient6.id, marketId: market.id }, txn);

//   const patient7 = await createPatient(
//     {
//       cityblockId: 333,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Peeta',
//       lastName: 'Mellark',
//     },
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient7.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );
//   await CareTeam.create({ userId: user4.id, patientId: patient7.id, marketId: market.id }, txn);

//   return { user3, user4, patient6 };
// };

// async function patientAddressSetup(txn: Transaction): Promise<IPatientAddressSetup> {
//   const { clinic, market } = await setup(txn);
//   await createPatient(
//     { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id, zip: '22102' },
//     txn,
//   );
//   await createPatient(
//     { cityblockId: 234, homeClinicId: clinic.id, homeMarketId: market.id, zip: '10009' },
//     txn,
//   );
//   await createPatient(
//     { cityblockId: 235, homeClinicId: clinic.id, homeMarketId: market.id, zip: '10009' },
//     txn,
//   );

//   return { market };
// }

// interface ISearchSetup {
//   user: User;
//   jonSnow: Patient;
//   jonArryn: Patient;
//   market: Market;
// }

// async function searchSetup(txn: Transaction): Promise<ISearchSetup> {
//   const { clinic, market } = await setup(txn);
//   const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//   await createPatient(
//     {
//       cityblockId: 123,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Robb',
//       lastName: 'Stark',
//       zip: '10005',
//     },
//     txn,
//   );

//   const jonSnow = await createPatient(
//     {
//       cityblockId: 234,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Jon',
//       lastName: 'Snow',
//       userId: user.id,
//       zip: '10005',
//     },
//     txn,
//   );
//   const jonArryn = await createPatient(
//     {
//       cityblockId: 789,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Jon',
//       lastName: 'Arryn',
//       userId: user.id,
//       zip: '10005',
//     },
//     txn,
//   );
//   await createPatient(
//     {
//       cityblockId: 345,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Arya',
//       lastName: 'Stark',
//       userId: user.id,
//       zip: '10005',
//     },
//     txn,
//   );
//   await createPatient(
//     {
//       cityblockId: 456,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       firstName: 'Sansa',
//       lastName: 'Stark',
//       userId: user.id,
//       zip: '10005',
//     },
//     txn,
//   );
//   await PatientAcuity.updateForPatient(
//     { patientId: jonSnow.id, score: 1, updatedById: user.id, isRecommended: false },
//     txn,
//   );
//   await PatientAcuity.updateForPatient(
//     { patientId: jonArryn.id, score: 5, updatedById: user.id, isRecommended: false },
//     txn,
//   );
//   await PatientAcuity.updateForPatient(
//     { patientId: jonSnow.id, score: 4, updatedById: user.id, isRecommended: false },
//     txn,
//   );

//   return { user, jonSnow, jonArryn, market };
// }

// async function hccGapsSetup(txn: Transaction): Promise<IHccGapsSetup> {
//   const { clinic, market } = await setup(txn);
//   const pcp = await User.create(
//     createMockUser(11, clinic.id, market.id, 'Physician' as UserRole),
//     txn,
//   );
//   const chp = await User.create(
//     createMockUser(12, clinic.id, market.id, 'Community_Health_Partner' as UserRole),
//     txn,
//   );
//   const patient = await createPatient(
//     { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id },
//     txn,
//   );
//   const hccGaps = ['gap 1', 'gap 2', 'gap 3'];
//   const outstandingTaskTitle = `Assess member for potential chronic conditions (July)`;
//   const followupTaskTitle = `Schedule health maintenance visit with Cityblock MD or NP`;
//   const testConfig = mockGoogleCredentials();

//   return {
//     pcp,
//     chp,
//     patient,
//     hccGaps,
//     outstandingTaskTitle,
//     followupTaskTitle,
//     market,
//     testConfig,
//   };
// }

// interface IPatientStateSetup {
//   patient1: Patient;
//   patient2: Patient;
//   patientOutOfMarket: Patient;
//   patientNotConsented: Patient;
//   user: User;
//   market: Market;
//   clinic: Clinic;
//   phoneHome1: Phone;
//   phoneHome2: Phone;
//   phoneHome3: Phone;
//   phoneMobile1: Phone;
//   phoneMobile2: Phone;
//   phoneMobile3: Phone;
//   address: Address;
//   address2: Address;
// }

// async function patientStateSetup(txn: Transaction): Promise<IPatientStateSetup> {
//   const { clinic, market } = await setup(txn);
//   const { patient1, patient2, user } = await patientsSetup(txn);
//   const market2 = await Market.create({ name: 'new-market' }, txn);
//   const patientOutOfMarket = await createPatient(
//     {
//       cityblockId: 125,
//       homeClinicId: clinic.id,
//       homeMarketId: market2.id,
//       cohortName: 'House Targaryen',
//       firstName: 'antioch',
//       lastName: 'peverell',
//     },
//     txn,
//   );
//   const patientNotConsented = await createPatient(
//     {
//       cityblockId: 126,
//       homeClinicId: clinic.id,
//       homeMarketId: market.id,
//       cohortName: 'House Targaryen',
//       firstName: 'LUNA',
//       lastName: 'LOVEGOOD',
//     },
//     txn,
//   );
//   const phoneMobile1 = await Phone.create(
//     createMockPhone('223-456-1111', 'mobile' as PhoneTypeOptions),
//     txn,
//   );
//   const phoneHome1 = await Phone.create(
//     createMockPhone('223-456-2222', 'home' as PhoneTypeOptions),
//     txn,
//   );
//   const phoneMobile2 = await Phone.create(
//     createMockPhone('223-456-3333', 'mobile' as PhoneTypeOptions),
//     txn,
//   );
//   const phoneHome2 = await Phone.create(
//     createMockPhone('223-456-4444', 'home' as PhoneTypeOptions),
//     txn,
//   );
//   const phoneMobile3 = await Phone.create(
//     createMockPhone('223-456-5555', 'mobile' as PhoneTypeOptions),
//     txn,
//   );
//   const phoneHome3 = await Phone.create(
//     createMockPhone('223-456-6666', 'home' as PhoneTypeOptions),
//     txn,
//   );
//   const address = await Address.create(
//     { updatedById: user.id, zip: '01854', street1: 'School St', state: 'MA', city: 'Lowell' },
//     txn,
//   );
//   const address2 = await Address.create(
//     { updatedById: user.id, zip: '22102', street1: 'Random Ct', state: 'VA' },
//     txn,
//   );
//   // associate first patient with phones, address and patient-state consented
//   await PatientPhone.create({ patientId: patient1.id, phoneId: phoneMobile1.id }, txn);
//   await PatientPhone.create({ patientId: patient1.id, phoneId: phoneHome1.id }, txn);
//   await PatientAddress.create({ addressId: address.id, patientId: patient1.id }, txn);
//   await PatientInfo.edit(
//     { updatedById: user.id, primaryPhoneId: phoneMobile1.id, primaryAddressId: address.id },
//     patient1.patientInfo.id,
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient1.id,
//       updatedById: user.id,
//       currentState: 'consented' as CurrentPatientState,
//     },
//     txn,
//   );
//   // associate second patient with phones, and patient-state enrolled
//   await PatientPhone.create({ patientId: patient2.id, phoneId: phoneMobile2.id }, txn);
//   await PatientPhone.create({ patientId: patient2.id, phoneId: phoneHome2.id }, txn);
//   await PatientAddress.create({ addressId: address.id, patientId: patient2.id }, txn);
//   await PatientInfo.edit(
//     { updatedById: user.id, primaryPhoneId: phoneHome2.id, primaryAddressId: address.id },
//     patient2.patientInfo.id,
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patient2.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );
//   // associate third patient with phones, and patient-state enrolled
//   await PatientPhone.create({ patientId: patientOutOfMarket.id, phoneId: phoneMobile3.id }, txn);
//   await PatientPhone.create({ patientId: patientOutOfMarket.id, phoneId: phoneHome3.id }, txn);
//   await PatientAddress.create({ addressId: address2.id, patientId: patientOutOfMarket.id }, txn);
//   await PatientInfo.edit(
//     { updatedById: user.id, primaryPhoneId: phoneHome3.id, primaryAddressId: address2.id },
//     patientOutOfMarket.patientInfo.id,
//     txn,
//   );
//   await PatientState.updateForPatient(
//     {
//       patientId: patientOutOfMarket.id,
//       updatedById: user.id,
//       currentState: 'enrolled' as CurrentPatientState,
//     },
//     txn,
//   );

//   return {
//     patient1,
//     patient2,
//     patientOutOfMarket,
//     patientNotConsented,
//     user,
//     market,
//     clinic,
//     phoneHome1,
//     phoneHome2,
//     phoneHome3,
//     phoneMobile1,
//     phoneMobile2,
//     phoneMobile3,
//     address,
//     address2,
//   };
// }
//*********************************************************************************************************** */
function createTestPokemon(/**pokemon attributes, txn */) {
  /*1.pokemon attributes either from input or on the fly
  2. return await Pokemin.create(attributes from step1, txn) */
}
describe('pokemon model', () => {
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupDb();
    axios.get = jest.fn();
  })

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
    console.error = jest.fn();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('getAll', () => {
    it('should retrieve all pokemons', async () => {
      const allPokemons = await Pokemon.getAll(txn);
      expect(allPokemons).toHaveLength(52);
      //console.log("all Pokemons", allPokemons)
    });
  });

  describe('get', () => {
    it('should create and retrieve a pokemin', async () => {
      const pokemon = await createTestPokemon(
        { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id },
        txn,
      );
      expect(pokemon).toMatchObject({

      });
      // const patientById = await Patient.get(patient.id, patient.homeMarketId, txn);
      // expect(patientById).toMatchObject({
      //   id: patient.id,
      // });
    });
  }

})
//*********************************************************************************************************** */

// describe('patient model', () => {
//   let testDb: ReturnType<typeof setupDb>;
//   let txn: Transaction;

//   beforeAll(async () => {
//     testDb = setupDb();
//     axios.get = jest.fn();
//     nock(geocodioUrl)
//       .persist()
//       .get(/geocode/)
//       .reply(200, {
//         results: [
//           {
//             location: {
//               lat: 123,
//               lng: 456,
//             },
//           },
//         ],
//       });
//   });

//   afterAll(async () => {
//     await testDb.destroy();
//   });

//   beforeEach(async () => {
//     txn = await transaction.start(Patient.knex());
//     console.error = jest.fn();
//   });

//   afterEach(async () => {
//     await txn.rollback();
//   });

//   describe('lazyGet', () => {
//     it('should retrieve a patient', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await createPatient(
//         { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id },
//         txn,
//       );
//       const patientById = await Patient.lazyGet(patient.id, txn);
//       expect(patientById).toMatchObject({
//         id: patient.id,
//       });
//     });
//   });

//   describe('get', () => {
//     it('should create and retrieve a patient', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await createPatient(
//         { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id },
//         txn,
//       );
//       expect(patient).toMatchObject({
//         id: patient.id,
//       });
//       const patientById = await Patient.get(patient.id, patient.homeMarketId, txn);
//       expect(patientById).toMatchObject({
//         id: patient.id,
//       });
//     });

//     it('should not create a user with an invalid clinic id', async () => {
//       const fakeClinicId = uuid();
//       const fakeMarketId = uuid();
//       const message = `Key (homeClinicId)=(${fakeClinicId}) is not present in table "clinic".`;

//       await createPatient(
//         { cityblockId: 11, homeClinicId: fakeClinicId, homeMarketId: fakeMarketId },
//         txn,
//       ).catch(e => {
//         expect(e.detail).toEqual(message);
//       });
//     });

//     it('should throw an error if a patient does not exist for the id', async () => {
//       const fakeId = uuid();
//       const fakeMarketId = uuid();
//       await expect(Patient.get(fakeId, fakeMarketId, txn)).rejects.toMatch(
//         `No such patient: ${fakeId}`,
//       );
//     });

//     it('should contain enrollmentSource and default to planPartner', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await createPatient(
//         { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id },
//         txn,
//       );
//       expect(patient).toMatchObject({
//         enrollmentSource: 'planPartner',
//       });
//     });
//   });

//   describe('getById', () => {
//     it('should retrieve a patient by id', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await createPatient(
//         { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id },
//         txn,
//       );
//       const fetchedPatient = await Patient.getById(patient.id, patient.homeMarketId, txn);

//       expect(fetchedPatient).toMatchObject(patient);
//     });

//     it('should return null when getting a patient by an unknown id', async () => {
//       const fetchedPatient = await Patient.getById(uuid(), uuid(), txn);

//       expect(fetchedPatient).toBeNull();
//     });
//   });

//   describe('create', () => {
//     it('should create a patient', async () => {
//       const { clinic, market } = await setup(txn);
//       const birthday = new Date('02/02/1902');
//       const patientUuid = uuid();
//       const patient = await Patient.create(
//         {
//           patientId: patientUuid,
//           cityblockId: 123456,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );

//       expect(patient).toMatchObject({
//         id: patientUuid,
//         firstName: 'first',
//         middleName: 'middle',
//         lastName: 'last',
//         dateOfBirth: birthday,
//       });
//     });

//     it('should give the patient an initial patient info, adddress, email, and phone', async () => {
//       const { clinic, market } = await setup(txn);
//       const patientUuid = uuid();
//       const patient = await Patient.create(
//         {
//           patientId: patientUuid,
//           cityblockId: 123456,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '+19102221234',
//           email: 'patient@email.com',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );

//       expect(patient.patientInfo.gender).toEqual('female');
//       expect(patient.patientInfo.primaryAddress.street1).toEqual('1 Main St');
//       expect(patient.patientInfo.primaryEmail.emailAddress).toEqual('patient@email.com');
//       expect(patient.patientInfo.primaryPhone.phoneNumber).toEqual('+19102221234');
//     });

//     it('should give the patient an administrative tasks concern', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await Patient.create(
//         {
//           patientId: uuid(),
//           cityblockId: 12345,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       const patientConcerns = await PatientConcern.getForPatient(patient.id, false, txn);

//       expect(patientConcerns.length).toEqual(1);
//       expect(patientConcerns[0].concern.title).toEqual(adminTasksConcernTitle);
//     });

//     it('should create the initial ComputedPatientStatus', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await Patient.create(
//         {
//           patientId: uuid(),
//           cityblockId: 123459,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'male' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

//       expect(computedPatientStatus).not.toBeNull();
//     });

//     it('should create the initial PatientState', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await Patient.create(
//         {
//           patientId: uuid(),
//           cityblockId: 123450,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'male' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       const patientState = await PatientState.getForPatient(patient.id, txn);

//       expect(patientState).not.toBeNull();
//       expect(patientState!.currentState).toEqual('attributed');
//     });

//     it('should create a PatientClinicHistory record for the home clinic', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await Patient.create(
//         {
//           patientId: uuid(),
//           cityblockId: 123450,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'male' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       const patientClinicHistoryRecords = await PatientClinicHistory.query(txn).where({
//         patientId: patient.id,
//         clinicId: clinic.id,
//         deletedAt: null,
//       });
//       expect(patientClinicHistoryRecords).toHaveLength(1);
//     });

//     it('should create a BaselineAssessmentCompletion record', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await Patient.create(
//         {
//           patientId: uuid(),
//           cityblockId: 123450,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'male' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );

//       const baselineAssessmentCompletion = await BaselineAssessmentCompletion.getForPatient(
//         patient.id,
//         txn,
//       );
//       expect(baselineAssessmentCompletion).toMatchObject({
//         patientId: patient.id,
//       });
//     });

//     it('should create a PatientProgramHistory record for the passed in programName', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await Patient.create(
//         {
//           patientId: uuid(),
//           cityblockId: 123450,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'male' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           programName: 'program 1',
//         },
//         txn,
//       );
//       const patientProgramHistoryRecords = await PatientProgramHistory.query(txn).where({
//         patientId: patient.id,
//         programName: 'program 1',
//         deletedAt: null,
//       });
//       expect(patientProgramHistoryRecords).toHaveLength(1);
//     });
//   });

//   describe('updateFromClinicalInformationUpdate', () => {
//     it('should update a patient with new clinical information', async () => {
//       const { clinic, market } = await setup(txn);
//       const patientId = uuid();
//       await Patient.create(
//         {
//           patientId,
//           cityblockId: 123452,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/03/1903',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123321',
//           mrn: null,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000001',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       const fetchedPatient = await Patient.get(patientId, market.id, txn);
//       expect(fetchedPatient.mrn).toBeNull();

//       await Patient.updateFromClinicalInformationUpdate(patientId, { mrn: '3214321' }, txn);
//       const refetchedPatient = await Patient.get(patientId, market.id, txn);
//       expect(refetchedPatient.mrn).toEqual('3214321');
//     });
//   });

//   describe('updateFromAttribution', () => {
//     it('should update a patient', async () => {
//       const { clinic, market } = await setup(txn);
//       const birthday = new Date('02/02/1902');
//       const patientId = uuid();
//       const patient = await Patient.create(
//         {
//           patientId,
//           cityblockId: 123451,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );

//       expect(patient).toMatchObject({
//         id: patientId,
//         firstName: 'first',
//         middleName: 'middle',
//         lastName: 'last',
//         dateOfBirth: birthday,
//       });

//       await Patient.updateFromAttribution(
//         {
//           patientId,
//           firstName: 'New First Name',
//           lastName: patient.lastName,
//           dateOfBirth: '02/02/1902',
//           ssn: patient.ssn,
//           ssnEnd: patient.ssnEnd,
//           nmi: patient.nmi,
//           mrn: patient.mrn,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           newData: true,
//         },
//         txn,
//       );

//       const fetchedPatient = await Patient.get(patient.id, market.id, txn);
//       expect(fetchedPatient.firstName).toEqual('New First Name');
//     });

//     it('should clear any PatientDataFlags', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//       const patientId = uuid();
//       const patient = await Patient.create(
//         {
//           patientId,
//           cityblockId: 123452,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       await PatientDataFlag.create(
//         { patientId, userId: user.id, fieldName: 'firstName' as DataFlagOptions },
//         txn,
//       );

//       const patientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);
//       expect(patientDataFlags.length).toEqual(1);

//       await Patient.updateFromAttribution(
//         {
//           patientId,
//           firstName: 'A Change That Does Not Matter',
//           lastName: patient.lastName,
//           dateOfBirth: '02/02/1902',
//           ssn: patient.ssn,
//           ssnEnd: patient.ssnEnd,
//           nmi: patient.nmi,
//           mrn: patient.mrn,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           newData: true,
//         },
//         txn,
//       );

//       const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);
//       expect(refetchedPatientDataFlags.length).toEqual(0);
//     });

//     it('should reset core identity verification', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//       const patientId = uuid();
//       await Patient.create(
//         {
//           patientId,
//           cityblockId: 123458,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       await Patient.coreIdentityVerify(patientId, user.id, market.id, txn);

//       const patient = await Patient.get(patientId, market.id, txn);
//       expect(patient.coreIdentityVerifiedById).toEqual(user.id);
//       expect(patient.coreIdentityVerifiedAt).not.toBeNull();

//       await Patient.updateFromAttribution(
//         {
//           patientId,
//           firstName: 'A Change That Does Not Matter',
//           lastName: patient.lastName,
//           dateOfBirth: '02/02/1902',
//           ssn: patient.ssn,
//           ssnEnd: patient.ssnEnd,
//           nmi: patient.nmi,
//           mrn: patient.mrn,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           newData: true,
//         },
//         txn,
//       );

//       const refetchedPatient = await Patient.get(patientId, market.id, txn);
//       expect(refetchedPatient.coreIdentityVerifiedById).toBeNull();
//       expect(refetchedPatient.coreIdentityVerifiedAt).toBeNull();
//     });

//     it('should update ComputedPatientStatus', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//       const patientId = uuid();
//       const patient = await Patient.create(
//         {
//           patientId,
//           cityblockId: 123411,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       await Patient.coreIdentityVerify(patientId, user.id, market.id, txn);

//       await ComputedPatientStatus.updateForPatient(patientId, user.id, txn);
//       const computedPatientStatus = await ComputedPatientStatus.getForPatient(patientId, txn);
//       expect(computedPatientStatus!.isCoreIdentityVerified).toEqual(true);

//       await Patient.updateFromAttribution(
//         {
//           patientId,
//           firstName: 'A Change That Does Not Matter',
//           lastName: patient.lastName,
//           dateOfBirth: '02/02/1902',
//           ssn: patient.ssn,
//           ssnEnd: patient.ssnEnd,
//           nmi: patient.nmi,
//           mrn: patient.mrn,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           newData: true,
//         },
//         txn,
//       );

//       const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
//         patientId,
//         txn,
//       );
//       expect(refetchedComputedPatientStatus!.isCoreIdentityVerified).toEqual(false);
//     });

//     it('should not reset core identity verification when newData is false', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//       const patientId = uuid();
//       await Patient.create(
//         {
//           patientId,
//           cityblockId: 123458,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       await Patient.coreIdentityVerify(patientId, user.id, market.id, txn);

//       const patient = await Patient.get(patientId, market.id, txn);
//       expect(patient.coreIdentityVerifiedById).toEqual(user.id);
//       expect(patient.coreIdentityVerifiedAt).not.toBeNull();

//       await Patient.updateFromAttribution(
//         {
//           patientId,
//           firstName: 'A Change That Does Not Matter',
//           lastName: patient.lastName,
//           dateOfBirth: '02/02/1902',
//           ssn: patient.ssn,
//           ssnEnd: patient.ssnEnd,
//           nmi: patient.nmi,
//           mrn: patient.mrn,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           newData: false,
//         },
//         txn,
//       );

//       const refetchedPatient = await Patient.get(patientId, market.id, txn);
//       expect(refetchedPatient.coreIdentityVerifiedById).not.toBeNull();
//       expect(refetchedPatient.coreIdentityVerifiedById).toEqual(patient.coreIdentityVerifiedById);
//       expect(refetchedPatient.coreIdentityVerifiedAt).not.toBeNull();
//     });

//     it('should not clear any PatientDataFlags when newData is false', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//       const patientId = uuid();
//       const patient = await Patient.create(
//         {
//           patientId,
//           cityblockId: 123452,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//         },
//         txn,
//       );
//       await PatientDataFlag.create(
//         { patientId, userId: user.id, fieldName: 'firstName' as DataFlagOptions },
//         txn,
//       );

//       const patientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);
//       expect(patientDataFlags.length).toEqual(1);

//       await Patient.updateFromAttribution(
//         {
//           patientId,
//           firstName: 'A Change That Does Not Matter',
//           lastName: patient.lastName,
//           dateOfBirth: '02/02/1902',
//           ssn: patient.ssn,
//           ssnEnd: patient.ssnEnd,
//           nmi: patient.nmi,
//           mrn: patient.mrn,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           newData: false,
//         },
//         txn,
//       );

//       const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);
//       expect(refetchedPatientDataFlags.length).toEqual(1);
//     });

//     it('should create a new PatientProgramHistory record if required', async () => {
//       const { clinic, market } = await setup(txn);
//       const patientId = uuid();
//       const patient = await Patient.create(
//         {
//           patientId,
//           cityblockId: 123451,
//           firstName: 'first',
//           middleName: 'middle',
//           lastName: 'last',
//           dateOfBirth: '02/02/1902',
//           ssn: '123456789',
//           ssnEnd: '6789',
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           gender: 'female' as Gender,
//           language: 'english',
//           addressLine1: '1 Main St',
//           addressLine2: '',
//           city: 'New York',
//           state: 'NY',
//           zip: '11211',
//           phone: '',
//           email: '',
//           nmi: '123123',
//           mrn: '12345',
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           medicareId: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           programName: 'program 1',
//         },
//         txn,
//       );

//       await Patient.updateFromAttribution(
//         {
//           patientId,
//           firstName: 'New First Name',
//           lastName: patient.lastName,
//           dateOfBirth: '02/02/1902',
//           ssn: patient.ssn,
//           ssnEnd: patient.ssnEnd,
//           nmi: patient.nmi,
//           mrn: patient.mrn,
//           productDescription: 'something',
//           lineOfBusiness: 'HMO',
//           medicaidId: null,
//           medicaidPremiumGroup: null,
//           pcpName: null,
//           pcpPractice: null,
//           pcpPhone: null,
//           pcpAddress: null,
//           memberId: 'K000000',
//           insurance: 'Company A',
//           inNetwork: false,
//           newData: true,
//           programName: 'program 2',
//         },
//         txn,
//       );

//       const patientProgramHistoryRecords = await PatientProgramHistory.query(txn).where({
//         patientId: patient.id,
//         programName: 'program 2',
//         deletedAt: null,
//       });
//       expect(patientProgramHistoryRecords).toHaveLength(1);
//     });
//   });

//   describe('coreIdentityVerify', () => {
//     it('updates the computedPatientStatus', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);
//       const patient = await createPatient(
//         { cityblockId: 987, homeClinicId: clinic.id, homeMarketId: market.id },
//         txn,
//       );
//       const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

//       expect(computedPatientStatus!.isCoreIdentityVerified).toEqual(false);

//       await Patient.coreIdentityVerify(patient.id, user.id, market.id, txn);
//       const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
//         patient.id,
//         txn,
//       );

//       expect(refetchedComputedPatientStatus!.isCoreIdentityVerified).toEqual(true);
//     });
//   });

//   describe('patients', () => {
//     it('should fetch patients', async () => {
//       const { patient1, patient2, market } = await patientsSetup(txn);
//       const patients = await Patient.getAll(market.id, { pageNumber: 0, pageSize: 10 }, txn);
//       expect(patients.results).toContainEqual(patient1);
//       expect(patients.results).toContainEqual(patient2);
//     });

//     it('should fetch all patient ids', async () => {
//       const { patient1, patient2 } = await patientsSetup(txn);
//       const patientIds = await Patient.getAllIds(txn);

//       expect(patientIds.length).toEqual(2);
//       expect(patientIds).toContain(patient1.id);
//       expect(patientIds).toContain(patient2.id);
//     });

//     it('should fetch a limited set of patients', async () => {
//       const { market } = await patientsSetup(txn);

//       const page0 = await Patient.getAll(market.id, { pageNumber: 0, pageSize: 1 }, txn);
//       const page1 = await Patient.getAll(market.id, { pageNumber: 1, pageSize: 1 }, txn);

//       expect(page0.results.length).toEqual(1);
//       expect(page0.total).toEqual(2);
//       expect(page1.results.length).toEqual(1);
//       expect(page1.total).toEqual(2);

//       expect(page0.results[0].id).not.toEqual(page1.results[0].id);
//     });
//   });

//   describe('getPatientPanel', () => {
//     it('returns results for city Manhattan', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { city: ['Manhattan'] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );
//       expect(patientResults.total).toBe(2);
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({ firstName: 'Maxie', lastName: 'Jacobs' }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({ firstName: 'Mark', lastName: 'Man' }),
//       );
//     });

//     it('returns results for cities Manhattan and Brooklyn', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { city: ['Manhattan', 'Brooklyn'] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );

//       expect(patientResults.total).toBe(4);
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({ firstName: 'Robb', lastName: 'Stark' }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({ firstName: 'Mark', lastName: 'Man' }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({ firstName: 'Maxie', lastName: 'Jacobs' }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({ firstName: 'Jane', lastName: 'Jacobs' }),
//       );
//     });

//     it('returns no results for city San Francisco', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { city: ['San Francisco'] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );
//       expect(patientResults.total).toBe(0);
//     });

//     it('returns single result for zip code 10001', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { zip: ['10001'] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Mark',
//             lastName: 'Man',
//             patientInfo: {
//               gender: 'male' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '10001',
//               },
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns two results for zip code 11211 for first user', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { zip: ['11211'] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );
//       expect(patientResults.total).toBe(2);
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Robb',
//           lastName: 'Stark',
//         }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Jane',
//           lastName: 'Jacobs',
//         }),
//       );
//     });

//     it('returns three results for zip codes 10001 and 11211 for first user', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { zip: ['10001', '11211'] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );
//       expect(patientResults.total).toBe(3);
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Robb',
//           lastName: 'Stark',
//         }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Jane',
//           lastName: 'Jacobs',
//         }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Mark',
//           lastName: 'Man',
//         }),
//       );
//     });

//     it('returns single result age range 19 and under', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { ageMin: [null] as any[], ageMax: [19] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Robb',
//             lastName: 'Stark',
//             patientInfo: {
//               gender: 'male' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '11211',
//               },
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns two results for age range 20 to 24', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { ageMin: [20], ageMax: [24] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );
//       expect(patientResults.total).toBe(2);
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Maxie',
//           lastName: 'Jacobs',
//         }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Jane',
//           lastName: 'Jacobs',
//         }),
//       );
//     });

//     it('returns single result age range 80 and older', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { ageMin: [80], ageMax: [null] as any[] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Mark',
//             lastName: 'Man',
//             patientInfo: {
//               gender: 'male' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '10001',
//               },
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns two results age range 19 and under or 80 and older', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { ageMin: [null, 80] as any[], ageMax: [19, null] as any[] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Robb',
//             lastName: 'Stark',
//             patientInfo: {
//               gender: 'male' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '11211',
//               },
//             },
//           },
//           {
//             firstName: 'Mark',
//             lastName: 'Man',
//             patientInfo: {
//               gender: 'male' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '10001',
//               },
//             },
//           },
//         ],
//         total: 2,
//       });
//     });

//     it('returns single result for second user and no filters', async () => {
//       const { user2, market } = await setupPatientsForPanelFilter(txn);
//       expect(
//         await Patient.getPatientPanel(
//           user2.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           {},
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Juanita',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '11211',
//               },
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns two results for female gender', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { gender: ['female' as Gender] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );
//       expect(patientResults.total).toBe(2);
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Maxie',
//           lastName: 'Jacobs',
//         }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Jane',
//           lastName: 'Jacobs',
//         }),
//       );
//     });

//     it('returns single result for female in zip code 11211', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { gender: ['female' as Gender], zip: ['11211'] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Jane',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '11211',
//               },
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns two results for female and male in zip code 11211', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);

//       const patientResults = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { gender: ['female' as Gender, 'male' as Gender], zip: ['11211'] },
//         false,
//         { orderBy: 'createdAt', order: 'asc' },
//         txn,
//       );

//       expect(patientResults.total).toBe(2);
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Robb',
//           lastName: 'Stark',
//         }),
//       );
//       expect(patientResults.results).toContainEqual(
//         expect.objectContaining({
//           firstName: 'Jane',
//           lastName: 'Jacobs',
//         }),
//       );
//     });

//     it('returns single result for female in zip code 11211 and age between 19 and 30', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { gender: ['female' as Gender], zip: ['11211'], ageMin: [19], ageMax: [30] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Jane',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//               primaryAddress: {
//                 zip: '11211',
//               },
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns a single result when filtering on careWorkerId', async () => {
//       const { user, user3, patient5, market, testConfig } = await setupPatientsForPanelFilter(txn);
//       await CareTeam.create(
//         { patientId: patient5.id, userId: user.id, marketId: market.id },
//         txn,
//         testConfig,
//       );
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { careWorkerId: [user3.id] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Juanita',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns a single result when filtering for enrolled patient status', async () => {
//       const { user, user3, patient5, market, testConfig } = await setupPatientsForPanelFilter(txn);
//       await CareTeam.create(
//         { patientId: patient5.id, userId: user.id, marketId: market.id },
//         txn,
//         testConfig,
//       );
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { careWorkerId: [user3.id], patientState: ['enrolled' as CurrentPatientState] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Juanita',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns two results when filtering for enrolled or contact_attempted patient status', async () => {
//       const { user, patient5, market, testConfig } = await setupPatientsForPanelFilter(txn);
//       await CareTeam.create(
//         { patientId: patient5.id, userId: user.id, marketId: market.id },
//         txn,
//         testConfig,
//       );
//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           {
//             patientState: [
//               'enrolled' as CurrentPatientState,
//               'contact_attempted' as CurrentPatientState,
//             ],
//           },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Jane',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//             },
//           },
//           {
//             firstName: 'Juanita',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//             },
//           },
//         ],
//         total: 2,
//       });
//     });

//     it('returns patients for a specific cohort', async () => {
//       const { user, patient5, market, testConfig } = await setupPatientsForPanelFilter(txn);
//       await CareTeam.create(
//         { patientId: patient5.id, userId: user.id, marketId: market.id },
//         txn,
//         testConfig,
//       );

//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { cohortName: ['Beyond the Wall'] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Juanita',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('returns patients for a specific acuity rank', async () => {
//       const { user, patient5, market, testConfig } = await setupPatientsForPanelFilter(txn);
//       await CareTeam.create(
//         { patientId: patient5.id, userId: user.id, marketId: market.id },
//         txn,
//         testConfig,
//       );

//       expect(
//         await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { acuityRank: [13] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         ),
//       ).toMatchObject({
//         results: [
//           {
//             firstName: 'Juanita',
//             lastName: 'Jacobs',
//             patientInfo: {
//               gender: 'female' as Gender,
//               language: 'en',
//             },
//           },
//         ],
//         total: 1,
//       });
//     });

//     it('sorts patient by name if specified', async () => {
//       const { user, market } = await searchSetup(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { zip: ['10005'] },
//         false,
//         { orderBy: 'name', order: 'asc' },
//         txn,
//       );
//       expect(patientPanel.results.length).toEqual(4);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { firstName: 'Arya', lastName: 'Stark' },
//           { firstName: 'Jon', lastName: 'Arryn' },
//           { firstName: 'Jon', lastName: 'Snow' },
//           { firstName: 'Sansa', lastName: 'Stark' },
//         ],
//       });
//     });

//     it('sorts patients by acuity if specified with high acuity first', async () => {
//       const { user, market } = await searchSetup(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'acuity', order: 'asc' },
//         txn,
//       );
//       expect(patientPanel.results.length).toBe(4);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { firstName: 'Jon', lastName: 'Arryn' },
//           { firstName: 'Jon', lastName: 'Snow' },
//           { firstName: 'Arya', lastName: 'Stark' },
//           { firstName: 'Sansa', lastName: 'Stark' },
//         ],
//       });
//     });

//     it('sorts patients by acuity if specified with low acuity first', async () => {
//       const { user, market } = await searchSetup(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'acuity', order: 'desc' },
//         txn,
//       );
//       expect(patientPanel.results.length).toBe(4);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { firstName: 'Jon', lastName: 'Snow' },
//           { firstName: 'Jon', lastName: 'Arryn' },
//           { firstName: 'Arya', lastName: 'Stark' },
//           { firstName: 'Sansa', lastName: 'Stark' },
//         ],
//       });
//     });

//     it('sorts patient by status in descending order if specified', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'status', order: 'desc' },
//         txn,
//       );

//       expect(patientPanel.results.length).toEqual(4);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { patientState: { currentState: 'contact_attempted' } },
//           { patientState: { currentState: 'consented' } },
//           { patientState: { currentState: 'assigned' } },
//           { patientState: { currentState: 'assigned' } },
//         ],
//       });
//     });

//     it('filters patients by single acuity score if specified', async () => {
//       const { user, market } = await searchSetup(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { patientAcuity: [5] },
//         false,
//         {},
//         txn,
//       );
//       expect(patientPanel.results.length).toBe(1);
//       expect(patientPanel).toMatchObject({
//         results: [{ firstName: 'Jon', lastName: 'Arryn' }],
//       });
//     });

//     it('filters patients by multiple acuity scores if specified', async () => {
//       const { user, market } = await searchSetup(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         { patientAcuity: [5, 4] },
//         false,
//         {},
//         txn,
//       );
//       expect(patientPanel.results.length).toBe(2);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { firstName: 'Jon', lastName: 'Snow' },
//           { firstName: 'Jon', lastName: 'Arryn' },
//         ],
//       });
//     });

//     it('sorts patient by status in ascending order if specified', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'status', order: 'asc' },
//         txn,
//       );

//       expect(patientPanel.results.length).toEqual(4);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { patientState: { currentState: 'assigned' } },
//           { patientState: { currentState: 'assigned' } },
//           { patientState: { currentState: 'consented' } },
//           { patientState: { currentState: 'contact_attempted' } },
//         ],
//       });
//     });

//     it('sorts patient by zipcode if specified', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'zip', order: 'asc' },
//         txn,
//       );

//       expect(patientPanel.results.length).toEqual(4);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { patientInfo: { primaryAddress: { zip: '10001' } } },
//           { patientInfo: { primaryAddress: { zip: '10055' } } },
//           { patientInfo: { primaryAddress: { zip: '11211' } } },
//           { patientInfo: { primaryAddress: { zip: '11211' } } },
//         ],
//         total: 4,
//       });
//     });

//     it('sorts patient by age if specified', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'age', order: 'asc' },
//         txn,
//       );

//       expect(patientPanel.results.length).toEqual(4);
//       expect(patientPanel).toMatchObject({
//         results: [
//           { dateOfBirth: new Date(getDateOfBirthForAge(80)) },
//           { dateOfBirth: new Date(getDateOfBirthForAge(23)) },
//           { dateOfBirth: new Date(getDateOfBirthForAge(20)) },
//           { dateOfBirth: new Date(getDateOfBirthForAge(19)) },
//         ],
//         total: 4,
//       });
//     });

//     it('sorts patient by last attempt if specified', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'lastAttempt', order: 'asc' },
//         txn,
//       );

//       expect(patientPanel.results.length).toEqual(4);
//       // NOTE: The test helper creates the Jan 3rd outreach before a Jan 1 attempt
//       // The Jan 3 number here is important to ensure we only save the latest attemptedAt
//       expect(patientPanel).toMatchObject({
//         results: [
//           { outreachLastAttemptedAt: new Date('January 3, 2018') },
//           { outreachLastAttemptedAt: new Date('March 5, 2018') },
//           { outreachLastAttemptedAt: new Date('November 22, 2018') },
//           { outreachLastAttemptedAt: null },
//         ],
//         total: 4,
//       });
//     });

//     it('sorts patient by outcome if specified', async () => {
//       const { user, market } = await setupPatientsForPanelFilter(txn);
//       const patientPanel = await Patient.getPatientPanel(
//         user.id,
//         market.id,
//         { pageNumber: 0, pageSize: 10 },
//         {},
//         false,
//         { orderBy: 'outcome', order: 'asc' },
//         txn,
//       );

//       expect(patientPanel.results.length).toEqual(4);
//       // NOTE: The test helper creates scheduledAppointment outreach before the backdated wrongNumber types attempt
//       // The scheduledAppointment outcome is important here for the 1st patient
//       expect(patientPanel).toMatchObject({
//         results: [
//           { outreachLastOutcome: 'consented' },
//           { outreachLastOutcome: 'interested' },
//           { outreachLastOutcome: 'scheduledAppointment' },
//           { outreachLastOutcome: null },
//         ],
//         total: 4,
//       });
//     });

//     describe('with permissions that do not allow filtering entire patient panel', () => {
//       it('still only returns results from care team when showAllMembers is true', async () => {
//         const { user, market } = await setupPatientsForPanelFilter(txn);
//         const patients = await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { gender: ['female' as Gender] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         );
//         expect(patients.total).toEqual(2);
//       });
//     });

//     describe('with permissions that allow filtering entire patient panel', () => {
//       it('returns results from all members when showAllMembers is true', async () => {
//         const { user, market } = await setupPatientsForPanelFilter(txn);
//         const patients = await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { gender: ['female' as Gender] },
//           true,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         );
//         expect(patients.total).toEqual(3);
//       });

//       it('still only returns results from care team when showAllMembers is false', async () => {
//         const { user, market } = await setupPatientsForPanelFilter(txn);
//         const patients = await Patient.getPatientPanel(
//           user.id,
//           market.id,
//           { pageNumber: 0, pageSize: 10 },
//           { gender: ['female' as Gender] },
//           false,
//           { orderBy: 'createdAt', order: 'asc' },
//           txn,
//         );
//         expect(patients.total).toEqual(2);
//       });
//     });
//   });

//   describe('getPatientIdForResource', () => {
//     it('returns passed patient id', async () => {
//       const patientId = 'aryaStark';

//       expect(Patient.getPatientIdForResource(patientId)).toBe(patientId);
//     });
//   });

//   describe('get patient social security number', () => {
//     it('returns patient social security number', async () => {
//       const { clinic, market } = await setup(txn);
//       const patient = await createPatient(
//         { cityblockId: 123, homeClinicId: clinic.id, homeMarketId: market.id },
//         txn,
//       );
//       const social = await Patient.getSocialSecurityNumber(patient.id, market.id, txn);

//       expect(social).toMatchObject({
//         id: patient.id,
//         ssn: patient.ssn,
//       });
//     });
//   });

//   describe('get patient zip codes', () => {
//     it('returns all unique patient zip codes in ascending order', async () => {
//       const expected = ['10009', '22102'];
//       const unExpected = ['10009', '10009', '22102'];
//       const { market } = await patientAddressSetup(txn);
//       const zipCodes = await Patient.getPatientZipCodes(market.id, txn);

//       expect(zipCodes).toMatchObject(expected);
//       expect(zipCodes).not.toMatchObject(unExpected);
//     });
//   });

//   describe('get patients on user care team with phones', () => {
//     it('returns patients with phones for given user', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);

//       const patient1 = await createPatient(
//         {
//           cityblockId: 123,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           userId: user.id,
//           lastName: 'Stark',
//           firstName: 'Sansa',
//         },
//         txn,
//       );
//       const patient2 = await createPatient(
//         {
//           cityblockId: 234,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           userId: user.id,
//           lastName: 'Targaryen',
//         },
//         txn,
//       );
//       const patient3 = await createPatient(
//         {
//           cityblockId: 345,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           userId: user.id,
//           lastName: 'Stark',
//           firstName: 'Arya',
//         },
//         txn,
//       );
//       const patient4 = await createPatient(
//         {
//           cityblockId: 456,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           lastName: 'Lannister',
//         },
//         txn,
//       );

//       // create phones for patient 1
//       const phone = await Phone.create(
//         createMockPhone('223-456-1111', 'mobile' as PhoneTypeOptions),
//         txn,
//       );
//       const phone2 = await Phone.create(
//         createMockPhone('223-456-2222', 'home' as PhoneTypeOptions),
//         txn,
//       );
//       const phone3 = await Phone.create(
//         createMockPhone('223-456-3333', 'other' as PhoneTypeOptions),
//         txn,
//       );

//       await PatientPhone.create({ phoneId: phone.id, patientId: patient1.id }, txn);
//       await PatientPhone.create({ phoneId: phone2.id, patientId: patient1.id }, txn);
//       await PatientPhone.create({ phoneId: phone3.id, patientId: patient1.id }, txn);

//       await PatientPhone.delete({ phoneId: phone3.id, patientId: patient1.id }, txn);

//       // create phones for patient 2
//       const phone4 = await Phone.create(
//         createMockPhone('223-456-4444', 'mobile' as PhoneTypeOptions),
//         txn,
//       );
//       await PatientPhone.create({ phoneId: phone4.id, patientId: patient2.id }, txn);

//       // create phone for patient 4
//       const phone5 = await Phone.create(
//         createMockPhone('223-456-5555', 'mobile' as PhoneTypeOptions),
//         txn,
//       );
//       await PatientPhone.create({ phoneId: phone5.id, patientId: patient4.id }, txn);

//       const patients = await Patient.getPatientsWithPhonesForUser(user.id, market.id, txn);

//       expect(patients[0]).toMatchObject({
//         lastName: 'Stark',
//         firstName: 'Arya',
//         cityblockId: 345,
//         id: patient3.id,
//         phones: [],
//       });
//       expect(patients[1]).toMatchObject({
//         firstName: 'Sansa',
//         lastName: 'Stark',
//         cityblockId: 123,
//         id: patient1.id,
//         phones: [
//           {
//             id: phone.id,
//             type: 'mobile',
//           },
//           {
//             id: phone2.id,
//             type: 'home',
//           },
//         ],
//       });
//       expect(patients[2]).toMatchObject({
//         lastName: 'Targaryen',
//         cityblockId: 234,
//         id: patient2.id,
//         phones: [
//           {
//             id: phone4.id,
//             type: 'mobile',
//           },
//         ],
//       });
//     });

//     it('returns patients in correct order in case of duplicates', async () => {
//       const { clinic, market } = await setup(txn);
//       const user = await User.create(createMockUser(11, clinic.id, market.id, userRole), txn);

//       const patient1 = await createPatient(
//         {
//           cityblockId: 123,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           userId: user.id,
//           lastName: 'Stark',
//           firstName: 'Arya',
//         },
//         txn,
//       );
//       const patient2 = await createPatient(
//         {
//           cityblockId: 234,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           userId: user.id,
//           lastName: 'Targaryen',
//         },
//         txn,
//       );
//       const patient3 = await createPatient(
//         {
//           cityblockId: 345,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           userId: user.id,
//           lastName: 'Stark',
//           firstName: 'Arya',
//         },
//         txn,
//       );

//       const patients = await Patient.getPatientsWithPhonesForUser(user.id, market.id, txn);

//       expect(patients[0]).toMatchObject({
//         lastName: 'Stark',
//         firstName: 'Arya',
//         cityblockId: 123,
//         id: patient1.id,
//         phones: [],
//       });
//       expect(patients[1]).toMatchObject({
//         lastName: 'Stark',
//         firstName: 'Arya',
//         cityblockId: 345,
//         id: patient3.id,
//         phones: [],
//       });
//       expect(patients[2]).toMatchObject({
//         lastName: 'Targaryen',
//         cityblockId: 234,
//         id: patient2.id,
//         phones: [],
//       });
//     });
//   });

//   describe('updateHccGaps', () => {
//     describe('when the patient has a pcp', () => {
//       describe('when the patient also has a chp', () => {
//         it('creates hcc gaps tasks correctly', async () => {
//           const {
//             pcp,
//             chp,
//             patient,
//             hccGaps,
//             outstandingTaskTitle,
//             followupTaskTitle,
//             market,
//             testConfig,
//           } = await hccGapsSetup(txn);

//           await CareTeam.create(
//             { userId: pcp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await CareTeam.create(
//             { userId: chp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);

//           const gapsTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: outstandingTaskTitle },
//             txn,
//           );
//           const followupTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: followupTaskTitle },
//             txn,
//           );

//           expect(gapsTask).not.toBeNull();
//           expect(gapsTask!.assignedToId).toEqual(pcp.id);
//           expect(followupTask).not.toBeNull();
//           expect(followupTask!.assignedToId).toEqual(chp.id);
//         });
//       });

//       describe('when the patient does not have a chp', () => {
//         it('creates hcc gaps tasks correctly', async () => {
//           const {
//             pcp,
//             patient,
//             hccGaps,
//             outstandingTaskTitle,
//             followupTaskTitle,
//             market,
//             testConfig,
//           } = await hccGapsSetup(txn);

//           await CareTeam.create(
//             { userId: pcp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);

//           const gapsTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: outstandingTaskTitle },
//             txn,
//           );
//           const followupTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: followupTaskTitle },
//             txn,
//           );

//           expect(gapsTask).not.toBeNull();
//           expect(gapsTask!.assignedToId).toEqual(pcp.id);
//           expect(followupTask).not.toBeNull();
//           expect(followupTask!.assignedToId).toBeNull();
//         });
//       });
//     });

//     describe('when the patient does not have a pcp', () => {
//       describe('when the patient has a chp', () => {
//         it('creates hcc gaps tasks correctly', async () => {
//           const {
//             chp,
//             patient,
//             hccGaps,
//             outstandingTaskTitle,
//             followupTaskTitle,
//             market,
//             testConfig,
//           } = await hccGapsSetup(txn);

//           await CareTeam.create(
//             { userId: chp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);

//           const gapsTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: outstandingTaskTitle },
//             txn,
//           );
//           const followupTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: followupTaskTitle },
//             txn,
//           );

//           expect(gapsTask).not.toBeNull();
//           expect(gapsTask!.assignedToId).toBeNull();
//           expect(followupTask).not.toBeNull();
//           expect(followupTask!.assignedToId).toEqual(chp.id);
//         });
//       });

//       describe('when the patient also does not have a chp', () => {
//         it('creates hcc gaps tasks correctly', async () => {
//           const { patient, hccGaps, outstandingTaskTitle, followupTaskTitle } = await hccGapsSetup(
//             txn,
//           );

//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);

//           const gapsTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: outstandingTaskTitle },
//             txn,
//           );
//           const followupTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: followupTaskTitle },
//             txn,
//           );

//           expect(gapsTask).not.toBeNull();
//           expect(gapsTask!.assignedToId).toBeNull();
//           expect(followupTask).not.toBeNull();
//           expect(followupTask!.assignedToId).toBeNull();
//         });
//       });

//       describe('when createMaintenanceVisitTask is false', () => {
//         it('does not create the maintenance visit task', async () => {
//           const {
//             pcp,
//             chp,
//             patient,
//             hccGaps,
//             outstandingTaskTitle,
//             followupTaskTitle,
//             market,
//             testConfig,
//           } = await hccGapsSetup(txn);

//           await CareTeam.create(
//             { userId: pcp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await CareTeam.create(
//             { userId: chp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', false, txn);

//           const gapsTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: outstandingTaskTitle },
//             txn,
//           );
//           const followupTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: followupTaskTitle },
//             txn,
//           );

//           expect(gapsTask).not.toBeNull();
//           expect(gapsTask!.assignedToId).toEqual(pcp.id);
//           expect(followupTask).toBeNull();
//         });
//       });
//     });

//     describe('running multiple times', () => {
//       describe('when hcc gaps do not change', () => {
//         it('does not create duplicate tasks', async () => {
//           const { pcp, chp, patient, hccGaps, market, testConfig } = await hccGapsSetup(txn);

//           await CareTeam.create(
//             { userId: pcp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await CareTeam.create(
//             { userId: chp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);

//           const tasks = await getTasksForPatient(
//             patient.id,
//             { pageNumber: 0, pageSize: 10, orderBy: 'createdAt', order: 'desc' },
//             txn,
//           );
//           expect(tasks.total).toEqual(2);

//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);
//           const refetchedTasks = await getTasksForPatient(
//             patient.id,
//             { pageNumber: 0, pageSize: 10, orderBy: 'createdAt', order: 'desc' },
//             txn,
//           );
//           expect(refetchedTasks.total).toEqual(2);
//         });
//       });

//       describe('when hcc gaps change', () => {
//         it('updates the gaps task', async () => {
//           const {
//             pcp,
//             chp,
//             patient,
//             hccGaps,
//             outstandingTaskTitle,
//             market,
//             testConfig,
//           } = await hccGapsSetup(txn);

//           await CareTeam.create(
//             { userId: pcp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await CareTeam.create(
//             { userId: chp.id, patientId: patient.id, marketId: market.id },
//             txn,
//             testConfig,
//           );
//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);

//           const tasks = await getTasksForPatient(
//             patient.id,
//             { pageNumber: 0, pageSize: 10, orderBy: 'createdAt', order: 'desc' },
//             txn,
//           );
//           const gapsTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: outstandingTaskTitle },
//             txn,
//           );
//           expect(gapsTask!.description).toEqual(hccGaps.join('\n\n'));
//           expect(tasks.total).toEqual(2);

//           hccGaps.push('a new gap');

//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);
//           const refetchedTasks = await getTasksForPatient(
//             patient.id,
//             { pageNumber: 0, pageSize: 10, orderBy: 'createdAt', order: 'desc' },
//             txn,
//           );
//           expect(refetchedTasks.total).toEqual(2);

//           const refetchedGapsTask = await TaskV1.getForPatientByTitle(
//             {
//               patientId: patient.id,
//               title: outstandingTaskTitle,
//             },
//             txn,
//           );
//           expect(refetchedGapsTask!.description).toContain('a new gap');
//         });
//       });

//       describe('when a task has been completed', () => {
//         it('recreates the necessary task', async () => {
//           const {
//             patient,
//             hccGaps,
//             outstandingTaskTitle,
//             followupTaskTitle,
//             chp,
//           } = await hccGapsSetup(txn);

//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);

//           const tasks = await getTasksForPatient(
//             patient.id,
//             { pageNumber: 0, pageSize: 10, orderBy: 'createdAt', order: 'desc' },
//             txn,
//           );
//           const gapsTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: outstandingTaskTitle },
//             txn,
//           );
//           const followupTask = await TaskV1.getForPatientByTitle(
//             { patientId: patient.id, title: followupTaskTitle },
//             txn,
//           );
//           expect(tasks.total).toEqual(2);
//           expect(gapsTask).not.toBeNull();
//           expect(followupTask).not.toBeNull();

//           await TaskV1.complete(gapsTask!.id, chp.id, txn);
//           const refetchedGapsTask = await TaskV1.getForPatientByTitle(
//             {
//               patientId: patient.id,
//               title: outstandingTaskTitle,
//             },
//             txn,
//           );
//           expect(refetchedGapsTask).toBeNull();

//           await Patient.updateHccGaps(patient.id, hccGaps, 'July', true, txn);
//           const againRefetchedGapsTask = await TaskV1.getForPatientByTitle(
//             {
//               patientId: patient.id,
//               title: outstandingTaskTitle,
//             },
//             txn,
//           );
//           expect(againRefetchedGapsTask).not.toBeNull();
//         });
//       });
//     });
//   });

//   describe('getting list of cohort names', () => {
//     it('gets a list of patient cohort names', async () => {
//       const { market } = await patientsSetup(txn);
//       const cohortNames = await Patient.getCohortNamesForPatients(market.id, txn);

//       expect(cohortNames).toEqual(['House Stark', 'House Targaryen']);
//     });
//   });

//   describe('gets list of patients that are enrolled or consented', () => {
//     it('gets all enrolled or consented patients with eager loaded patientInfo and phone data', async () => {
//       const {
//         patient1,
//         patient2,
//         patientOutOfMarket,
//         patientNotConsented,
//         phoneHome1,
//         phoneHome2,
//         phoneHome3,
//         phoneMobile1,
//         phoneMobile2,
//         phoneMobile3,
//         address,
//         address2,
//       } = await patientStateSetup(txn);
//       const patientNonConsentedPatientState = await PatientState.getForPatient(
//         patientNotConsented.id,
//         txn,
//       );

//       expect(patientNonConsentedPatientState!.currentState).toBe('attributed');

//       const result = (await Patient.getAllConsentedOrEnrolled(txn)) as Patient[];

//       expect(result).toHaveLength(3);
//       expect(result[0]).toEqual(
//         expect.objectContaining({
//           id: patientOutOfMarket.id,
//           patientInfo: expect.objectContaining({
//             patientId: patientOutOfMarket.id,
//             primaryPhone: expect.objectContaining({ id: phoneHome3.id }),
//             primaryAddress: expect.objectContaining({ id: address2.id }),
//           }),
//           phones: expect.objectContaining([phoneMobile3, phoneHome3]),
//         }),
//       );
//       expect(result[1]).toEqual(
//         expect.objectContaining({
//           id: patient1.id,
//           patientInfo: expect.objectContaining({
//             patientId: patient1.id,
//             primaryPhone: expect.objectContaining({ id: phoneMobile1.id }),
//             primaryAddress: expect.objectContaining({ id: address.id }),
//           }),
//           phones: expect.objectContaining([phoneMobile1, phoneHome1]),
//         }),
//       );
//       expect(result[2]).toEqual(
//         expect.objectContaining({
//           id: patient2.id,
//           patientInfo: expect.objectContaining({
//             patientId: patient2.id,
//             primaryPhone: expect.objectContaining({ id: phoneHome2.id }),
//             primaryAddress: expect.objectContaining({ id: address.id }),
//           }),
//           phones: expect.objectContaining([phoneMobile2, phoneHome2]),
//         }),
//       );
//       expect(result).not.toContainEqual(expect.objectContaining({ id: patientNotConsented }));
//     });

//     it('gets all consented or enrolled with filters', async () => {
//       const { patient1, patient2, clinic, market } = await patientStateSetup(txn);
//       const chp1 = await User.create(
//         createMockUser(12, clinic.id, market.id, 'Community_Health_Partner' as UserRole),
//         txn,
//       );
//       const chp2 = await User.create(
//         createMockUser(13, clinic.id, market.id, 'Community_Health_Partner' as UserRole),
//         txn,
//       );
//       const chp3 = await User.create(
//         createMockUser(14, clinic.id, market.id, 'Community_Health_Partner' as UserRole),
//         txn,
//       );
//       await CareTeam.create({ patientId: patient1.id, userId: chp1.id, marketId: market.id }, txn);
//       await CareTeam.create({ patientId: patient2.id, userId: chp2.id, marketId: market.id }, txn);
//       await CareTeam.create({ patientId: patient2.id, userId: chp3.id, marketId: market.id }, txn);

//       const unfilteredResults = (await Patient.getAllConsentedOrEnrolled(txn, market.id, {
//         pageNumber: 0,
//         pageSize: 20,
//       })) as IPaginatedResults<Patient>;
//       const filteredResults = (await Patient.getAllConsentedOrEnrolled(
//         txn,
//         market.id,
//         { pageNumber: 0, pageSize: 20 },
//         { careTeamMemberIds: [chp2.id, chp3.id] },
//       )) as IPaginatedResults<Patient>;

//       expect(unfilteredResults.total).toBe(2);
//       expect(unfilteredResults.results[0].id).toBe(patient1.id);
//       expect(unfilteredResults.results[1].id).toBe(patient2.id);

//       expect(filteredResults.total).toBe(1);
//       expect(filteredResults.results[0].id).toBe(patient2.id);
//     });

//     it('does not return patients with previously deleted states', async () => {
//       const { patient1, patientOutOfMarket, patient2, user } = await patientStateSetup(txn);

//       // change patient state of patient1 to no longer be consented
//       await PatientState.updateForPatient(
//         {
//           patientId: patient1.id,
//           updatedById: user.id,
//           currentState: 'attributed' as CurrentPatientState,
//         },
//         txn,
//       );
//       const result = await Patient.getAllConsentedOrEnrolled(txn);

//       expect(result).toHaveLength(2);
//       expect(result).toContainEqual(expect.objectContaining({ id: patient2.id }));
//       expect(result).toContainEqual(expect.objectContaining({ id: patientOutOfMarket.id }));
//       expect(result).not.toContainEqual(expect.objectContaining({ id: patient1.id }));
//     });

//     it('does not return patients out of market if passed marketId', async () => {
//       const { patient1, patient2, market, patientOutOfMarket } = await patientStateSetup(txn);
//       const result = await Patient.getAllConsentedOrEnrolled(txn, market.id);

//       expect(result).toHaveLength(2);
//       expect(result).toContainEqual(expect.objectContaining({ id: patient1.id }));
//       expect(result).toContainEqual(expect.objectContaining({ id: patient2.id }));
//       expect(result).not.toContainEqual(expect.objectContaining({ id: patientOutOfMarket.id }));
//     });
//   });

//   describe('isCurrentlyNotInterested', () => {
//     it('returns false for consented or enrolled patients', async () => {
//       const { patient1, user } = await patientsSetup(txn);
//       await PatientDocument.create(
//         {
//           id: uuid(),
//           patientId: patient1.id,
//           filename: 'Treatment Consent',
//           documentType: 'treatmentConsent' as any,
//           uploadedById: user.id,
//         },
//         txn,
//       );
//       await PatientDocument.create(
//         {
//           id: uuid(),
//           patientId: patient1.id,
//           filename: 'Privacy Practices Notice',
//           documentType: 'privacyPracticesNotice' as any,
//           uploadedById: user.id,
//         },
//         txn,
//       );
//       await ComputedPatientStatus.updateForPatient(patient1.id, user.id, txn);
//       await OutreachAttempt.create(
//         {
//           userId: user.id,
//           patientId: patient1.id,
//           modality: 'phone' as OutreachAttemptModality,
//           attemptedAt: new Date().toISOString(),
//           direction: 'outbound' as OutreachAttemptDirection,
//           isScheduledVisit: false,
//           personReached: 'member' as OutreachAttemptPersonReached,
//           outcome: 'notInterested' as OutreachAttemptOutcome,
//         },
//         txn,
//       );
//       const isPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(isPatientCurrentlyNotInterested).toEqual(false);
//     });

//     it('correctly returns true if the patient is currently not interested', async () => {
//       const { patient1, user, market } = await patientsSetup(txn);
//       await CareTeam.create({ userId: user.id, patientId: patient1.id, marketId: market.id }, txn);
//       await ComputedPatientStatus.updateForPatient(patient1.id, user.id, txn);

//       const isPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(isPatientCurrentlyNotInterested).toEqual(false);

//       await OutreachAttempt.create(
//         {
//           userId: user.id,
//           patientId: patient1.id,
//           modality: 'phone' as OutreachAttemptModality,
//           attemptedAt: new Date().toISOString(),
//           direction: 'outbound' as OutreachAttemptDirection,
//           isScheduledVisit: false,
//           personReached: 'member' as OutreachAttemptPersonReached,
//           outcome: 'notInterested' as OutreachAttemptOutcome,
//         },
//         txn,
//       );

//       const refetchedPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(refetchedPatientCurrentlyNotInterested).toEqual(true);
//     });

//     it('correctly returns true if the patient is listed as doNotCall', async () => {
//       const { patient1, user, market } = await patientsSetup(txn);
//       await CareTeam.create({ userId: user.id, patientId: patient1.id, marketId: market.id }, txn);
//       await ComputedPatientStatus.updateForPatient(patient1.id, user.id, txn);

//       const isPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(isPatientCurrentlyNotInterested).toEqual(false);

//       await OutreachAttempt.create(
//         {
//           userId: user.id,
//           patientId: patient1.id,
//           modality: 'phone' as OutreachAttemptModality,
//           attemptedAt: new Date().toISOString(),
//           direction: 'outbound' as OutreachAttemptDirection,
//           isScheduledVisit: false,
//           personReached: 'member' as OutreachAttemptPersonReached,
//           outcome: 'doNotCall' as OutreachAttemptOutcome,
//         },
//         txn,
//       );

//       const refetchedPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(refetchedPatientCurrentlyNotInterested).toEqual(true);
//     });

//     it('returns false when a patient has flipped back to interested after having expressed non interest', async () => {
//       const { patient1, user, market } = await patientsSetup(txn);
//       await CareTeam.create({ userId: user.id, patientId: patient1.id, marketId: market.id }, txn);
//       await ComputedPatientStatus.updateForPatient(patient1.id, user.id, txn);

//       const isPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(isPatientCurrentlyNotInterested).toEqual(false);

//       await OutreachAttempt.create(
//         {
//           userId: user.id,
//           patientId: patient1.id,
//           modality: 'phone' as OutreachAttemptModality,
//           attemptedAt: new Date().toISOString(),
//           direction: 'outbound' as OutreachAttemptDirection,
//           isScheduledVisit: false,
//           personReached: 'member' as OutreachAttemptPersonReached,
//           outcome: 'notInterested' as OutreachAttemptOutcome,
//         },
//         txn,
//       );

//       const refetchedPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(refetchedPatientCurrentlyNotInterested).toEqual(true);

//       await OutreachAttempt.create(
//         {
//           userId: user.id,
//           patientId: patient1.id,
//           modality: 'phone' as OutreachAttemptModality,
//           attemptedAt: new Date().toISOString(),
//           direction: 'outbound' as OutreachAttemptDirection,
//           isScheduledVisit: false,
//           personReached: 'member' as OutreachAttemptPersonReached,
//           outcome: 'interested' as OutreachAttemptOutcome,
//         },
//         txn,
//       );

//       const refetchedAgainPatientCurrentlyNotInterested = await Patient.isCurrentlyNotInterested(
//         patient1.id,
//         txn,
//       );
//       expect(refetchedAgainPatientCurrentlyNotInterested).toEqual(false);
//     });
//   });

//   describe('getConsentedOrEnrolledForPanel', () => {
//     let user: User;
//     let market: Market;
//     let patient1: Patient;
//     let patient2: Patient;
//     let patient3: Patient;
//     let patient4: Patient;

//     beforeEach(async () => {
//       ({
//         user,
//         market,
//         patient1,
//         patient2,
//         patient3,
//         patient4,
//       } = await consentedOrEnrolledPatientsSetup(txn));
//     });

//     it("returns consented or enrolled patients on the user's panel in alpha order", async () => {
//       const result = (await Patient.getConsentedOrEnrolledForPanel(
//         user.id,
//         market.id,
//         txn,
//       )) as Patient[];

//       expect(result).toHaveLength(4);
//       expect(result[0].id).toBe(patient3.id);
//       expect(result[1].id).toBe(patient4.id);
//       expect(result[2].id).toBe(patient1.id);
//       expect(result[3].id).toBe(patient2.id);
//     });

//     it("returns consented or enrolled patients on the user's panel in alpha order with pagination", async () => {
//       const result = (await Patient.getConsentedOrEnrolledForPanel(user.id, market.id, txn, {
//         pageNumber: 1,
//         pageSize: 2,
//       })) as IPaginatedResults<Patient>;

//       expect(result.total).toBe(4);
//       expect(result.results[0].id).toBe(patient1.id);
//       expect(result.results[1].id).toBe(patient2.id);
//     });

//     it("does not return patients who are no longer on the user's panel", async () => {
//       // remove patient 1 from user's panel
//       await CareTeam.query(txn)
//         .patch({ deletedAt: new Date().toISOString() })
//         .where({ userId: user.id, patientId: patient1.id, deletedAt: null });
//       const result = (await Patient.getConsentedOrEnrolledForPanel(
//         user.id,
//         market.id,
//         txn,
//       )) as Patient[];

//       expect(result).toHaveLength(3);
//       expect(result[0].id).toBe(patient3.id);
//       expect(result[1].id).toBe(patient4.id);
//       expect(result[2].id).toBe(patient2.id);
//     });
//   });

//   describe('getConsentedOrEnrolledForPod', () => {
//     let user: User;
//     let user2: User;
//     let patient1: Patient;
//     let patient2: Patient;
//     let patient3: Patient;
//     let patient4: Patient;
//     let patient5: Patient;
//     let clinic: Clinic;
//     let market: Market;

//     beforeEach(async () => {
//       ({
//         user,
//         patient1,
//         patient2,
//         patient3,
//         patient4,
//         patient5,
//         clinic,
//         market,
//       } = await consentedOrEnrolledPatientsSetup(txn));

//       // create a clinic pod
//       const clinicPod1 = await ClinicPod.create(
//         { name: 'pod1', clinicId: clinic.id, id: uuid() },
//         txn,
//       );

//       // create another user
//       user2 = await User.create(createMockUser(12, clinic.id, market.id, userRole), txn);

//       // add users to the same pod
//       await ClinicPodMember.assignToClinicPod({ userId: user.id, clinicPodId: clinicPod1.id }, txn);
//       await ClinicPodMember.assignToClinicPod(
//         { userId: user2.id, clinicPodId: clinicPod1.id },
//         txn,
//       );

//       // assign patient5 (not on user1's panel) to user2's panel
//       await CareTeam.create({ userId: user2.id, patientId: patient5.id, marketId: market.id }, txn);
//     });

//     it("returns consented or enrolled patients for all users on user1's pod in alpha order", async () => {
//       const result = (await Patient.getConsentedOrEnrolledForPod(
//         user.id,
//         market.id,
//         txn,
//       )) as Patient[];

//       expect(result).toHaveLength(5);
//       expect(result[0].id).toBe(patient3.id);
//       expect(result[1].id).toBe(patient4.id);
//       expect(result[2].id).toBe(patient5.id);
//       expect(result[3].id).toBe(patient1.id);
//       expect(result[4].id).toBe(patient2.id);
//     });

//     it("returns consented or enrolled patients for all users on user2's pod in alpha order", async () => {
//       const result = (await Patient.getConsentedOrEnrolledForPod(
//         user2.id,
//         market.id,
//         txn,
//       )) as Patient[];

//       expect(result).toHaveLength(5);
//       expect(result[0].id).toBe(patient3.id);
//       expect(result[1].id).toBe(patient4.id);
//       expect(result[2].id).toBe(patient5.id);
//       expect(result[3].id).toBe(patient1.id);
//       expect(result[4].id).toBe(patient2.id);
//     });

//     it("returns consented or enrolled patients for all users on this user's multiple pods in alpha order", async () => {
//       // create a new clinic pod
//       const clinicPod2 = await ClinicPod.create(
//         { name: 'pod2', clinicId: clinic.id, id: uuid() },
//         txn,
//       );
//       // create user3 and assign them to new pod
//       const user3 = await User.create(createMockUser(13, clinic.id, market.id, userRole), txn);
//       await ClinicPodMember.assignToClinicPod(
//         { userId: user3.id, clinicPodId: clinicPod2.id },
//         txn,
//       );
//       // assign user to this pod2 as well
//       await ClinicPodMember.query(txn).insert({ userId: user.id, clinicPodId: clinicPod2.id });
//       // assign patient6 to user3's panel
//       const patient6 = await createPatient(
//         {
//           cityblockId: 200,
//           homeClinicId: clinic.id,
//           homeMarketId: market.id,
//           firstName: 'Garrick',
//           lastName: 'Ollivander',
//         },
//         txn,
//       );
//       await PatientState.updateForPatient(
//         {
//           patientId: patient6.id,
//           updatedById: user.id,
//           currentState: 'consented' as CurrentPatientState,
//         },
//         txn,
//       );
//       await CareTeam.create({ userId: user3.id, patientId: patient6.id, marketId: market.id }, txn);

//       const result = (await Patient.getConsentedOrEnrolledForPod(
//         user.id,
//         market.id,
//         txn,
//       )) as Patient[];

//       expect(result).toHaveLength(6);
//       expect(result[0].id).toBe(patient3.id);
//       expect(result[1].id).toBe(patient4.id);
//       expect(result[2].id).toBe(patient6.id);
//       expect(result[3].id).toBe(patient5.id);
//       expect(result[4].id).toBe(patient1.id);
//       expect(result[5].id).toBe(patient2.id);
//     });

//     it("returns filtered patients for selected care team members on user's pod(s)", async () => {
//       const { user3, patient6 } = await patientConsentedOrEnrolledFilterSetup(
//         user,
//         clinic,
//         market,
//         txn,
//       );
//       const patientsResult = (await Patient.getConsentedOrEnrolledForPod(
//         user.id,
//         market.id,
//         txn,
//         { pageNumber: 0, pageSize: 20 },
//         { careTeamMemberIds: [user2.id, user3.id] },
//       )) as IPaginatedResults<Patient>;

//       // expect patientsResult to have user2 and user3's patients
//       expect(patientsResult.total).toBe(2);
//       expect(patientsResult.results[0].id).toBe(patient6.id);
//       expect(patientsResult.results[1].id).toBe(patient5.id);
//     });

//     it("returns filtered patients for selected care team members on user's pod(s) and NOT patients for care team members on different pod", async () => {
//       const { user4 } = await patientConsentedOrEnrolledFilterSetup(user, clinic, market, txn);
//       const patientsResult = (await Patient.getConsentedOrEnrolledForPod(
//         user.id,
//         market.id,
//         txn,
//         { pageNumber: 0, pageSize: 20 },
//         { careTeamMemberIds: [user2.id, user4.id] },
//       )) as IPaginatedResults<Patient>;

//       // expect patientsResult to have user2 patients and NOT user4's patient
//       expect(patientsResult.total).toBe(1);
//       expect(patientsResult.results[0].id).toBe(patient5.id);
//     });

//     it("returns no filtered patients for selected care team members NOT on user's pod(s)", async () => {
//       const { user4 } = await patientConsentedOrEnrolledFilterSetup(user, clinic, market, txn);
//       const patientsResult = (await Patient.getConsentedOrEnrolledForPod(
//         user.id,
//         market.id,
//         txn,
//         { pageNumber: 0, pageSize: 20 },
//         { careTeamMemberIds: [user4.id] },
//       )) as IPaginatedResults<Patient>;

//       // expect patientsResult to be empty
//       expect(patientsResult.total).toBe(0);
//       expect(patientsResult.results).toEqual([]);
//     });

//     it('does not return patients who are no longer cared for by the user', async () => {
//       // remove patient1 from user's care team
//       await CareTeam.query(txn)
//         .patch({ deletedAt: new Date().toISOString() })
//         .where({ userId: user.id, patientId: patient1.id, deletedAt: null });
//       const result = (await Patient.getConsentedOrEnrolledForPod(
//         user.id,
//         market.id,
//         txn,
//       )) as Patient[];

//       expect(result).toHaveLength(4);
//       expect(result[0].id).toBe(patient3.id);
//       expect(result[1].id).toBe(patient4.id);
//       expect(result[2].id).toBe(patient5.id);
//       expect(result[3].id).toBe(patient2.id);
//     });

//     it("does not return patients who are no longer cared for by one of the other users on the user's pod", async () => {
//       // remove patient5 from user2's care team
//       await CareTeam.query(txn)
//         .patch({ deletedAt: new Date().toISOString() })
//         .where({ userId: user2.id, patientId: patient5.id, deletedAt: null });

//       const result = (await Patient.getConsentedOrEnrolledForPod(
//         user.id,
//         market.id,
//         txn,
//       )) as Patient[];

//       expect(result).toHaveLength(4);
//       expect(result[0].id).toBe(patient3.id);
//       expect(result[1].id).toBe(patient4.id);
//       expect(result[2].id).toBe(patient1.id);
//       expect(result[3].id).toBe(patient2.id);
//     });
//   });

//   describe('getAllOutOfSyncForClinic', () => {
//     let user: User;
//     let user2: User;
//     let user3: User;
//     let patient1: Patient;
//     let patient2: Patient;
//     let patient3: Patient;
//     let patient4: Patient;
//     let patient5: Patient;
//     let clinic: Clinic;
//     let clinic2: Clinic;
//     let market: Market;

//     beforeEach(async () => {
//       ({ user, patient1, patient2, clinic, market } = await patientsSetup(txn));
//       await User.update(user.id, { userRole: 'Community_Health_Partner' as any }, txn);
//       clinic2 = await Clinic.create(createMockClinic('Another Clinic', 1234567), txn);
//       user2 = await User.create(
//         createMockUser(12, clinic2.id, market.id, 'Outreach_Specialist' as any),
//         txn,
//       );
//       user3 = await User.create(createMockUser(14, clinic.id, market.id, userRole), txn);
//       patient3 = await createPatient(
//         {
//           cityblockId: 567,
//           homeClinicId: clinic2.id,
//           homeMarketId: market.id,
//           firstName: 'SOMEBODY',
//           lastName: 'ELSE',
//         },
//         txn,
//       );
//       patient4 = await createPatient(
//         {
//           cityblockId: 789,
//           homeClinicId: clinic2.id,
//           homeMarketId: market.id,
//           firstName: 'ANOTHER',
//           lastName: 'HUMAN',
//         },
//         txn,
//       );
//       patient5 = await createPatient(
//         {
//           cityblockId: 101112,
//           homeClinicId: clinic2.id,
//           homeMarketId: market.id,
//           firstName: 'AGAIN',
//           lastName: 'APERSON',
//         },
//         txn,
//       );

//       // Add a CHP to patient1 & patient2
//       await CareTeam.create({ userId: user2.id, patientId: patient1.id, marketId: market.id }, txn);
//       await PatientState.updateForPatient(
//         {
//           patientId: patient1.id,
//           updatedById: user.id,
//           currentState: 'enrolled' as CurrentPatientState,
//         },
//         txn,
//       );
//       await CareTeam.create({ userId: user2.id, patientId: patient2.id, marketId: market.id }, txn);
//       await PatientState.updateForPatient(
//         {
//           patientId: patient2.id,
//           updatedById: user.id,
//           currentState: 'consented' as CurrentPatientState,
//         },
//         txn,
//       );
//       await CareTeam.create({ userId: user2.id, patientId: patient3.id, marketId: market.id }, txn);
//       await PatientState.updateForPatient(
//         {
//           patientId: patient3.id,
//           updatedById: user.id,
//           currentState: 'enrolled' as CurrentPatientState,
//         },
//         txn,
//       );
//       await CareTeam.create({ userId: user.id, patientId: patient4.id, marketId: market.id }, txn);
//       await PatientState.updateForPatient(
//         {
//           patientId: patient4.id,
//           updatedById: user.id,
//           currentState: 'interested' as CurrentPatientState,
//         },
//         txn,
//       );
//       await CareTeam.create({ userId: user3.id, patientId: patient5.id, marketId: market.id }, txn);
//       await PatientState.updateForPatient(
//         {
//           patientId: patient5.id,
//           updatedById: user.id,
//           currentState: 'consented' as CurrentPatientState,
//         },
//         txn,
//       );
//     });

//     it('returns consented and enrolled patients with homeClinicIds that do not match their care team', async () => {
//       const outOfSyncPatients = await Patient.getAllOutOfSyncForClinic(clinic2.id, txn);
//       const outOfSyncPatientIds = outOfSyncPatients.map(patient => patient.id);
//       expect(outOfSyncPatients).toHaveLength(2);

//       // Both consented/enrolled
//       expect(outOfSyncPatientIds).toContain(patient1.id);
//       expect(outOfSyncPatientIds).toContain(patient2.id);

//       // Consented/enrolled but clinic is correct
//       expect(outOfSyncPatientIds).not.toContain(patient3.id);

//       // Not consented/enrolled & clinic is incorrect
//       expect(outOfSyncPatientIds).not.toContain(patient4.id);
//     });

//     it('does not return out of sync consented and enrolled patients who do not have CHPs/OSs on their team', async () => {
//       const outOfSyncPatients = await Patient.getAllOutOfSyncForClinic(clinic.id, txn);
//       expect(outOfSyncPatients).toHaveLength(0);
//     });
//   });

//   describe('updateMultipleFromClient', () => {
//     let patient1: Patient;
//     let patient2: Patient;
//     let patient3: Patient;
//     let patient4: Patient;
//     let clinic1: Clinic;
//     let clinic2: Clinic;
//     let market: Market;

//     beforeEach(async () => {
//       market = await Market.findOrCreateNycMarket(txn);
//       clinic1 = await Clinic.create(createMockClinic('A First Clinic', 12345), txn);
//       clinic2 = await Clinic.create(createMockClinic('A Second Clinic', 67890), txn);
//       patient1 = await createPatient(
//         {
//           cityblockId: 123,
//           homeClinicId: clinic1.id,
//           homeMarketId: market.id,
//           firstName: 'One',
//           lastName: 'Person',
//         },
//         txn,
//       );
//       patient2 = await createPatient(
//         {
//           cityblockId: 456,
//           homeClinicId: clinic1.id,
//           homeMarketId: market.id,
//           firstName: 'Another',
//           lastName: 'Person',
//         },
//         txn,
//       );
//       patient3 = await createPatient(
//         {
//           cityblockId: 789,
//           homeClinicId: clinic1.id,
//           homeMarketId: market.id,
//           firstName: 'Third',
//           lastName: 'Person',
//         },
//         txn,
//       );
//       patient4 = await createPatient(
//         {
//           cityblockId: 101112,
//           homeClinicId: clinic2.id,
//           homeMarketId: market.id,
//           firstName: 'SoMany',
//           lastName: 'Persons',
//         },
//         txn,
//       );
//     });

//     it('updates the homeClinicIds of multiple patients', async () => {
//       const refetchedPatient1 = await Patient.dangerousGet(patient1.id, txn);
//       const refetchedPatient2 = await Patient.dangerousGet(patient2.id, txn);
//       const refetchedPatient3 = await Patient.dangerousGet(patient3.id, txn);
//       const refetchedPatient4 = await Patient.dangerousGet(patient4.id, txn);

//       expect(refetchedPatient1.homeClinicId).toEqual(clinic1.id);
//       expect(refetchedPatient2.homeClinicId).toEqual(clinic1.id);
//       expect(refetchedPatient3.homeClinicId).toEqual(clinic1.id);
//       expect(refetchedPatient4.homeClinicId).toEqual(clinic2.id);

//       await Patient.updateMultipleFromScript(
//         [patient1.id, patient2.id],
//         { homeClinicId: clinic2.id },
//         txn,
//       );

//       const againRefetchedPatient1 = await Patient.dangerousGet(patient1.id, txn);
//       const againRefetchedPatient2 = await Patient.dangerousGet(patient2.id, txn);
//       const againRefetchedPatient3 = await Patient.dangerousGet(patient3.id, txn);
//       const againRefetchedPatient4 = await Patient.dangerousGet(patient4.id, txn);

//       expect(againRefetchedPatient1.homeClinicId).toEqual(clinic2.id);
//       expect(againRefetchedPatient2.homeClinicId).toEqual(clinic2.id);
//       expect(againRefetchedPatient3.homeClinicId).toEqual(clinic1.id);
//       expect(againRefetchedPatient4.homeClinicId).toEqual(clinic2.id);
//     });
//   });
// });




