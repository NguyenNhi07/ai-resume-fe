export type CreateResume = {
  data: {
    title: string
    resumeId: string
    userEmail?: string
    userName?: string | null
  }
}

export type GetResume = {
    data: Resume[]
    meta: Pagination
}

export type Resume = {
    id: number,
    documentId: string,
    title: string,
    resumeId: string,
    userEmail: string,
    userName: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string
}

export type Pagination = {
    pagination: {
        page: number,
        pageSize: number,
        pageCount: number,
        total: number
    }
}