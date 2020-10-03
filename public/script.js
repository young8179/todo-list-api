//render todo
function renderTodos(todoArray) {
    
    const todosHtml = todoArray.map(element => {
      
      return `
        <li>
          ${element.id} (${element.todo})
          <button onclick="removeTodo('${element.id}')">x</button>
        </li>
      `
    })
    return todosHtml.join("") 
}

//update todo to screen
function updateTodos(){
    axios.get("/api/todos")
        .then(res=>{
            const ul = document.getElementById("todoList")
            console.log(res.data)
            ul.innerHTML = renderTodos(res.data)
        })
}
//-------post-------------

const form = document.getElementById("form");
form.addEventListener("submit", (e)=>{
    e.preventDefault()
    axios.post("/api/todos", {
        id: e.target.elements.id.value,
        todo: e.target.elements.todo.value
    })
        .then(res=>{
            updateTodos();
            form.reset();
        })
        .catch(err=>{
            alert("something wrong")
        })
        
})
//delete todo------------
function removeTodo(id){
    axios.delete(`/api/todos/${id}`)
        .finally(res=>{
            updateTodos()
        })
}

updateTodos()





// callingJson()
    

// async function callingJson (){
//     let htmlString = ""
//     const res = await fetch("http://127.0.0.1:3000/api/todos");
//     const data = await res.json()
    
//     for (let index = 0; index < data.length; index++) {
//         const todo = data[index];
//         htmlString += `<li>${todo.id}: ${todo.todo} <button onclick="remove(${data.id})">x</button></li> `
//         document.getElementById("todoList").innerHTML = htmlString
//     }
// }
