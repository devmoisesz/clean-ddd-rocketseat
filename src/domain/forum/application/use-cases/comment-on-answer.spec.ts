import { InMemoryAnswerRepository } from 'test/repositories-in-memory/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentRepository } from 'test/repositories-in-memory/in-memory-answer-comment-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let answersRepository: InMemoryAnswerRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let commentOnAnswerUseCase: CommentOnAnswerUseCase

describe('Comment on answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswerRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository()

    commentOnAnswerUseCase = new CommentOnAnswerUseCase(
      answersRepository, 
      answerCommentRepository
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    await commentOnAnswerUseCase.execute({
        answerId: answer.id.toString(),
        authorId: answer.authorId.toString(),
        content: 'Comment top'
    })

    expect(answerCommentRepository.items[0]?.content).toEqual('Comment top')
  })
})