import { InMemoryQuestionRepository } from 'test/repositories-in-memory/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let questionsRepository: InMemoryQuestionRepository
let deleteQuestionUseCase: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('question-1'))

      questionsRepository.create(newQuestion)

      await deleteQuestionUseCase.execute({
          questionId: 'question-1',
          authorId: 'author-1'
      })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('question-1')
    )

    questionsRepository.create(newQuestion)

    await expect (() => {
      return deleteQuestionUseCase.execute({
        questionId: 'question-1',
        authorId: 'author-2'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})