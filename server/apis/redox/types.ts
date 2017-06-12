// These interfaces define the request and return types for the Redox API.

export type DataModels = 'PatientAdmin';
export type EventTypes = 'NewPatient';

interface IRedoxMeta {
  DataModel: DataModels;
  EventType: EventTypes;
  EventDateTime: string;
  Test: boolean;
  Source: {
    ID: string;
    Name: string;
  };
  Destinations: Array<{ ID: string; Name: string; }>;
  Message?: {
    ID: number,
  };
  Transmission?: {
    ID: number,
  };
}

export interface IRedoxPatientCreateOptions {
  Meta: IRedoxMeta;
  Patient: {
    Identifiers: Array<{ ID: string; IDType: string; }>;
    Demographics: {
      FirstName: string;
      MiddleName?: string;
      LastName: string;
      DOB: string; // '2008-01-06',
      SSN?: string; // '101-01-0001',
      Sex?: string; // 'Male',
      Race?: string; // 'Asian',
      MaritalStatus?: string; // 'Single',
      PhoneNumber: {
        Home?: string; // '8088675301',
        Office?: string; // '8088675301',
        Mobile?: string; // '8088675301',
      };
      EmailAddresses?: string[];
      Language?: string; // 'en';
      Citizenship?: string[],
      Address: {
        StreetAddress?: string;
        City?: string;
        State?: string;
        ZIP: string; // '53566',
        County?: string;
        Country?: string;
      },
    },
    Notes?: string[],
    Contacts?: Array<{
      FirstName: string;
      MiddleName?: string;
      LastName: string;
      Address: {
        StreetAddress?: string;
        City?: string;
        State?: string;
        ZIP: string; // '53566',
        County?: string;
        Country?: string;
      },
      PhoneNumber: {
        Home?: string; // '8088675301',
        Office?: string; // '8088675301',
        Mobile?: string; // '8088675301',
      };
      RelationToPatient: string[];
      EmailAddresses: string[];
      Roles: string[];
    }>;
    PCP?: {
      NPI: string; // '4356789876',
      FirstName: string;
      LastName: string;
      Credentials: string[];
      Address: {
        StreetAddress?: string;
        City?: string;
        State?: string;
        ZIP: string; // '53566',
        County?: string;
        Country?: string;
      },
      Location: {
        Type?: string,
        Facility?: string,
        Department?: string,
        Room?: string,
      },
      PhoneNumber: {
        Office?: string; // '6085551234',
      },
    },
    Guarantor?: {
      Number: string; // '10001910',
      FirstName: string;
      LastName: string;
      DOB?: string;
      Sex?: string;
      Spouse?: {
        FirstName: string;
        LastName: string;
      };
      Address: {
        StreetAddress?: string;
        City?: string;
        State?: string;
        ZIP: string; // '53566',
        County?: string;
        Country?: string;
      },
      PhoneNumber: {
        Home?: string,
        Business?: string,
      },
      Type?: string,
      RelationToPatient: string;
      Employer: {
        Name?: string;
        Address: {
          StreetAddress?: string;
          City?: string;
          State?: string;
          ZIP: string; // '53566',
          County?: string;
          Country?: string;
        },
        PhoneNumber: string; // '8083451121',
      },
    },
    Insurances: Array<{
      Plan: {
        ID?: string; // '31572',
        IDType?: string; // 'Payor ID',
        Name?: string; // 'HMO Deductable Plan',
      },
      Company?: {
        ID?: string; // '60054',
        IDType?: string;
        Name?: string;
        Address?: {
          StreetAddress?: string;
          City?: string;
          State?: string;
          ZIP: string; // '53566',
          County?: string;
          Country?: string;
        },
        PhoneNumber: '8089541123',
      },
      GroupNumber?: string;
      GroupName?: string;
      EffectiveDate?: string; // '2015-01-01',
      ExpirationDate?: string; // '2020-12-31',
      PolicyNumber?: string;
      AgreementType?: string,
      CoverageType?: string,
      Insured: {
        LastName?: string,
        FirstName?: string,
        Relationship?: string,
        DOB?: string,
        Address?: {
          StreetAddress?: string;
          City?: string;
          State?: string;
          ZIP: string; // '53566',
          County?: string;
          Country?: string;
        },
      },
    }>
  };
}

export interface IRedoxError {
  ID: number;
  Text: string;
  Type: 'transmission';
  Module: 'Send';
}

export interface IRedoxPatientCreateResponse {
  Patient: {
    Identifiers: Array<{
      IDType: 'AthenaNet Enterprise ID';
      ID: string; // "1234"
    }>;
  };
  Meta: {
    DataModel: 'PatientAdmin';
    EventType: 'NewPatient';
    Message: {
      ID: number;
    };
    Source: {
      ID: string;
    };
    Destinations: Array<{
      ID: string;
      Name: 'athenahealth sandbox';
    }>;
    Errors?: IRedoxError[];
  };
}
