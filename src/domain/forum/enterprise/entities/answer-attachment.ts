import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface AnswerAttachmentProps {
    answerId: UniqueEntityID
    attachment: string
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps>{
    get answerId(){
        return this.props.answerId
    }

    get attachmentId() {
        return this.props.attachment
    }

    static create(props: AnswerAttachmentProps, id?: UniqueEntityID){
        const answerAttachment = new AnswerAttachment(props, id)
    
        return answerAttachment
    }
}