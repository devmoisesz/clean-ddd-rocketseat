import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import type { SendNotificationUseCase } from "../use-cases/send-notification";
import type { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionCommentCreatedEvent } from "@/domain/forum/events/question-comment-created";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/question-repository";
import { left } from "@/core/either";
import { ResourceNotFoundError } from "@/core/error/errors/resource-not-found-error";

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionCommentRepository: QuestionCommentRepository,
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    );
  }

  private async sendNewQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString()
    )

    if(!question){
      return left(new ResourceNotFoundError())
    }

    const comment = await this.questionCommentRepository.findById(
      questionComment.id.toString()
    );

    if (comment) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Sua Pergunta acabou de receber um comentário!`,
        content: `A sua pergunta "${question.title.substring(0, 20).concat('...')}" acabou de receber um comentário`,
      });
    }
  }
}
