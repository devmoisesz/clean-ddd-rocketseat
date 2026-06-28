import { InMemoryQuestionRepository } from 'test/repositories-in-memory/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentRepository } from 'test/repositories-in-memory/in-memory-question-comment-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let questionsRepository: InMemoryQuestionRepository
let questionCommentRepository: InMemoryQuestionCommentRepository
let commentOnQuestionUseCase: CommentOnQuestionUseCase

describe('Comment on question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    questionCommentRepository = new InMemoryQuestionCommentRepository()

    commentOnQuestionUseCase = new CommentOnQuestionUseCase(
      questionsRepository, 
      questionCommentRepository
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    await commentOnQuestionUseCase.execute({
        questionId: question.id.toString(),
        authorId: question.authorId.toString(),
        content: 'Comment top'
    })

    expect(questionCommentRepository.items[0]?.content).toEqual('Comment top')
  })
})