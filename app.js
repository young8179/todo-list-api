const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require("method-override")

const app = express();
const server = http.createServer(app)

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const hostname = '127.0.0.1'; 
const port = 3000; 

app.use(methodOverride("_method"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

const todoList = [
  {
    id: 1,
    todo: 'Implement a REST API',
  },
  {
    id: 2,
    todo: 'Build a frontend',
  },
  {
    id: 3,
    todo: 'Review',
  },
  {
    id: 4,
    todo: 'Profit!',
  },
];



app.get("/", (req, res)=>{
  res.render(`home`, {
    locals: {
      title: "Todo app"
    },
    partials: {
      head: "/partials/head"
    }
  })
})


//todoList.html rendering
app.get("/todos", (req, res)=>{
  res.render("todoList", {
    partials: {
      head: "/partials/head"
    },
    locals: {
      todos: todoList,
      path: req.path,
      message: null,
      title: "Todo List"
    }
  })
})
//todoeach (byId) rendering html
app.get("/todos/:id", (req, res)=>{
  const { id }= req.params;
  const todo = todoList.find(element => element.id == id)
  if(todo){
    res.render("todoEach", {
      locals:{
        
        todo: todo
      }
    })
  }else{
    res.status(400)
      .send("no todo found") 
  }
  
  
})

//todoList.html post request
app.post("/todos", (req,res)=>{
  if(!req.body || !req.body.todo){
    res.status(400).render("todoList", {
      locals: {
        todos: todoList,
        path: req.path,
        message: "please Enter Todo Text",
        title: "todo no found"
      },
      partials: {
        head: "/partials/head"
      }

    })
    return;
  }
  const prevId = todoList.reduce((prev, curr) => {
    return prev > curr.id ? prev : curr.id;
  }, 0);
  const newTodo = {
    id:  prevId + 1,
    todo: req.body.todo
  }
  todoList.push(newTodo);
  res.status(201).render("todoList", {
    locals: {
      todos: todoList,
      path: req.path,
      message: "New todo added",
      title: "todo list"
    },
    partials: {
      head: "/partials/head"
    }
  })
  
})

//todo delete
app.delete("/todos/:id", (req, res)=>{
  const { id } = req.params
  const findIndex = todoList.findIndex(element=>{  
    if(element.id == id){
      return true;
    }
    return false
  })
  if(findIndex === -1){
    req.status(404).send("todo not found")
  }else{
    todoList.splice(findIndex, 1);
    res.status(204).redirect("/todos")
  }
})

 


// GET /api/todos
app.get("/api/todos", (req, res)=>{
  res.json(todoList)
})

// GET /api/todos/:id
app.get("/api/todos/:id", (req, res)=>{
  const { id } = req.params;
  const todoById = todoList.find(element =>{
    if(element.id == id){
      return true;
    }
    return false
  })
  if(!todoById){
    res
      .status(404)
      .send("no page found")
      // .json({"error": "No todo found"})
  }else{
    res.send(`${todoById.id}: ${todoById.todo}`)
  }

})

// POST /api/todos
app.post("/api/todos", (req, res)=>{
  if(!req.body.id || !req.body.todo){
    res.status(422).json();
    return;
  }
  const newTodo = {
    id: parseInt(req.body.id, 10),
    todo: req.body.todo
  }
  todoList.push(newTodo);
  res.status(201).json()
  
})


// PUT /api/todos/:id
app.put("/api/todos/:id", (req, res)=>{
  const { id } = req.params
  const findIndex = todoList.findIndex(element => element.id == id)
  if(!req.body.id || !req.body.todo){
    res.status(422).json()
    return;
  }
  const newTodo = {
    id: parseInt(req.body.id,10),
    todo: req.body.todo
  }
  if(findIndex === -1){
    res.status(404).json()
  }else{
    todoList.splice(findIndex, 1, newTodo);
    res.status(202).json()
  }
})

// DELETE /api/todos/:id
app.delete("/api/todos/:id", (req, res)=>{
  const { id } = req.params
  const findIndex = todoList.findIndex(element=>{
    if(element.id == id){
      return true;
    }
    return false
  })
  if(findIndex === -1){
    req.status(404).json();
  }else{
    todoList.splice(findIndex, 1);
    res.status(204).json()
  }
})


server.listen(port,hostname, function () {
  console.log(`Todo List API is now listening on http://${hostname}:${port}`);
});



