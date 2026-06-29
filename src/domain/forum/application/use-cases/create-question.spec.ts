import { UniqueEntityID } from '@/core/entities/unique-entity-id'
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
    content: 'Content question',
    attachmentsIds: ['1', '2']
  })

  expect(result.isRight()).toBe(true)
  expect(questionsRepository.items[0]).toEqual(result.value?.question)
  expect(questionsRepository.items[0]?.attachments).toHaveLength(2)
  expect(questionsRepository.items[0]?.attachments).toEqual([
    expect.objectContaining({ attachmentId: new UniqueEntityID('1'), }),
    expect.objectContaining({ attachmentId: new UniqueEntityID('2'), })
  ])
  })
})

