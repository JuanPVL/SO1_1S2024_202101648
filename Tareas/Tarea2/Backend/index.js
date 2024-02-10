const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()
const PORT = 3002
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
mongoose.connect('mongodb://MongoDB:27017/tarea2',{ useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error',console.error.bind(console, 'Error de conexion a la base de Datos'))
db.once('open', () => {
    console.log('conexion exitosa a base de datos')
})

const Foto = mongoose.model('fotos', {
    imgbase64: String,
    fecha: String
})

app.get('/imagenes', async (req,res) => {
    try {
        const fotos = await Foto.find();
        res.json(fotos)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Error al obtener imagenes'})
    }
})

app.post('/insertarfoto', async (req, res) => {
    const {imgbase64,fecha} = req.body
    if(!imgbase64 || !fecha) {
        return res.status(400).json({error: 'Todos los campos deben estar completos'})
    }
    try {
        const nuevaFoto = new Foto({imgbase64,fecha})
        await nuevaFoto.save()
        res.status(201).json(nuevaFoto)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Error en insercion'})
    }
})

app.listen(PORT, () => {
    console.log(`API Server Listening in http://localhost:${PORT}`)
})