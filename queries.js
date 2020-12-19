const Pool = require('pg').Pool
const DB = new Pool({
  user: 'sachin',
  host: 'localhost',
  database: 'oye_todo',
  password: '1610',
  port: 5432,
})

/*
Get list of todos and search operation
if query parameter is present in the request then it will return based on the parameter
otherwise it will all list of todos
endpoint : http://localhost:3000/todos (to get all todos) 
http://localhost:3000/todos?key1=val1&key2=value (to search todos using id,date,title,description,state,priority)
request type : GET
response : list of todos

Example :
1. curl -X GET thttp://localhost:3030/todos (for all todos)
2. curl -X GET thttp://localhost:3030/todos?title=testing&priority=2 
*/
const getTodos = (request, response) => {
    const search_params = request.query
    let getQuery = 'SELECT * FROM todo '
    let requestData = []
    let length = Object.keys(search_params).length
    if(length) {
      getQuery += 'WHERE '
    }
    let index = 1
    Object.keys(search_params).forEach ((element)=> {
      getQuery +=  `${element} = $${index} `
      if ( index !== length) {
        getQuery += 'AND '
      }
      requestData.push(search_params[element])
      index++
    })
    getQuery += 'ORDER BY priority ASC'
    console.log(getQuery,requestData)
    DB.query(getQuery, requestData)
    .then((results) => {
      response.status(200).json(results.rows)
    })
    .catch( (err) => {
      console.log(err)
      response.status(500).json('Server Error')
    })
  }
/*
Get todo using Id 
endpoint : http://localhost:3000/todos/{id}
request type : GET
response : todo

Example : curl -X GET thttp://localhost:3030/todos/1
*/
const getTodoById = (request, response) => {
    const id = parseInt(request.params.id)
    DB.query('SELECT * FROM todo WHERE id = $1', [id] ) 
      .then( (results) => {
        response.status(200).json(results.rows[0])
    })
    .catch ( (err) => {
      response.status(500).send('Server Error')
    })
}

/*
Create Todo 
endpoint : http://localhost:3000/todos
request type : POST
data : title,description
state, priority, date and id value will be assigned automatically 
state = false(incomplete todo)
priority = last
date = current_date 

Example : curl -X POST -d "title=test1&descripthttp://localhost:3030/todos
*/
const createTodo = (request, response) => {
    const { title, description } = request.body
    if( !title || !description) {
      response.status(400).send('Invalid Request Data')
    }
    let priority;
    DB.query('SELECT COUNT(*) from todo')
      .then((result) => {
        priority = Number(result.rows[0].count) + 1
        DB.query('INSERT INTO todo (title, description, priority) VALUES ($1, $2, $3)', [title, description, priority])
        .then(() => {
          response.status(201).send(`Todo created`)
        })
        .catch ((err)=> {
          response.status(201).send(`Server Error`)
        })
      })
      .catch ((err)=> {
        response.status(500).send(`Server Error`)
      })
}

/* 
Update todo

endpoint : http://localhost:3000/todos/{id}
In update operation title, description, priority, state can be update

if priority is increased(4 -> 1) then priority of todos with priority 1 to 3 will increment by 1
if priority is decreased(1 -> 4) then priority of todos with priority 2 to 4 will decrement by 1

Example: 
1. curl -X PUT --data "priority=1" http://localhost:3030/todos/4
2. curl -X PUT --data "title=testing&description=todo project testing&state=true&priority=1" http://localhost:3030/todos/4
*/
const updateTodo = async(request, response) => {
  const id = request.params.id
  if(typeof request.body.date !=='undefined' || 
    typeof request.body.id !=='undefined' || 
    JSON.stringify(request.body)===JSON.stringify({})
  ) {
    return response.status(401).send("Invalid Request Data")
  }

  let updateQuery = 'UPDATE todo SET '
  let index = 1
  let requestData = []
  Object.keys(request.body).forEach((element) => {
    updateQuery += `${element} = $${index}, `
    requestData.push(request.body[element])
    index++
  })
  
  updateQuery = updateQuery.replace(/,(?=\s*$)/, '')

  updateQuery += `WHERE id = $${index}`
  requestData.push(id)
  console.log(request.body.priority)
  if ( typeof request.body.priority !== 'undefined') {
    console.log('test')
    updatePriority(id,request.body.priority)
  }
  DB.query( updateQuery, requestData)
    .then( () => {
      
      response.status(201).send(`Todo updated with id : ${id}`)
    })
    .catch( (err) => {
      request.status(500).send(`Server Error`)
    })
}

function updatePriority(id, priority) {
  DB.query('Select priority from todo where id = $1',[id])
    .then((result)=> {
      const current_priority = result.rows[0].priority
      console.log(current_priority)
      if( priority === current_priority ) {
        return
      }
      else if( priority < current_priority) {
        DB.query('UPDATE todo SET priority = priority +1 where priority >= $1 AND priority < $2 AND id != $3', [priority, current_priority, id])
          .then(() => {
            return
          })
      }
      else {
        DB.query('UPDATE todo SET priority = priority -1 where priority <= $1 AND priority > $2 AND id != $3', [priority, current_priority, id])
          .then(() => {
            return
          })
      }
    }) 
}


/* 
Delete todo

endpoint : http://localhost:3000/todos/{id}
request type : DELETE
example : curl -X DELETE http://localhost:3030/todos/1
if priority value is greater than deleted priority value  then value will be decremented by 1

*/

const deleteTodo = (request, response) => {9
  const id = request.params.id

  DB.query('SELECT priority from todo WHERE id =$1',[id])
  .then((result) => {
    const priority = result.rows[0].priority
    DB.query('DELETE FROM todo where id = $1',[id])
    .then((result) => {
      console.log(result)
      DB.query('UPDATE todo SET priority = priority-1 where priority > $1',[priority])
      response.status(201).send(`Todo deleted of id : ${id}`)
    })
  })
}

module.exports = {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
}

