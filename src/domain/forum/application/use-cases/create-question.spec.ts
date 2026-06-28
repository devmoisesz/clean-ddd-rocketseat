import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRepository } from 'test/repositories-in-memory/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionRepository
let createQuestionUseCase: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create question', async () => {
    const result = await createQuestionUseCase.execute({
    authorId: '1',
    title: 'new question',
    content: 'Content question'
  })

  expect(result.isRight()).toBe(true)
  expect(questionsRepository.items[0]).toEqual(result.value?.question)
  })
})

