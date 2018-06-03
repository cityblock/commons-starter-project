import * as React from 'react';
import { graphql } from 'react-apollo';
import * as JwtForPdfCreate from '../../graphql/queries/jwt-for-pdf-create.graphql';
import { JwtForPdfCreateMutation, JwtForPdfCreateMutationVariables } from '../../graphql/types';
import { getPrintableCalendarPdfRoute } from '../../shared/helpers/route-helpers';
import Modal from '../../shared/library/modal/modal';
import MonthSelect from './month-select';

interface IProps {
  patientId: string;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

interface IGraphqlProps {
  generateJwtForPdf: (
    options: { variables: JwtForPdfCreateMutationVariables },
  ) => { data: JwtForPdfCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isLoading: boolean;
  error: string | null;
  month?: number;
  year?: number;
}

export class PrintMapButton extends React.Component<allProps, IState> {
  state = {
    isLoading: false,
    error: null,
    month: undefined,
    year: undefined,
  };

  handleSubmit = async (): Promise<void> => {
    const { generateJwtForPdf, patientId } = this.props;
    const { month, year } = this.state;

    if (!this.state.isLoading && month && year) {
      try {
        this.setState({ isLoading: true, error: null });
        const JwtForPdf = await generateJwtForPdf({ variables: { patientId } });

        const win = window.open(
          getPrintableCalendarPdfRoute(
            patientId,
            month,
            year,
            JwtForPdf.data.JwtForPdfCreate.authToken,
          ),
          '_blank',
        );

        if (win) {
          win.focus();
        }

        this.setState({ isLoading: false, error: null });
      } catch (err) {
        this.setState({ isLoading: false, error: err.message });
      }
    }
  };

  handleMonthChange = (month: number, year: number) => {
    this.setState({ month, year });
  };

  render(): JSX.Element {
    const { isVisible, onClose } = this.props;
    const { error, isLoading, month, year } = this.state;
    return (
      <Modal
        isVisible={isVisible}
        titleMessageId="printCalendarModal.title"
        cancelMessageId="printCalendarModal.cancel"
        submitMessageId="printCalendarModal.print"
        error={error}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={this.handleSubmit}
      >
        <MonthSelect year={year} month={month} onChange={this.handleMonthChange} />
      </Modal>
    );
  }
}

export default graphql<any>(JwtForPdfCreate as any, {
  name: 'generateJwtForPdf',
})(PrintMapButton) as React.ComponentClass<IProps>;
