import { InMemoryAnswerRepository } from 'test/repositories-in-memory/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let answerRepository: InMemoryAnswerRepository
let answerUseCase: AnswerQuestionUseCase

  describe('Create Question', () => {
    beforeEach(() => {
      answerRepository = new InMemoryAnswerRepository()
      answerUseCase = new AnswerQuestionUseCase(answerRepository)
    })

    it('should be able to create an answer', async () => {
    const result = await answerUseCase.execute({
      questionId: '1',
      instructorId: '1',
      content: 'new content'
    })

    expect(result.isRight()).toBe(true)
    expect(answerRepository.items[0]).toEqual(result.value?.answer)
  })
})