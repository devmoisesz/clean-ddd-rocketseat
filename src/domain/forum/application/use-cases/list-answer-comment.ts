import type { AnswerComment } from "../../enterprise/entities/answer-comment";
import type { AnswerCommentRepository } from "../repositories/answer-comment-repository";


interface ListAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

interface ListAnswerCommentsUseCaseResponse {
  answerComments: AnswerComment[] 
}

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    answerId,
    page
  }: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentRepository.findManyByAnswerId(answerId, {page})

    return {
        answerComments
    }
  }
}
