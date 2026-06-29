import { InMemoryQuestionRepository } from 'test/repositories-in-memory/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories-in-memory/in-memory-question-attachments-repository'

let questionsRepository: InMemoryQuestionRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentRepository)
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('question-example')
    })

    questionsRepository.create(newQuestion)

    const result = await getQuestionBySlugUseCase.execute({
        slug: 'question-example'
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.question.id).toBeTruthy()
      expect(result.value.question.title).toEqual(newQuestion.title)
    }
  })
})

