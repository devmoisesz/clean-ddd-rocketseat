import { InMemoryAnswerAttachmentRepository } from "test/repositories-in-memory/in-memory-answer-attachments-repository"
import { InMemoryAnswerRepository } from "test/repositories-in-memory/in-memory-answers-repository"
import { SendNotificationUseCase, type SendNotificationUseCaseRequest, type SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryNotificationRepository } from "test/repositories-in-memory/in-memory-notification-repository"
import { makeAnswer } from "test/factories/make-answer"
import type { MockInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"
import { makeAnswerComment } from "test/factories/make-answer-comment"
import { InMemoryAnswerCommentRepository } from "test/repositories-in-memory/in-memory-answer-comment-repository"
import { OnAnswerCommentCreated } from "./on-answer-comment-created"
import { makeQuestion } from "test/factories/make-question"
import { InMemoryQuestionRepository } from "test/repositories-in-memory/in-memory-questions-repository"
import type { QuestionsRepository } from "@/domain/forum/application/repositories/question-repository"
import { InMemoryQuestionAttachmentRepository } from "test/repositories-in-memory/in-memory-question-attachments-repository"

let answersRepository: InMemoryAnswerRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let questionsAttachmentsRepository: InMemoryQuestionAttachmentRepository
let questionRepository: InMemoryQuestionRepository
let notificationRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
    (
        request: SendNotificationUseCaseRequest,
    ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        answersRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
        answerCommentRepository = new InMemoryAnswerCommentRepository()
        questionsAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
        questionRepository = new InMemoryQuestionRepository(questionsAttachmentsRepository)
        notificationRepository = new InMemoryNotificationRepository()
        sendNotificationUseCase = new SendNotificationUseCase(notificationRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnAnswerCommentCreated(answerCommentRepository, answersRepository,sendNotificationUseCase)
    })
    it('should send a notification when an answer receives a comment', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({questionId: question.id})
        const answerComment = makeAnswerComment({answerId: answer.id})

        questionRepository.create(question)
        answersRepository.create(answer)
        answerCommentRepository.create(answerComment)
        

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})