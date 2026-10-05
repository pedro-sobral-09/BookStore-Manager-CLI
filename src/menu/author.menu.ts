import { rl } from '../utils/readline.js';
import { type AuthorUpdateInput } from '../models/author.models.js';
import { type AuthorControllerInterface } from '../controllers/author.controller.js';

export interface AuthorMenuInterface {
    showMenu(): Promise<void>;
}

export class CreateAuthorMenu implements AuthorMenuInterface {
    constructor(private authorController: AuthorControllerInterface) {}

    async showMenu(): Promise<void> {
        let exit = false;

        while (!exit) {
            console.clear();
            console.log('\nAuthor Menu:');
            console.log('1. Create Author');
            console.log('2. Get Author by ID');
            console.log('3. Get Author by Name');
            console.log('4. List Authors');
            console.log('5. Update Author');
            console.log('6. Delete Author');
            console.log('0. Exit');

            const choice = await rl.question('Select an option: ');

            switch (choice) {
                case '1': {
                    console.log('\nCreate Author:');
                    const name = await rl.question('Enter author name: ');
                    const nationality = await rl.question('Enter author nationality: ');
                    try {
                        const author = await this.authorController.createAuthor({ name, nationality });
                        console.log('Author created:', author);
                        await rl.question('Press Enter to continue.');
                    } catch (error) {
                        if (error instanceof Error) {
                            console.log(error.message);
                            await rl.question('Press Enter to continue.');
                        }
                    }
                    break;
                }

                case '2': {
                    console.log('\nGet Author by ID:');
                    const id = await rl.question('Enter author ID: ');
                    try {
                        const author = await this.authorController.getAuthorById(id);
                        console.log('Author found:', author);
                        await rl.question('Press Enter to continue.');
                    } catch (error) {
                        if (error instanceof Error) {
                            console.log(error.message);
                            await rl.question('Press Enter to continue.');
                        }
                    }
                    break;
                }

                case '3': {
                    console.log('\nGet Author by Name:');
                    const nameToSearch = await rl.question('Enter author name: ');
                    try {
                        const author = await this.authorController.getAuthorByName(nameToSearch);
                        console.log('Author found:', author);
                        await rl.question('Press Enter to continue.');
                    } catch (error) {
                        if (error instanceof Error) {
                            console.log(error.message);
                            await rl.question('Press Enter to continue.');
                        }
                    }
                    break;
                }

                case '4': {
                    console.log('\nList Authors:');
                    try {
                        const authors = await this.authorController.listAuthors();
                        console.log('Authors:', authors);
                        await rl.question('Press Enter to continue.');
                    } catch (error) {
                        if (error instanceof Error) {
                            console.log(error.message);
                            await rl.question('Press Enter to continue.');
                        }
                    }
                    break;
                }

                case '5':{
                    console.log('\nUpdate Author:');
                    const updateId = await rl.question('Enter author ID: ');
                    const updateName = await rl.question('Enter new author name (leave blank to keep current): ');
                    const updateNationality = await rl.question('Enter new author nationality (leave blank to keep current): ');
                    const authorUpdateInput: AuthorUpdateInput = {};
                    if (updateName) {
                        authorUpdateInput.name = updateName;
                    }
                    if (updateNationality) {
                        authorUpdateInput.nationality = updateNationality;
                    }
                    try {
                        const updatedAuthor = await this.authorController.updateAuthor(updateId, authorUpdateInput);
                        console.log('Author updated:', updatedAuthor);
                        await rl.question('Press Enter to continue.');
                    } catch (error) {
                        if (error instanceof Error) {
                            console.log(error.message);
                            await rl.question('Press Enter to continue.');
                        }
                    }
                    break;
                }

                case '6': {
                    console.log('\nDelete Author:');
                    const deleteId = await rl.question('Enter author ID: ');
                    try {
                        const success = await this.authorController.deleteAuthor(deleteId);
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
                    break;
                }

                case '0': {
                    exit = true;
                    break;
                }

                default: {
                    console.log('Invalid option.');
                    await rl.question('Press Enter to continue.');
                    break;
                }
            }
        }
    }
}