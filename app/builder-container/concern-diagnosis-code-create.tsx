import * as React from 'react';
import { graphql } from 'react-apollo';
import * as helperStyles from '../builder-container/css/risk-area-create.css';
/* tslint:disable:max-line-length */
import * as concernAddDiagnosisCodeMutationGraphql from '../graphql/queries/concern-add-diagnosis-code-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  concernAddDiagnosisCodeMutation,
  concernAddDiagnosisCodeMutationVariables,
} from '../graphql/types';
import Button from '../shared/library/button/button';
import TextInput from '../shared/library/text-input/text-input';

const CODESET_NAME = 'ICD-10';
const CODESET_VERSION = '2018';

export interface ICreateOptions {
  variables: concernAddDiagnosisCodeMutationVariables;
}

interface IProps {
  concernId: string;
}

interface IGraphqlProps {
  concernAddDiagnosisCode: (options: ICreateOptions) => { data: concernAddDiagnosisCodeMutation };
}

interface IState {
  newDiagnosisCode: string;
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export class ConcernDiagnosisCodeCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      newDiagnosisCode: '',
    };
  }

  onSubmit = async () => {
    const { concernId, concernAddDiagnosisCode } = this.props;
    const { newDiagnosisCode } = this.state;

    this.setState({ loading: true, error: null });

    try {
      await concernAddDiagnosisCode({
        variables: {
          concernId,
          code: newDiagnosisCode,
          codesetName: CODESET_NAME,
          version: CODESET_VERSION,
        },
      });
      this.setState({ loading: false, error: null, newDiagnosisCode: '' });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    this.setState({ newDiagnosisCode: value });
  };

  render() {
    const { newDiagnosisCode } = this.state;

    return (
      <div className={helperStyles.inputGroup}>
        <div className={helperStyles.inlineInputGroup}>
          <TextInput
            smallInput={true}
            placeholderMessageId="concernDiagnosisCode.addCode"
            value={newDiagnosisCode}
            onChange={this.onChange}
          />
        </div>
        <div className={helperStyles.inlineInputGroup}>
          <Button onClick={this.onSubmit} messageId="concernDiagnosisCode.addButton" />
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(
  concernAddDiagnosisCodeMutationGraphql as any,
  {
    name: 'concernAddDiagnosisCode',
    options: {
      refetchQueries: ['concern'],
    },
  },
)(ConcernDiagnosisCodeCreate);
