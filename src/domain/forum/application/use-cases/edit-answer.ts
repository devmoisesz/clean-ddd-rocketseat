import { left, right, type Either } from "@/core/either";
import type { Answer } from "../../enterprise/entities/answer";
import type { AnswerRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentList } from "../../enterprise/answer-attachment-list";
import type { AnswerAttachmentRepository } from "../repositories/answer-attchments-repository";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswerRepository,
    private answerAttachmentsRepository: AnswerAttachmentRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentsList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentsList.update(answerAttachments);

    answer.attachments = answerAttachmentsList;
    answer.content = content;

    await this.answersRepository.save(answer);

    return right({
      answer,
    });
  }
}
