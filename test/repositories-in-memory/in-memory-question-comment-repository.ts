import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentRepository } from '../../src/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment"
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionCommentRepository implements QuestionCommentRepository {
    public items: QuestionComment[] = []

    async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
        const questionComments = this.items
            .filter((item) => item.questionId.toString() === questionId)
            .slice((page - 1) * 20, page * 20)
        
        return questionComments
    }

    async findById(id: string) {
        const question = this.items.find((item) => item.id.toString() === id)

        if(!question) return null

        return question
    }

    async delete(questionComment: QuestionComment) {
        const itemIndex = this.items.findIndex(
            (item) => item.id === questionComment.id
        )

        this.items.splice(itemIndex, 1)
    }
    
    async create(questionComment: QuestionComment) {
        this.items.push(questionComment)

        DomainEvents.dispatchEventsForAggregate(questionComment.id);
    }
    
}