const Redis = require('ioredis');

const redisConection = new Redis({
    host:'localhost',
    port:6379,
    connectionTimeout:5000,
})


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

