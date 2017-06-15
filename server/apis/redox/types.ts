// These interfaces define the request and return types for the Redox API.

export type DataModels = 'PatientAdmin' | 'Clinical Summary';
export type EventTypes = 'NewPatient' | 'PatientQuery';

interface IRedoxMeta {
  DataModel: DataModels;
  EventType: EventTypes;
  EventDateTime: string;
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
      NPI?: string; // '4356789876',
      FirstName?: string;
      LastName?: string;
      Credentials?: string[];
      Address?: {
        StreetAddress?: string;
        City?: string;
        State?: string;
        ZIP: string; // '53566',
        County?: string;
        Country?: string;
      },
      Location?: {
        Type?: string,
        Facility?: string,
        Department?: string,
        Room?: string,
      },
      PhoneNumber?: {
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

export interface IRedoxClinicalSummaryQueryOptions {
  Meta: IRedoxMeta;
  Patient: { Identifiers: Array<{ ID: string; IDType: string; }> };
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

export interface IRedoxClinicalSummaryQueryResponse {
  Meta: {
    DataModel: 'Clinical Summary';
    EventType: 'PatientQueryResponse';
    EventDateTime: string;
    Test: boolean;
    Source: {
      ID: string;
      Name: string;
    };
    Destinations: Array<{
      ID: string;
      Name: 'athenahealth sandbox';
    }>;
    Message: {
      ID: number;
    },
    Transmission: {
      ID: number;
    }
  };
  Header: {
    Document: {
      Author: {
        ID: string;
        IDType: string;
        Type: string;
        FirstName?: string;
        LastName?: string;
        Credentials?: string[];
        Address?: {
          StreetAddress?: string;
          City?: string;
          State?: string;
          ZIP?: string;
          County?: string;
          Country?: string;
        };
        Location?: {
          Type?: string;
          Facility?: string;
          Department?: string;
          Room?: string;
        };
        PhoneNumber?: {
          Office?: string; // +18005551234
        };
      };
      ID: string;
      Locale: string;
      Title: string;
      DateTime: string; // 2012-09-12T00:00:00.00Z
      Type: string;
    };
    Patient: {
      Identifiers: Array<{ ID: string; IDType: string; Type: string; }>;
      Demographics: {
        FirstName: string;
        LastName: string;
        DOB: string; // 2008-01-06
        SSN: string; // 101-01-0001
        Sex: string;
        Address: {
          StreetAddress: string;
          City: string;
          State: string;
          County: string;
          Country: string;
          ZIP: string;
        };
        PhoneNumber: {
          Home: string; // +18005551234
          Mobile?: string; // +18005551234
        };
        EmailAddresses: Array<{ Address: string; }>;
        Race: string;
        Ethnicity?: string;
        Religion?: string;
        MaritalStatus: string;
      };
    };
  };
  AdvanceDirectivesText: string;
  AdvanceDirectives: Array<{
    Type: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
    };
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
    StartDate: string; // 2011-02-13T05:00:00.000Z
    EndDate?: string; // 2011-03-14T05:00:00.000Z
    ExternalReference: string;
    VerifiedBy: Array<{
      FirstName: string;
      LastName: string;
      Credentials: string;
      DateTime?: string;
    }>;
    Custodians: Array<{
      FirstName: string;
      LastName: string;
      Credentials: string;
      Address: {
        StreetAddress: string;
        City: string;
        State: string;
        Country: string;
        ZIP: string;
      };
    }>;
  }>;
  AllergyText: string;
  Allergies: Array<{
    Type: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    Substance: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    Reaction: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Text?: string;
    }>;
    Severity: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    Status: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    StartDate?: string;
    EndDate?: string;
    Comment: string;
  }>;
  EncountersText: string;
  Encounters: IRedoxClinicalSummaryEncounter[];
  FamilyHistoryText: string;
  FamilyHistory: Array<{
    Relation: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Demographics: {
        Sex: string;
        DOB: string; // 1912-01-01
      };
      IsDeceased: boolean;
    };
    Problems: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Type: {
        Code: string;
        CodeSystem: string;
        CodeSystemName: string;
        Name: string;
      };
      DateTime?: string; // 1994-01-01T05:00:00.000Z
      AgeAtOnset: string;
      IsCauseOfDeath?: boolean;
    }>;
  }>;
  ImmunizationText: string;
  Immunizations: Array<{
    DateTime: string; // 2012-05-10T04:00:00.000Z
    Route: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    Product: {
      Manufacturer: string;
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      LotNumber?: string;
    };
    Dose: {
      Quantity: string;
      Units: string;
    };
  }>;
  MedicalEquipmentText: string;
  MedicalEquipment: Array<{
    Status: string;
    StartDate: string; // 1999-11-01T05:00:00.000Z
    Quantity: string;
    Product: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    }
  }>;
  MedicationsText: string;
  Medications: IRedoxClinicalSummaryMedication[];
  PlanOfCareText: string;
  PlanOfCare: {
    Orders: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName?: string;
      Name: string;
      Status: string;
      DateTime: string; // 2012-08-20T05:00:00.000Z
    }>;
    Procedures: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Status: string;
      DateTime: string; // 2012-08-20T05:00:00.000Z
    }>;
    Encounters: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Status: string;
      DateTime: string; // 2012-08-20T05:00:00.000Z
    }>;
    MedicationAdminstration: Array<{
      Status: string;
      Dose: {
        Quantity: string;
        Units: string;
      };
      Rate: {
        Quantity?: string;
        Units?: string;
      };
      Route: {
        Code: string;
        CodeSystem: string;
        CodeSystemName: string;
        Name: string;
      };
      StartDate: string; // 2012-10-02T05:00:00.000Z
      EndDate?: string; // 2012-10-08T05:00:00.000Z
      Frequency: {
        Period?: string;
        Unit?: string;
      };
      Product: {
        Code: string;
        CodeSystem: string;
        CodeSystemName: string;
        Name: string;
      };
    }>;
    Supplies: string[];
    Services: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Status: string;
      DateTime?: string; // 2012-10-02T05:00:00.000Z
    }>;
  };
  ProblemsText: string;
  Problems: Array<{
    StartDate: string; // 2012-08-06T04:00:00.000Z
    EndDate?: string; // 2012-08-08T04:00:00.000Z
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
    Category: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    HealthStatus: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    Status: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
  }>;
  ProceduresText: string;
  Procedures: {
    Observations: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      DateTime: string; // 20120807
      Status: string;
      TargetSite: {
        Code: string;
        CodeSystem: string;
        CodeSystemName: string;
        Name: string;
      };
    }>;
    Procedures: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      DateTime: string; // 20120807
      Status: string;
    }>;
    Services: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      DateTime: string; // 20120807
      Status: string;
    }>;
  };
  ResultsText: string;
  Results: Array<{
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
    Status: string;
    Observations: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Status: string;
      Interpretation: string;
      DateTime: string; // 2012-08-10T14:00:00.000Z
      Value: string;
      Units: string;
      ReferenceRange: {
        Low?: string;
        High?: string;
        Text?: string;
      };
    }>;
  }>;
  SocialHistoryText: string;
  SocialHistory: {
    Observations: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Value: {
        Code?: string;
        CodeSystem?: string;
        CodeSystemName?: string;
        Name?: string;
      };
      ValueText: string;
      StartDate: string; // 1990-05-01T04:00:00.000Z
      EndDate?: string; // 1990-05-25T04:00:00.000Z
    }>;
    Pregnancy: Array<{
      StartDate: string; // 1990-05-01T04:00:00.000Z,
      EndDate?: string; // 1991-02-08T04:00:00.000Z,
      EstimatedDelivery?: string; // 1992-02-03T04:00:00.000Z,
    }>;
    TobaccoUse: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      StartDate: string; // 2005-05-01T04:00:00.000Z
      EndDate: string; // 2011-02-27T05:00:00.000Z
    }>;
  };
  VitalSignsText: string;
  VitalSigns: Array<{
    DateTime: string; // 1999-11-14T00:00:00.000Z
    Observations: Array<{
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
      Status: string;
      Interpretation: string;
      DateTime: string; // 1999-11-14T00:00:00.000Z
      Value: string;
      Units: string;
    }>;
  }>;
}

