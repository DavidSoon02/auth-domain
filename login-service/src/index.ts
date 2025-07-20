import { App } from './app';

const app = new App();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM signal');
    await app.shutdown();
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT signal');
    await app.shutdown();
});

// Start the application
app.start().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
