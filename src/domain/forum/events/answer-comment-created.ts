import type { DomainEvent } from "@/core/events/domain-event";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { AnswerComment } from "../enterprise/entities/answer-comment";

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(
    public answerComment: AnswerComment,
  ) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.answerId;
  }
}