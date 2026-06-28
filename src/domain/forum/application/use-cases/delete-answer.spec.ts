import { InMemoryAnswerRepository } from '../../../../../test/repositories-in-memory/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let answerRepository: InMemoryAnswerRepository
let deleteAnswerUseCase: DeleteAnswerUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    deleteAnswerUseCase = new DeleteAnswerUseCase(answerRepository)
  })

  it('should be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('answer-1'))

      await answerRepository.create(newAnswer)

      await deleteAnswerUseCase.execute({
          answerId: 'answer-1',
          authorId: 'author-1'
      })

    expect(answerRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('answer-1')
    )

    answerRepository.create(newAnswer)

    const result = await deleteAnswerUseCase.execute({
        answerId: 'answer-1',
        authorId: 'author-2'
      })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})