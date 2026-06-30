import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import type { SendNotificationUseCase } from "../use-cases/send-notification";
import type { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerCommentCreatedEvent } from "@/domain/forum/events/answer-comment-created";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { left } from "@/core/either";
import { ResourceNotFoundError } from "@/core/error/errors/resource-not-found-error";

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerCommentRepository: AnswerCommentRepository,
    private answersRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString()
    )

    if(!answer){
      return left(new ResourceNotFoundError())
    }

    const comment = await this.answerCommentRepository.findById(
      answerComment.id.toString()
    );

    if (comment) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua Resposta acabou de receber um comentário!`,
        content: `A sua resposta da pergunta "${answer.content.substring(0, 20).concat('...')}" acabou de receber um comentário`,
      });
    }
  }
}
