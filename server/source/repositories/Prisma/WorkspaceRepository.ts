import { Prisma, User_Workspace, Workspace } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { IWorkspaceInterface } from "../IWorkspaceRepository";

export class WorkspaceRepository implements IWorkspaceInterface{
    async findById(id: string): Promise<Workspace | null> {
        const workspace = await prisma.workspace.findUnique({
            where: {
                id: id
            }
        })
        return workspace
    }

    async findByCode(code: string): Promise<Workspace | null> {
        const workspace = await prisma.workspace.findUnique({
            where: {
                accessCode: code
            }
        })
        return workspace
    }

    async create(data: Prisma.WorkspaceCreateInput): Promise<Workspace> {
        const workspace = await prisma.workspace.create({
            data,
        })
        return workspace
    }

    async findWorkspaceList(ids: string[]): Promise<Workspace[] | null> {
        const elements = await prisma.workspace.findMany({
            where: {
                id: {
                    in: ids,
                }
            }
        })
        return elements
    }
}