import "dotenv/config";
import { rl } from './utils/readline.js';
import { authorMenu } from './container.js';

class App {
    constructor() {}

    async start(): Promise<void> {
        let exit = false;
        
        while (!exit) {
            console.clear();
            console.log('\nMain Menu:');
            console.log('1. Author Menu');
            console.log('0. Exit');

            const choice = await rl.question('Select an option: ');

            switch (choice) {
                case '1':
                    await authorMenu.showMenu();
                    break;
                case '0':
                    exit = true;
                    console.log('Exiting the application...');
                    break;
                default:
                    await rl.question('Invalid option. Please try again.');
                    break;
            }
        }
        
        rl.close();
    }
}

const app = new App();

await app.start();