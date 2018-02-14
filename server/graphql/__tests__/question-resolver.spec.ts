import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import ProgressNoteTemplate from '../../models/progress-note-template';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  question: Question;
  answer: Answer;
  user: User;
  clinic: Clinic;
  riskArea: RiskArea;
}

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      value: '3',
      valueType: 'number',
      displayValue: 'loves writing tests!',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  return { clinic, user, riskArea, question, answer };
}

describe('question tests', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve question', () => {
    it('can fetch question', async () => {
      await transaction(Question.knex(), async txn => {
        const { question, user } = await setup(txn);

        const query = `{
          question(questionId: "${question.id}") {
            id, title
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.question)).toMatchObject({
          id: question.id,
          title: 'like writing tests?',
        });
      });
    });

    it('errors if an question cannot be found', async () => {
      await transaction(Question.knex(), async txn => {
        const { user } = await setup(txn);
        const fakeId = uuid();
        const query = `{ question(questionId: "${fakeId}") { id } }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(result.errors![0].message).toMatch(`No such question: ${fakeId}`);
      });
    });
  });

  describe('question edit', () => {
    it('edits question', async () => {
      await transaction(Question.knex(), async txn => {
        const { question, user } = await setup(txn);
        const query = `mutation {
        questionEdit(input: {
          title: "new title"
          answerType: multiselect
          order: 4,
          questionId: "${question.id}"
        }) {
          title, answerType, order
        }
      }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questionEdit)).toMatchObject({
          title: 'new title',
          answerType: 'multiselect',
          order: 4,
        });
      });
    });

    it('adds an "other" answer to a question', async () => {
      await transaction(Question.knex(), async txn => {
        const { riskArea, user } = await setup(txn);
        const newQuestion = await Question.create(
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            riskAreaId: riskArea.id,
            type: 'riskArea',
            order: 1,
          },
          txn,
        );
        const fetchedQuestion = await Question.get(newQuestion.id, txn);
        expect(fetchedQuestion.otherTextAnswerId).toBeNull();
        const query = `mutation {
          questionEdit(input: {
            hasOtherTextAnswer: true
            questionId: "${newQuestion.id}"
          }) {
            otherTextAnswerId
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questionEdit).otherTextAnswerId).not.toBeNull();
      });
    });

    it('removes an "other" answer from a question', async () => {
      await transaction(Question.knex(), async txn => {
        const { riskArea, user } = await setup(txn);

        const newQuestion = await Question.create(
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            riskAreaId: riskArea.id,
            type: 'riskArea',
            order: 1,
            hasOtherTextAnswer: true,
          },
          txn,
        );
        const fetchedQuestion = await Question.get(newQuestion.id, txn);
        expect(fetchedQuestion.otherTextAnswerId).not.toBeNull();
        const query = `mutation {
          questionEdit(input: {
            hasOtherTextAnswer: false
            questionId: "${newQuestion.id}"
          }) {
            otherTextAnswerId
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questionEdit).otherTextAnswerId).toBeNull();
      });
    });
  });

  describe('resolveQuestions', () => {
    it('gets questions for risk area', async () => {
      await transaction(Question.knex(), async txn => {
        const { riskArea, user, answer } = await setup(txn);

        const query = `{
          questions(filterType: riskArea, filterId: "${riskArea.id}") {
            title, answerType, order, answers { id }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questions)).toMatchObject([
          {
            title: 'like writing tests?',
            answerType: 'dropdown',
            order: 1,
            answers: [{ id: answer.id }],
          },
        ]);
      });
    });

    it('gets questions for screening tool', async () => {
      await transaction(Question.knex(), async txn => {
        const { riskArea, user } = await setup(txn);

        const screeningTool = await ScreeningTool.create(
          {
            title: 'screening tool',
            riskAreaId: riskArea.id,
          },
          txn,
        );
        await Question.create(
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            screeningToolId: screeningTool.id,
            type: 'screeningTool',
            order: 1,
          },
          txn,
        );

        const query = `{
        questions(filterType: screeningTool, filterId: "${screeningTool.id}") {
          title, answerType, order, answers { id }
        }
      }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questions)).toMatchObject([
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            order: 1,
            answers: [],
          },
        ]);
      });
    });

    it('gets questions for progress note template', async () => {
      await transaction(Question.knex(), async txn => {
        const { user } = await setup(txn);

        const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' }, txn);
        await Question.create(
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            progressNoteTemplateId: progressNoteTemplate.id,
            type: 'progressNoteTemplate',
            order: 1,
          },
          txn,
        );

        const query = `{
        questions(filterType: progressNoteTemplate, filterId: "${progressNoteTemplate.id}") {
          title, answerType, order, answers { id }
        }
      }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questions)).toMatchObject([
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            order: 1,
            answers: [],
          },
        ]);
      });
    });
  });

  describe('question create', () => {
    it('creates a new question', async () => {
      await transaction(Question.knex(), async txn => {
        const { riskArea, user } = await setup(txn);

        const mutation = `mutation {
        questionCreate(input: {
          title: "new title"
          answerType: radio
          validatedSource: "logan"
          riskAreaId: "${riskArea.id}"
          order: 2
        }) {
          title, answerType, validatedSource, riskAreaId, order
        }
      }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questionCreate)).toMatchObject({
          title: 'new title',
          answerType: 'radio',
          validatedSource: 'logan',
          riskAreaId: riskArea.id,
          order: 2,
        });
      });
    });

    it('creates a new question for a screening tool', async () => {
      await transaction(Question.knex(), async txn => {
        const { riskArea, user } = await setup(txn);

        const screeningTool = await ScreeningTool.create(
          {
            title: 'screening tool',
            riskAreaId: riskArea.id,
          },
          txn,
        );
        await Question.create(
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            screeningToolId: screeningTool.id,
            type: 'screeningTool',
            order: 1,
          },
          txn,
        );

        const mutation = `mutation {
        questionCreate(input: {
          title: "new title",
          answerType: radio,
          validatedSource: "brennan"
          screeningToolId: "${screeningTool.id}"
          order: 2
        }) {
          title, answerType, validatedSource, screeningToolId, order
        }
      }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questionCreate)).toMatchObject({
          title: 'new title',
          answerType: 'radio',
          validatedSource: 'brennan',
          screeningToolId: screeningTool.id,
          order: 2,
        });
      });
    });

    it('creates a new question for a progress note template', async () => {
      await transaction(Question.knex(), async txn => {
        const { user } = await setup(txn);

        const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' }, txn);

        await Question.create(
          {
            title: 'hate writing tests?',
            answerType: 'dropdown',
            progressNoteTemplateId: progressNoteTemplate.id,
            type: 'progressNoteTemplate',
            order: 1,
          },
          txn,
        );

        const mutation = `mutation {
        questionCreate(input: {
          title: "new title",
          answerType: radio,
          validatedSource: "brennan"
          progressNoteTemplateId: "${progressNoteTemplate.id}"
          order: 2
        }) {
          title, answerType, validatedSource, progressNoteTemplateId, order
        }
      }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questionCreate)).toMatchObject({
          title: 'new title',
          answerType: 'radio',
          validatedSource: 'brennan',
          progressNoteTemplateId: progressNoteTemplate.id,
          order: 2,
        });
      });
    });

    it('creates a new question with an "other" answer', async () => {
      await transaction(Question.knex(), async txn => {
        const { riskArea, user } = await setup(txn);

        const mutation = `mutation {
        questionCreate(input: {
          title: "new title"
          answerType: dropdown
          validatedSource: "logan"
          riskAreaId: "${riskArea.id}"
          order: 2,
          hasOtherTextAnswer: true
        }) {
          title, answerType, validatedSource, riskAreaId, order, otherTextAnswerId
        }
      }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        const clonedResult = cloneDeep(result.data!.questionCreate);
        expect(clonedResult).toMatchObject({
          title: 'new title',
          answerType: 'dropdown',
          validatedSource: 'logan',
          riskAreaId: riskArea.id,
          order: 2,
        });
        expect(clonedResult.otherTextAnswerId).not.toBeNull();
      });
    });
  });

  describe('question delete', () => {
    it('marks an question as deleted', async () => {
      await transaction(Question.knex(), async txn => {
        const { question, user } = await setup(txn);

        const mutation = `mutation {
          questionDelete(input: { questionId: "${question.id}" }) {
            id
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.questionDelete)).toMatchObject({
          id: question.id,
        });
      });
    });
  });
});
