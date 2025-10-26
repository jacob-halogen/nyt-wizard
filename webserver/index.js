const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 3000
const spawn = require('child_process').spawn

app.post('/wordle', (req, res) => {
    const state = req.body.data;
    console.log(state);
    const python = spawn('python', ['../wordle.py', state])
    let output = ""
    python.stdout.on('data', (data) => {
        output = data
    })
    python.stderr.on('data', (data) => {
        console.log("ERR: " + data)
    })
    python.on('close', (code) => {
        console.log("OUT: " + output)
        res.send(output.toString().trim())
    })
})

app.post('/spelling-bee', (req, res) => {
    const state = req.body.data;
    console.log(state);
    const python = spawn('python', ['../spelling-bee.py', state])
    let output = ""
    python.stdout.on('data', (data) => {
        output = data
    })
    python.stderr.on('data', (data) => {
        console.log("ERR: " + data)
    })
    python.on('close', (code) => {
        console.log("OUT: " + output)
        res.send(output.toString().trim())
    })
})

app.post('/pips', (req, res) => {
    app.code(501).send("Not Implemented!");
})

app.post('/sudoku', (req, res) => {
    app.code(501).send("Not Implemented!");
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})