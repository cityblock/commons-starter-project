import * as moment from 'moment';
import { IAppointment, IAppointmentStatusEnum } from 'schema';
import config from '../../../config';
import Patient from '../../../models/patient';
import User from '../../../models/user';
import {
  AthenaAppointmentStatus,
  IBookAppointmentResponse,
  IOpenAppointmentResponse,
} from '../types';

function getHumanReadableStatus(status: AthenaAppointmentStatus): IAppointmentStatusEnum {
  const statusMap = {
    x: 'cancelled',
    f: 'future',
    o: 'open',
    2: 'checkedIn',
    3: 'checkedOut',
    4: 'chargeEntered',
  };

  return statusMap[status] as IAppointmentStatusEnum;
}

export function formatAppointment(
  bookedAppointment: IBookAppointmentResponse,
  patient: Patient,
  user: User,
): IAppointment {
  return {
    athenaAppointmentId: bookedAppointment.appointmentid,
    dateTime: moment(
      `${bookedAppointment.date} ${bookedAppointment.starttime} ${config.TIME_ZONE}`,
      'MM/DD/YYYY HH:mm ZZ',
    ).toISOString(),
    athenaDepartmentId: Number(bookedAppointment.departmentid),
    status: getHumanReadableStatus(bookedAppointment.appointmentstatus),
    athenaPatientId: Number(bookedAppointment.patientid),
    duration: bookedAppointment.duration,
    appointmentTypeId: Number(bookedAppointment.appointmenttypeid),
    appointmentType: bookedAppointment.appointmenttype,
    athenaProviderId: Number(bookedAppointment.providerid),
    userId: user.id,
    patientId: patient.id,
    clinicId: patient.homeClinicId,
  };
}

export function getAppointmentId(openAppointmentResponse: IOpenAppointmentResponse): string {
  return Object.keys(openAppointmentResponse.appointmentids)[0];
}
