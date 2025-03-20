import { ModelUpload } from "@/types"

import { FetcherMethod, fetcher } from "./api"

export const upload = async (data: File): Promise<ModelUpload> => {
    return fetcher<ModelUpload>(FetcherMethod.POST, "/api/v1/file", data)
}