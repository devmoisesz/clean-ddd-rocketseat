import { InMemoryQuestionRepository } from 'test/repositories-in-memory/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { ListRecentQuestionsUseCase } from './list-recent-questions'

let questionsRepository: InMemoryQuestionRepository
let listRecentQuestionsUseCase: ListRecentQuestionsUseCase

describe('List Recent Questions', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    listRecentQuestionsUseCase = new ListRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20)})
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18)})
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23)})
    )

    const { questions } = await listRecentQuestionsUseCase.execute({
      page: 1
    })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23)}),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20)}),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18)})
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for(let i = 1; i <= 22; i++){
      await questionsRepository.create(makeQuestion())
    }

    const { questions } = await listRecentQuestionsUseCase.execute({
      page: 2
    })

    expect(questions).toHaveLength(2)
  })
})
