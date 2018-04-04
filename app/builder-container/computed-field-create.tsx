import { History } from 'history';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as computedFieldCreateMutationGraphql from '../graphql/queries/computed-field-create-mutation.graphql';
import {
  computedFieldCreateMutation,
  computedFieldCreateMutationVariables,
  ComputedFieldDataTypes,
} from '../graphql/types';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as computedFieldStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';
import * as styles from './css/risk-area-create.css';

interface IOptions {
  variables: computedFieldCreateMutationVariables;
}

interface IProps extends IInjectedErrorProps {
  routeBase: string;
  onClose: () => any;
  history: History;
}

interface IGraphqlProps {
  createComputedField?: (options: IOptions) => { data: computedFieldCreateMutation };
}

interface IState {
  loading: boolean;
  computedField: computedFieldCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

export class ComputedFieldCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      loading: false,
      computedField: { label: '', dataType: 'boolean' as ComputedFieldDataTypes },
    };
  }

  onFieldUpdate = (updatedField: IUpdatedField) => {
    const { computedField } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (computedField as any)[fieldName] = fieldValue;

    this.setState({ computedField });
  };

  onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.onFieldUpdate({ fieldName, fieldValue });
  };

  onSubmit = async () => {
    const { createComputedField, onClose, history, routeBase, openErrorPopup } = this.props;
    const { computedField } = this.state;
    const { label, dataType } = computedField;
    const allFieldsComplete = !isEmpty(label) && !isEmpty(dataType);

    if (createComputedField && allFieldsComplete) {
      try {
        this.setState({ loading: true });

        const result = await createComputedField({
          variables: {
            ...computedField,
          },
        });
        const { data } = result;

        this.setState({ loading: false });
        onClose();

        if (data.computedFieldCreate) {
          history.push(`${routeBase}/${data.computedFieldCreate.id}`);
        }
      } catch (err) {
        this.setState({ loading: false });
        openErrorPopup(err.message);
      }
    }
    return false;
  };

  render() {
    const { loading, computedField } = this.state;
    const { onClose } = this.props;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    const dataTypeOptions = ['boolean', 'number', 'string'].map((dataTypeOption, index) => (
      <Option key={`${dataTypeOption}-${index}`} value={dataTypeOption} label={dataTypeOption} />
    ));

    return (
      <div className={computedFieldStyles.container}>
        <div className={styles.formTop}>
          <div className={styles.close} onClick={onClose} />
        </div>
        <div className={styles.formCenter}>
          <div className={loadingClass}>
            <div className={styles.loadingContainer}>
              <div className={loadingStyles.loadingSpinner} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <TextInput
              name="label"
              value={computedField.label}
              placeholderMessageId="computedFieldCreate.createLabelPlaceholder"
              onChange={this.onChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <FormLabel htmlFor="dataType" messageId="computedFieldCreate.createDataTypeLabel" />
            <Select name="dataType" value={computedField.dataType} onChange={this.onChange}>
              {dataTypeOptions}
            </Select>
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button color="white" onClick={onClose} messageId="computedFieldCreate.cancel" />
            <Button onClick={this.onSubmit} label="Add computed field" />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withErrorHandler(),
  graphql<IGraphqlProps, IProps, allProps>(computedFieldCreateMutationGraphql as any, {
    name: 'createComputedField',
    options: {
      refetchQueries: ['getComputedFields'],
    },
  }),
)(ComputedFieldCreate);
