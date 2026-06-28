import { InMemoryAnswerRepository } from 'test/repositories-in-memory/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'

let answersRepository: InMemoryAnswerRepository
let editAnswerUseCase: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswerRepository()
    editAnswerUseCase = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('answer-1'))

      answersRepository.create(newAnswer)

      await editAnswerUseCase.execute({
          answerId: newAnswer.id.toValue(),
          authorId: 'author-1',
          content: 'test content'
      })

    expect(answersRepository.items[0]).toMatchObject({
        content: 'test content'
    })
  })

  it('should not be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('answer-1')
    )

    answersRepository.create(newAnswer)

    await expect (() => {
      return editAnswerUseCase.execute({
        answerId: newAnswer.id.toValue(),
        authorId: 'author-2',
        content: 'test content'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})