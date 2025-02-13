import { Task, TaskType } from "@prisma/client";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IWorkspaceInterface } from "../../repositories/IWorkspaceRepository";
import { IUserWorkspaceRepository } from "../../repositories/IUserWorkspaceRepository";
import { IDocumentRepository } from "../../repositories/IDocumentRepository";
import { z } from "zod";

/*
id: string;
    title: string;
    description: string;
    status: TaskStatus;
    type: TaskType;
    documentId: string;
    endDate: Date;
    workId: string;
    userId: string;
*/

interface ICreateTaskUseCaseRequest {
    userId: string,
    accessCode: string,
    title: string,
    description: string,
    status: string,
    type: string,
    endDate: Date,
}

interface ICreateTaskUseCaseReply {
    task: Task
}

export class CreateTaskUseCase {
    constructor(
        private taskRepository: ITaskRepository, 
        private userRepository: IUserRepository, 
        private workspaceRepository: IWorkspaceInterface,
        private userWorkspaceRepository: IUserWorkspaceRepository,
        private documentRepository: IDocumentRepository
    ) {}

    async handle({
        accessCode,
        description,
        endDate,
        status,
        title,
        type,
        userId,
    }: ICreateTaskUseCaseRequest): Promise<ICreateTaskUseCaseReply> {
        const user = await this.userRepository.findById(userId);
        if(!user) {
            throw new Error();
        }

        const workspace = await this.workspaceRepository.findByCode(accessCode);
        if (!workspace) {
            throw new Error();
        }

        const userWorkspace = await this.userWorkspaceRepository.findUserInWorkspace(userId, workspace.id);
        if(!userWorkspace) {
            throw new Error();
        }

        const document = await this.documentRepository.create({
            text: `${title} documentation`,
            title,
        })

        const typeEnum = z.nativeEnum(TaskType);
        const checkedType = typeEnum.parse(type);

        const task = await this.taskRepository.create({
            description,
            documentId: document.id,
            endDate,
            title,
            type: checkedType,
            userId,
            workId: workspace.id,
        })

        return {
            task,
        }
    }
}