import { type AuthorUpdateInput } from '../models/author.models.js';
import { type AuthorServiceInterface } from '../services/author.service.js';
import { rl } from '../utils/readline.js';

export interface AuthorControllerInterface {
    createAuthor(): Promise<void>;
    getAuthorById(): Promise<void>;
    getAuthorByName(): Promise<void>;
    listAuthors(): Promise<void>;
    updateAuthor(): Promise<void>;
    deleteAuthor(): Promise<void>;
}

export class AuthorController implements AuthorControllerInterface {
    constructor(private authorService: AuthorServiceInterface) {}

    async createAuthor(): Promise<void> {
        try {
            const name = await rl.question('Enter author name: ');
            const nationality = await rl.question('Enter author nationality: ');

            if (!name  ||  name.trim() === '') {
                throw new Error('Author name is required');
            }
            
            const author = await this.authorService.createAuthor({ name, nationality });

            console.log('Author created:', author);

            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async getAuthorById(): Promise<void> {
        try {
            const id = await rl.question('Enter author ID: ');

            if (!id) {
                throw new Error('Author ID is required');
            }

            const author = await this.authorService.getAuthorById(id);

            console.log('Author found:', author);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async getAuthorByName(): Promise<void> {
        try {
            const authorToSearch = await rl.question('Enter author name: ');

            if (!authorToSearch || authorToSearch.trim() === '') {
                throw new Error('Author name is required');
            }

            const author = await this.authorService.getAuthorByName(authorToSearch);

            console.log('Author found:', author);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
        
        
    }

    async listAuthors(): Promise<void> {
        try {
            const authors = await this.authorService.listAuthors();
            
            console.log('Authors:', authors);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async updateAuthor(): Promise<void> {
        try {
            const updateId = await rl.question('Enter author ID: ');

            if (!updateId) {
                throw new Error('Author ID is required');
            }

            const updateName = await rl.question('Enter new author name (leave blank to keep current): ');
            const updateNationality = await rl.question('Enter new author nationality (leave blank to keep current): ');

            if (!updateName || updateName.trim() === '' || !updateNationality || updateNationality.trim() === '') {
                throw new Error('Author name or nationality are required');
            }
            
            const authorUpdateInput: AuthorUpdateInput = {};

            if (updateName) {
                authorUpdateInput.name = updateName;
            }

            if (updateNationality) {
                authorUpdateInput.nationality = updateNationality;
            }

            const updatedAuthor = await this.authorService.updateAuthor(updateId, authorUpdateInput);

            console.log('Author updated:', updatedAuthor);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async deleteAuthor(): Promise<void> {
        try {
            const deleteId = await rl.question('Enter author ID: ');

            if (!deleteId) {
                throw new Error('Author ID is required');
            }

            const success = await this.authorService.deleteAuthor(deleteId);

            if (success) {
                console.log('Author deleted successfully.');
                await rl.question('Press Enter to continue.');
            } else {
                console.log('Failed to delete author.');
                await rl.question('Press Enter to continue.');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }
}