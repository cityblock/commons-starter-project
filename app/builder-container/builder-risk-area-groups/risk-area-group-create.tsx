import * as React from 'react';
import { graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as createRiskAreaGroupMutationGraphql from '../../graphql/queries/risk-area-group-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  riskAreaGroupCreateMutation,
  riskAreaGroupCreateMutationVariables,
} from '../../graphql/types';
import Button from '../../shared/library/button/button';
import TextInput from '../../shared/library/text-input/text-input';
import * as styles from './css/risk-area-group-shared.css';

interface IProps {
  cancelCreateRiskAreaGroup: () => void;
}

interface IGraphqlProps {
  createRiskAreaGroup: (
    options: { variables: riskAreaGroupCreateMutationVariables },
  ) => { data: riskAreaGroupCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  title: string;
  mediumRiskThreshold: string;
  highRiskThreshold: string;
  loading: boolean;
  error: string | null;
}

type Field = 'title' | 'mediumRiskThreshold' | 'highRiskThreshold';

export class RiskAreaGroupCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      title: '',
      mediumRiskThreshold: '',
      highRiskThreshold: '',
      loading: false,
      error: null,
    };
  }

  onChange = (field: Field): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({ [field as any]: e.currentTarget.value });
    };
  };

  onSubmit = async () => {
    const { createRiskAreaGroup, cancelCreateRiskAreaGroup } = this.props;
    const { title, mediumRiskThreshold, highRiskThreshold, loading } = this.state;
    // prevent submitting with no risk threshold
    if (!loading && mediumRiskThreshold && highRiskThreshold) {
      try {
        this.setState({ loading: true, error: null });

        await createRiskAreaGroup({
          variables: {
            title,
            mediumRiskThreshold: Number(mediumRiskThreshold),
            highRiskThreshold: Number(highRiskThreshold),
          },
        });
        cancelCreateRiskAreaGroup();
      } catch (err) {
        this.setState({ error: err.message });
      }
    }
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { cancelCreateRiskAreaGroup } = this.props;
    const { title, mediumRiskThreshold, highRiskThreshold } = this.state;

    return (
      <div>
        <div className={styles.buttons}>
          <Button
            messageId="riskAreaGroup.close"
            icon="close"
            color="white"
            className={styles.button}
            onClick={cancelCreateRiskAreaGroup}
          />
        </div>
        <div className={styles.fields}>
          <TextInput
            value={title}
            onChange={this.onChange('title')}
            placeholderMessageId="riskAreaGroup.title"
          />
          <TextInput
            value={mediumRiskThreshold}
            onChange={this.onChange('mediumRiskThreshold')}
            placeholderMessageId="riskAreaGroup.mediumRiskThreshold"
          />
          <TextInput
            value={highRiskThreshold}
            onChange={this.onChange('highRiskThreshold')}
            placeholderMessageId="riskAreaGroup.highRiskThreshold"
          />
        </div>
        <div className={styles.buttons}>
          <Button
            messageId="modalButtons.cancel"
            onClick={cancelCreateRiskAreaGroup}
            color="white"
            small={true}
          />
          <Button messageId="riskAreaGroup.create" onClick={this.onSubmit} small={true} />
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(createRiskAreaGroupMutationGraphql as any, {
  name: 'createRiskAreaGroup',
  options: {
    refetchQueries: ['getRiskAreaGroups'],
  },
})(RiskAreaGroupCreate);
