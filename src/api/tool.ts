import { ModelToolForm } from "@/types"

import { FetcherMethod, fetcher } from "./api"

export const createTool = async (data: ModelToolForm): Promise<number> => {
    return fetcher<number>(FetcherMethod.POST, "/api/v1/ddns", data)
}

export const updateTool = async (id: number, data: ModelToolForm): Promise<void> => {
    return fetcher<void>(FetcherMethod.PATCH, `/api/v1/tool/${id}`, data)
}

export const deleteTool = async (id: number[]): Promise<void> => {
    return fetcher<void>(FetcherMethod.POST, "/api/v1/batch-delete/tool", id)
}
