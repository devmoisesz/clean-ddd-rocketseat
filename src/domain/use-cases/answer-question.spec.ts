import { AnswerQuestionUseCase } from './answer-question'
import type { AnswerRepository } from '../../repositories/answers-repository'
import type { Answer } from '../entities/answer'

const fakeAnswersRepository: AnswerRepository = {
    create: async (answer: Answer) => {
        return;
    }
}

test('create an answer', async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

    const answer = await answerQuestion.execute({
        questionId: '1',
        instructorId: '1',
        content: 'New answer'
    })

    expect(answer.content).toEqual('New answer')
})