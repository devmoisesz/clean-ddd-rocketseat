import { makeAnswer } from "test/factories/make-answer"
import { InMemoryAnswerRepository } from "test/repositories-in-memory/in-memory-answers-repository"
import { InMemoryAnswerAttachmentRepository } from "test/repositories-in-memory/in-memory-answer-attachments-repository"
import { InMemoryQuestionRepository } from "test/repositories-in-memory/in-memory-questions-repository"
import { InMemoryQuestionAttachmentRepository } from "test/repositories-in-memory/in-memory-question-attachments-repository"
import { SendNotificationUseCase, type SendNotificationUseCaseRequest, type SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryNotificationRepository } from "test/repositories-in-memory/in-memory-notification-repository"
import { makeQuestion } from "test/factories/make-question"
import type { MockInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen"

let questionsAttachmentRepository: InMemoryQuestionAttachmentRepository
let questionsRepository: InMemoryQuestionRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let answerRepository: InMemoryAnswerRepository
let notificationRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
    (
        request: SendNotificationUseCaseRequest,
    ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
    beforeEach(() => {
        questionsAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        questionsRepository = new InMemoryQuestionRepository(questionsAttachmentRepository)
        answerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
        notificationRepository = new InMemoryNotificationRepository()
        sendNotificationUseCase = new SendNotificationUseCase(notificationRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnQuestionBestAnswerChosen(answerRepository, sendNotificationUseCase)
    })
    it('should send a notification when topic has new best answer chosen', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id})

        questionsRepository.create(question)
        answerRepository.create(answer)

        question.bestAnswerId = answer.id

        questionsRepository.save(question)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})