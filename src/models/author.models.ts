export interface Author {
    id: string;
    name: string;
    nationality?: string;
}

export interface AuthorInput {
    name: string;
    nationality?: string;
}