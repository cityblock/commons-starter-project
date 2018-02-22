import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../library/button/button';
import Icon from '../library/icon/icon';
import * as styles from './css/glass-break.css';

type Resource = 'patient' | 'progressNote';

interface IProps {
  resource: Resource;
  patientName?: string;
}

class GlassBreak extends React.Component<IProps> {
  render(): JSX.Element {
    const { resource, patientName } = this.props;

    return (
      <div className={styles.container}>
        <Icon name="lockOutline" color="red" className={styles.icon} />
        <div className={styles.header}>
          <FormattedMessage id={`glassBreak.${resource}private`}>
            {(message: string) => <h1 className={styles.red}>{message}</h1>}
          </FormattedMessage>
          {patientName && <h1>{patientName}</h1>}
        </div>
        <FormattedMessage id={`glassBreak.${resource}note`}>
          {(message: string) => <p>{message}</p>}
        </FormattedMessage>
        <Button
          messageId="glassBreak.breakGlass"
          color="red"
          onClick={() => true as any}
          className={styles.button}
        />
      </div>
    );
  }
}

export default GlassBreak;
