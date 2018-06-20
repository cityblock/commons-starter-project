import classNames from 'classnames';
import React from 'react';
import { graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import concernRemoveDiagnosisCodeGraphql from '../graphql/queries/concern-remove-diagnosis-code-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  concernRemoveDiagnosisCode,
  concernRemoveDiagnosisCodeVariables,
  FullDiagnosisCode,
} from '../graphql/types';
import styles from '../shared/css/two-panel-right.css';
import Icon from '../shared/library/icon/icon';

export interface IRemoveOptions {
  variables: concernRemoveDiagnosisCodeVariables;
}

interface IProps {
  diagnosisCode: FullDiagnosisCode;
  concernId: string;
}

interface IGraphqlProps {
  concernRemoveDiagnosisCode: (options: IRemoveOptions) => { data: concernRemoveDiagnosisCode };
}

interface IState {
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export class ConcernDiagnosisCode extends React.Component<allProps, IState> {
  state = { loading: false, error: null };

  onClickDelete = async () => {
    const { diagnosisCode, concernId } = this.props;

    this.setState({ loading: true, error: null });

    try {
      await this.props.concernRemoveDiagnosisCode({
        variables: {
          concernId,
          diagnosisCodeId: diagnosisCode.id,
        },
      });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  };

  render() {
    const { diagnosisCode } = this.props;

    const diagnosisCodeStyles = classNames(styles.smallText, styles.smallMargin);

    return (
      <div>
        <div className={styles.flexRow}>
          <Icon className={diagnosisCodeStyles} name="close" onClick={this.onClickDelete} />
          <div className={diagnosisCodeStyles}>{diagnosisCode.label}</div>
        </div>
      </div>
    );
  }
}

export default graphql<any>(concernRemoveDiagnosisCodeGraphql, {
  name: 'concernRemoveDiagnosisCode',
  options: {
    refetchQueries: ['concern'],
  },
})(ConcernDiagnosisCode) as React.ComponentClass<IProps>;
