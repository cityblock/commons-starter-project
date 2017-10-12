import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import User from '../../models/user';
import schema from '../make-executable-schema';

describe('question tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let screeningTool: ScreeningTool;
  let question: Question;
  let question2: Question;
  let answer: Answer;
  let user: User;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });

    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    screeningTool = await ScreeningTool.create({
      title: 'screening tool',
      riskAreaId: riskArea.id,
    });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    question2 = await Question.create({
      title: 'hate writing tests?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      order: 1,
    });
    answer = await Answer.create({
      value: '3',
      valueType: 'number',
      displayValue: 'loves writing tests!',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve question', () => {
    it('can fetch question', async () => {
      const query = `{
        question(questionId: "${question.id}") {
          id, title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.question)).toMatchObject({
        id: question.id,
        title: 'like writing tests?',
      });
    });

    it('errors if an question cannot be found', async () => {
      const query = `{ question(questionId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch('No such question: fakeId');
    });
  });

  describe('question edit', () => {
    it('edits question', async () => {
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
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionEdit)).toMatchObject({
        title: 'new title',
        answerType: 'multiselect',
        order: 4,
      });
    });
  });

  describe('resolveQuestionsForRiskAreaOrScreeningTool', () => {
    it('gets questions for risk area', async () => {
      const query = `{
        questionsForRiskAreaOrScreeningTool(riskAreaId: "${riskArea.id}") {
          title, answerType, order, answers { id }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questionsForRiskAreaOrScreeningTool)).toMatchObject([
        {
          title: 'like writing tests?',
          answerType: 'dropdown',
          order: 1,
          answers: [{ id: answer.id }],
        },
      ]);
    });

    it('gets questions for screening tool', async () => {
      const query = `{
        questionsForRiskAreaOrScreeningTool(screeningToolId: "${screeningTool.id}") {
          title, answerType, order, answers { id }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questionsForRiskAreaOrScreeningTool)).toMatchObject([
        {
          title: 'hate writing tests?',
          answerType: 'dropdown',
          order: 1,
          answers: [],
        },
      ]);
    });
  });

  describe('question create', () => {
    it('creates a new question', async () => {
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
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionCreate)).toMatchObject({
        title: 'new title',
        answerType: 'radio',
        validatedSource: 'logan',
        riskAreaId: riskArea.id,
        order: 2,
      });
    });

    it('creates a new question for a screening tool', async () => {
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
        userRole,
        userId: user.id,
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

  describe('question delete', () => {
    it('marks an question as deleted', async () => {
      const mutation = `mutation {
        questionDelete(input: { questionId: "${question.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.questionDelete)).toMatchObject({
        id: question.id,
      });
    });
  });
});