export interface IRedoxClinicalSummaryEncounter {
  Type: {
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
  };
  DateTime: string; // 2012-08-06T04:00:00.000Z
  EndDateTime?: string; // 2012-08-06T04:00:00.000Z
  Providers: Array<{
    ID?: string;
    IDType?: string;
    FirstName?: string;
    LastName?: string;
    Credentials: string[];
    Address: {
      StreetAddress?: string;
      City?: string;
      State?: string;
      ZIP?: string;
      County?: string;
      Country?: string;
    };
    Location: {
      Type?: string;
      Facility?: string;
      Department?: string;
      Room?: string;
    };
    PhoneNumber: {
      Office?: string; // +18005551234
    };
    Role: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
  }>;
  Locations: Array<{
    Address: {
      StreetAddress: string;
      City: string;
      State: string;
      Country: string;
      ZIP: string;
    };
    Type: {
      Code: string;
      CodeSystem: string;
      CodeSystemName: string;
      Name: string;
    };
    Name: string;
  }>;
  Diagnosis: Array<{
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
  }>;
  ReasonForVisit: Array<{
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
  }>;
}

export interface IRedoxClinicalSummaryMedication {
  Prescription: boolean;
  FreeTextSig?: string;
  Dose: {
    Quantity: string;
    Units: string;
  };
  Rate: {
    Quantity?: string;
    Units?: string;
  };
  Route: {
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
  };
  StartDate: string; // 2013-11-11T05:00:00.000Z
  EndDate?: string; // 2013-11-11T05:00:00.000Z
  Frequency: {
    Period: string;
    Unit: string;
  };
  Product: {
    Code: string;
    CodeSystem: string;
    CodeSystemName: string;
    Name: string;
  };
}
