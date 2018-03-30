import { format } from 'date-fns';
import * as React from 'react';
import { FullPatientDocumentFragment } from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import SmallText from '../../../shared/library/small-text/small-text';
import TextInfo from '../../../shared/library/text-info/text-info';
import * as styles from './css/patient-document.css';

interface IProps {
  patientDocument: FullPatientDocumentFragment;
}

export const PatientDocument: React.StatelessComponent<IProps> = props => {
  const { filename, description, createdAt, uploadedBy } = props.patientDocument;
  const userName = formatFullName(uploadedBy.firstName, uploadedBy.lastName);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.title}>{filename}</div>
        <div className={styles.flexRow}>
          <TextInfo
            messageId="patientDocument.uploadedBy"
            messageColor="gray"
            text={userName}
            textColor="gray"
            size="medium"
          />
          <TextInfo
            messageId="patientDocument.uploadedOn"
            messageColor="gray"
            text={format( createdAt, 'MM/DD/YYYY')}
            textColor="gray"
            size="medium"
          />
        </div>
      </div>
      <SmallText text={description || ''} size="medium" color="gray" className={styles.right} />
    </div>
  );
};

export default PatientDocument;
