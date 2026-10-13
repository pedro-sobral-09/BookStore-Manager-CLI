import { rl } from '../utils/readline.js';
import { type BookControllerInterface } from '../controllers/book.controller.js';

export interface BookMenuInterface {
  showMenu(): Promise<void>;
}

export class BookMenu implements BookMenuInterface {
  constructor(private bookController: BookControllerInterface) {}

  async showMenu(): Promise<void> {
    let exit = false;

    while (!exit) {
      console.clear();
      console.log('\nBook Menu:');
      console.log('1. Create Book');
      console.log('2. Get Book by ID');
      console.log('3. Get Book by Title');
      console.log('4. List Books');
      console.log('5. Update Book');
      console.log('6. Delete Book');
      console.log('0. Exit');

      const choice = await rl.question('Select an option: ');

      switch (choice) {
        case '1': {
          console.log('\nCreate Book:');
          await this.bookController.createBook();
          break;
        }

        case '2': {
          console.log('\nGet Book by ID:');
          await this.bookController.getBookById();
          break;
        }

        case '3': {
          console.log('\nGet Book by Title:');
          await this.bookController.getBookByTitle();
          break;
        }

        case '4': {
          console.log('\nList Books:');
          await this.bookController.listBooks();
          break;
        }

        case '5': {
          console.log('\nUpdate Book:');
          await this.bookController.updateBook();
          break;
        }

        case '6': {
          console.log('\nDelete Book:');
          await this.bookController.deleteBook();
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
