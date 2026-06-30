import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import type { SendNotificationUseCase } from "../use-cases/send-notification";
import { QuestionBestQuestionChosenEvent } from "@/domain/forum/events/question-best-answer-chosen-event";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionBestAnswerNotification.bind(this),
      QuestionBestQuestionChosenEvent.name,
    );
  }

  private async sendNewQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor!`,
      });
    }
  }
}
