import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '../../../../core/types/optional'
import { Comment } from './comment'
import type { CommentProps } from './comment'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionCommentCreatedEvent } from '../../events/question-comment-created'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {

    get questionId(){
        return this.props.questionId
    }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    if(isNewQuestionComment) {
      questionComment.addDomainEvent(new QuestionCommentCreatedEvent(questionComment))
    }

    return questionComment
  }
}

