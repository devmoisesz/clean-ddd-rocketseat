import type { PaginationParams } from "@/core/repositories/pagination-params"
import type { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository"
import type { Answer } from "@/domain/forum/enterprise/entities/answer"


export class InMemoryAnswerRepository implements AnswerRepository {
    public items: Answer[] = []

    async findManyByQuestionId(questionId: string, { page }: PaginationParams){
        const answers = this.items
            .filter((item) => item.questionId.toString() === questionId)
            .slice((page - 1) * 20, page * 20)
        
        return answers
    }

    async save(answer: Answer) {
        const itemIndex = this.items.findIndex((item) => item.id === answer.id)

        this.items[itemIndex] = answer
    }

    async delete(answer: Answer){
        const itemIndex = this.items.findIndex((item) => item.id === answer.id)

        this.items.splice(itemIndex, 1)
    }

    async findById(id: string) {
        const answer = this.items.find((item) => item.id.toString() === id)
        
        if(!answer) return null
        
        return answer
    }

    async create(answer: Answer) {
        this.items.push(answer)
    }
    
}