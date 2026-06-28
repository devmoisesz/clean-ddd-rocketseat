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
    const { question }= await createQuestionUseCase.execute({
    authorId: '1',
    title: 'new question',
    content: 'Content question'
  })

  expect(question.id).toBeTruthy()
  expect(questionsRepository.items[0]?.id).toEqual(question.id)
  })
})

