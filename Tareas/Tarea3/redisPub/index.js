const Redis = require('ioredis');

const client = new Redis({
    host: '10.246.236.59',
    port: 6379,
});

const redisConection = new Redis({
    host:'10.246.236.59',
    port:6379,
    connectionTimeout:5000,
})


function connect(){
    client.on('connect', () => {
        console.log('Connected to Redis');
    });
    
    client.on('error', (err) => {
        console.log('Error connecting to Redis:', err);
    });
}

connect()


function publishMessage(){
    redisConection.publish('test', '{\n msg: "Hola a todos"\n}')
    .then((res) => {
        console.log('Mensaje enviado')
    })
    .catch((err) => {
        console.log('Error al enviar mensaje')
    })
}

setInterval(publishMessage, 5000)

