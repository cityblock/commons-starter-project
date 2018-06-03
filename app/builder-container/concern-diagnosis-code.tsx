import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as concernRemoveDiagnosisCodeMutationGraphql from '../graphql/queries/concern-remove-diagnosis-code-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  concernRemoveDiagnosisCodeMutation,
  concernRemoveDiagnosisCodeMutationVariables,
  FullDiagnosisCodeFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import Icon from '../shared/library/icon/icon';

export interface IRemoveOptions {
  variables: concernRemoveDiagnosisCodeMutationVariables;
}

interface IProps {
  diagnosisCode: FullDiagnosisCodeFragment;
  concernId: string;
}

interface IGraphqlProps {
  concernRemoveDiagnosisCode: (
    options: IRemoveOptions,
  ) => { data: concernRemoveDiagnosisCodeMutation };
}

interface IState {
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export class ConcernDiagnosisCode extends React.Component<allProps, IState> {
  state = { loading: false, error: null };

  onClickDelete = async () => {
    const { diagnosisCode, concernId, concernRemoveDiagnosisCode } = this.props;

    this.setState({ loading: true, error: null });

    try {
      await concernRemoveDiagnosisCode({
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

export default graphql<any>(concernRemoveDiagnosisCodeMutationGraphql as any, {
  name: 'concernRemoveDiagnosisCode',
  options: {
    refetchQueries: ['concern'],
  },
})(ConcernDiagnosisCode) as React.ComponentClass<IProps>;
