import { type Author, type AuthorInput, type AuthorUpdateInput } from '../models/author.models.js';
import { type  AuthorRepositoryInterface } from '../repositories/author.repository.js';

export interface AuthorServiceInterface {
    createAuthor(authorInput: AuthorInput): Promise<Author>;
    getAuthorById(id: string): Promise<Author>;
    getAuthorByName(name: string): Promise<Author>;
    listAuthors(): Promise<Author[]>;
    updateAuthor(id: string, authorUpdateInput: AuthorUpdateInput): Promise<Author>;
    deleteAuthor(id: string): Promise<boolean>;
}

export class AuthorService implements AuthorServiceInterface {
    constructor(private authorRepository: AuthorRepositoryInterface) {}
    
    async createAuthor(authorInput: AuthorInput): Promise<Author> {
        const authorExisting = await this.authorRepository.getAuthorByName(authorInput.name);
        
        if (authorExisting) {
            throw new Error('Author already exists');
        }

        const author = await this.authorRepository.createAuthor(authorInput);

        if (!author) {
            throw new Error('Failed to create author');
        }

        return author;
    }

    async getAuthorById(id: string): Promise<Author> {
        const author = await this.authorRepository.getAuthorById(id);

        if (!author) {
            throw new Error('Author not found');
        }

        return author;
    }

    async getAuthorByName(name: string): Promise<Author> {
        const author = await this.authorRepository.getAuthorByName(name);

        if (!author) {
            throw new Error('Author not found');
        }

        return author;
    }

    async listAuthors(): Promise<Author[]> {
        const authors = await this.authorRepository.listAuthors();

        if (!authors) {
            throw new Error('Failed to list authors');
        }

        return authors;
    }

    async updateAuthor(id: string, authorUpdateInput: AuthorUpdateInput): Promise<Author> {
        if (authorUpdateInput.name) {
            const authorExisting = await this.authorRepository.getAuthorByName(authorUpdateInput.name);
            
            if (authorExisting && authorExisting.id !== id) {
                throw new Error('Author with this name already exists');
            }
        }

        const author = await this.authorRepository.updateAuthor(id, authorUpdateInput);
        
        if (!author) {
            throw new Error('Failed to update author');
        }

        return author;
    }

    async deleteAuthor(id: string): Promise<boolean> {
        const author = await this.authorRepository.getAuthorById(id);

        if (!author) {
            throw new Error('Author not found');
        }
        
        const deleted = await this.authorRepository.deleteAuthor(id);
        
        if (!deleted) {
            throw new Error('Failed to delete author');
        }

        return deleted;
    }
}