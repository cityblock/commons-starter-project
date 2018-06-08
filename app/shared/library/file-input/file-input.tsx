import * as React from 'react';
import { Fragment } from 'react';
import DefaultText from '../default-text/default-text';
import Icon from '../icon/icon';
import Text from '../text/text';
import * as styles from './css/file-input.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderMessageId?: string | null; // optional placeholderMessageId text for empty field
  name?: string; // optional name field for input
  id?: string; // optional id field for input, likely use with label
  required?: boolean;
  acceptTypes?: string;
  hasMaxSizeError?: boolean; // show file size error
}

const FileInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    value,
    onChange,
    placeholderMessageId,
    name,
    id,
    required,
    acceptTypes,
    hasMaxSizeError,
  } = props;
  const req = required || false;

  let bodyHtml = null;
  if (value) {
    bodyHtml = (
      <div className={styles.flexRow}>
        <DefaultText label={value} color="black" className={styles.text} />
      </div>
    );
  } else if (placeholderMessageId) {
    bodyHtml = (
      <div className={styles.flexRow}>
        <DefaultText messageId={placeholderMessageId} color="lightGray" className={styles.text} />
        <div className={styles.uploadText}>
          <Icon name="fileUpload" color="blue" />
          <DefaultText messageId="fileInput.chooseAFile" />
        </div>
      </div>
    );
  }

  const error = hasMaxSizeError ? <Text messageId="fileInput.maxSize" color="red" /> : null;

  return (
    <Fragment>
      <div className={styles.container}>
        <input
          type="file"
          onChange={onChange}
          name={name || ''}
          required={req}
          id={id || ''}
          accept={acceptTypes}
        />
        {bodyHtml}
      </div>
      {error}
    </Fragment>
  );
};

export default FileInput;
