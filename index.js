const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3030

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

const db = require('./queries')

app.get('/todos', db.getTodos)
app.get('/todos/:id', db.getTodoById)
app.post('/todos', db.createTodo)
app.put('/todos/:id', db.updateTodo)
app.delete('/todos/:id',db.deleteTodo)
// app.delete('/users/:id', db.deleteUser)