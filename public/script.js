const ul = document.createElement("ul")
const givingId = ul.setAttribute("id", "todoList")
const todoTag = document.getElementById("todoList")
document.body.appendChild(ul)
callingJson()
    // .then(res=>{
    //     console.log("got it")
    // })
    // .catch(error=>{
    //     console.log("messed up")
    // })

async function callingJson (){
    let htmlString = ""
    const res = await fetch("http://127.0.0.1:3000/api/todos");
    const data = await res.json()
    
    for (let index = 0; index < data.length; index++) {
        const todo = data[index];
        htmlString += `<li>${todo.id}: ${todo.todo}</li>`
        ul.innerHTML = htmlString
    }
    
}