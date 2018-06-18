import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import helperStyles from '../builder-container/css/risk-area-create.css';
/* tslint:disable:max-line-length */
import concernAddDiagnosisCodeMutationGraphql from '../graphql/queries/concern-add-diagnosis-code-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  concernAddDiagnosisCodeMutation,
  concernAddDiagnosisCodeMutationVariables,
} from '../graphql/types';
import ErrorComponent from '../shared/error-component/error-component';
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
  concernAddDiagnosisCode: (
    options: ICreateOptions,
  ) => { data: concernAddDiagnosisCodeMutation; errors: ApolloError[] };
}

interface IState {
  newDiagnosisCode: string;
  loading: boolean;
  error: ApolloError | null;
}

type allProps = IProps & IGraphqlProps;

export class ConcernDiagnosisCodeCreate extends React.Component<allProps, IState> {
  state = {
    loading: false,
    error: null,
    newDiagnosisCode: '',
  };

  onSubmit = async () => {
    const { concernId, concernAddDiagnosisCode } = this.props;
    const { newDiagnosisCode } = this.state;

    this.setState({ loading: true, error: null });

    try {
      const response = await concernAddDiagnosisCode({
        variables: {
          concernId,
          code: newDiagnosisCode,
          codesetName: CODESET_NAME,
          version: CODESET_VERSION,
        },
      });
      if (response.errors) {
        this.setState({ loading: false, error: response.errors[0] });
      } else {
        this.setState({ loading: false, error: null, newDiagnosisCode: '' });
      }
    } catch (err) {
      this.setState({ loading: false, error: err });
    }
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    this.setState({ newDiagnosisCode: value });
  };

  render() {
    const { newDiagnosisCode, error } = this.state;
    const errorComponent = error ? <ErrorComponent error={error} /> : null;
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
        {errorComponent}
      </div>
    );
  }
}

export default graphql<any>(concernAddDiagnosisCodeMutationGraphql, {
  name: 'concernAddDiagnosisCode',
  options: {
    refetchQueries: ['concern'],
  },
})(ConcernDiagnosisCodeCreate) as React.ComponentClass<IProps>;
