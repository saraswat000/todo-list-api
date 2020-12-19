

## Assumptions
 
 - State will be false(incomplete) on creation of todo item
 - Date will be added by deafult to current date
 - Priority of todo-item will be last on creation of todo

## Approach

 **Create a todo** 
 

 - A new row is added to the table with (id, title, description, state, date, priority)
 - State will be false(incompleted) and date will be current date
 - Priority value will be last, it will be calculated using no .of rows in table
 
 

	    curl -X POST -d "title=test1&description=test1" http://localhost:3030/todos

**Update a todo**

 - We can update title, description, state and priority
 - If we will update the priority of any todo-item then we have to update others todo item priority also.
 - `If priority is increased(4 -> 1) then priority of todos with priority 1 to 3 will increment by 1`
 - `If priority is decreased(1 -> 4) then priority of todos with priority 2 to 4 will decrement by 1`
 
		curl -X PUT --data "priority=1" http://localhost:3030/todos/4

 **Get a todo**
 

 - It will single todo-item

	    curl -X GET http://localhost:3030/todos/2

 - It will give all list of todos

	    curl -X GET http://localhost:3030/todos (for all todos)

 - It will give todos according to search param	
 
		curl -X GET http://localhost:3030/todos?title=testing&priority=2

**Delete a todo**

    curl -X DELETE http://localhost:3030/todos/2

## Database Schema

	  id SERIAL PRIMARY KEY
	  title VARCHAR(45) NOT NULL
	  description VARCHAR
	  date DATE NOT NULL DEFAULT CURRENT_DATE
	  state BOOLEAN NOT NULL DEFAULT FALSE
	  priority INTEGER NOT NULL

 - For creating table you can script file with name createTable.sh
				
	    chmod +x createTable.sh ( to make the script file executable)
		./createTable.sh 
 - After Executing file it will ask for a psql user name, after that it will create the table with name todo

## Steps to run the application

	npm install  //to install the dependencies
	Install postgresql database and then create the table by executing the script file(createTable.sh)
	Edit the database details in the queries.js file 
	node index.js (to run application) 
		


