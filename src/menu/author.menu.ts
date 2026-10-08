import { rl } from '../utils/readline.js';
import { type AuthorControllerInterface } from '../controllers/author.controller.js';

export interface AuthorMenuInterface {
    showMenu(): Promise<void>;
}

export class AuthorMenu implements AuthorMenuInterface {
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
                    await this.authorController.createAuthor();
                    break;
                }

                case '2': {
                    console.log('\nGet Author by ID:');
                    await this.authorController.getAuthorById();
                    break;
                }

                case '3': {
                    console.log('\nGet Author by Name:');
                    await this.authorController.getAuthorByName();
                    break;
                }

                case '4': {
                    console.log('\nList Authors:');
                    await this.authorController.listAuthors();
                    break;
                }

                case '5':{
                    console.log('\nUpdate Author:');
                    await this.authorController.updateAuthor();
                    break;
                }

                case '6': {
                    console.log('\nDelete Author:');
                    await this.authorController.deleteAuthor();
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