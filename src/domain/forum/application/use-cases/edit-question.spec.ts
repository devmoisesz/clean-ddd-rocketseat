import { InMemoryQuestionRepository } from 'test/repositories-in-memory/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'

let questionsRepository: InMemoryQuestionRepository
let editQuestionUseCase: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    editQuestionUseCase = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('question-1'))

      questionsRepository.create(newQuestion)

      await editQuestionUseCase.execute({
          questionId: newQuestion.id.toValue(),
          authorId: 'author-1',
          title: 'test question',
          content: 'test content'
      })

    expect(questionsRepository.items[0]).toMatchObject({
        title: 'test question',
        content: 'test content'
    })
  })

  it('should not be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1')
      }, 
      new UniqueEntityID('question-1')
    )

    questionsRepository.create(newQuestion)

    const result = await editQuestionUseCase.execute({
        questionId: newQuestion.id.toValue(),
        authorId: 'author-2',
        title: 'test question',
        content: 'test content'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})