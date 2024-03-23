const Redis = require('ioredis');

const client = new Redis({
    host: 'localhost',
    port: 6379,
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.log('Error connecting to Redis:', err);
});

