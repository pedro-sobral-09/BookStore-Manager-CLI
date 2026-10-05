import { type Author, type AuthorInput, type AuthorUpdateInput } from '../models/author.models.js';
import { type AuthorServiceInterface } from '../services/author.service.js';

export interface AuthorControllerInterface {
    createAuthor(authorInput: AuthorInput): Promise<Author>;
    getAuthorById(id: string): Promise<Author>;
    getAuthorByName(name: string): Promise<Author>;
    listAuthors(): Promise<Author[]>;
    updateAuthor(id: string, authorUpdateInput: AuthorUpdateInput): Promise<Author>;
    deleteAuthor(id: string): Promise<boolean>;
}

export class CreateAuthorController implements AuthorControllerInterface {
    constructor(private authorService: AuthorServiceInterface) {}

    async createAuthor(authorInput: AuthorInput): Promise<Author> {
        if (!authorInput.name || !authorInput.nationality) {
            throw new Error('Author name or nationality are required');
        }

        return this.authorService.createAuthor(authorInput);
    }

    async getAuthorById(id: string): Promise<Author> {
        if (!id) {
            throw new Error('Author ID is required');
        }

        return this.authorService.getAuthorById(id);
    }

    async getAuthorByName(name: string): Promise<Author> {
        if (!name) {
            throw new Error('Author name is required');
        }

        return this.authorService.getAuthorByName(name);
    }

    async listAuthors(): Promise<Author[]> {
        return this.authorService.listAuthors();
    }

    async updateAuthor(id: string, authorUpdateInput: AuthorUpdateInput): Promise<Author> {
        if (!id) {
            throw new Error('Author ID is required');
        }
        
        if (!authorUpdateInput.name && !authorUpdateInput.nationality) {
            throw new Error('Author name or nationality are required');
        }

        return this.authorService.updateAuthor(id, authorUpdateInput);
    }

    async deleteAuthor(id: string): Promise<boolean> {
        if (!id) {
            throw new Error('Author ID is required');
        }

        return this.authorService.deleteAuthor(id);
    }
}