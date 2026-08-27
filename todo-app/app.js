
const addEl = document.querySelector('.submit-btn')
const inputEL = document.querySelector('#input-box')
const filterEl = document.querySelector('.filter')
const clearEl = document.querySelector('.clear-completed')
const todoList = document.querySelector('.task-list')
let todos = [];
let filterData = 'all'
//save the tasks in local storage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos))
}
//get the tasks from local storage
function getFromLocalStorage() {
    const data = localStorage.getItem('todos') 
    if(data) {
        todos = JSON.parse(data)
        renderTask()
    }
}
getFromLocalStorage()
//factory to create the task object 
function createTask(txt) {
    return {
        id: Date.now(),
        completed: false,
        task: txt,
        date: new Date().toISOString()
    }
}
//funtion to add the tasks
function addTask(txt) {
    const newTodo = createTask(txt);
    todos.push(newTodo);
    renderTask(filterData)
    saveToLocalStorage()

}
//function to delete task
function deleteTask(id) {
    todos = todos.filter(todo => {
        return todo.id !== id
    })
    renderTask(filterData)
    saveToLocalStorage()
}
//function to clear all tasks
function clearAllTasks() {
    todos = todos.filter(todo => !todo.completed)
    renderTask(filterData)
    saveToLocalStorage()
}
//function to for toggle or checkmark
function checkTask(id) {
    todos = todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo)
    renderTask(filterData)
    saveToLocalStorage()
}
//fucntion to edit task
function editTask(id, newtxt) {
    todos = todos.map(todo => todo.id === id ? {...todo, task: newtxt} : todo)
    renderTask(filterData)
    saveToLocalStorage()
}
//function to filter tasks
function filterTasks(type) {
    if(type === 'active') return todos.filter(todo => !todo.completed)
    if(type === 'completed') return todos.filter(todo => todo.completed)
    
    return todos;
}
//function tassk counter
function taskCounter() {
    const counterEl = document.querySelector('.task-counter')
    const activeTasks = todos.filter(todo => !todo.completed).length
    if(activeTasks !== 0) {
         counterEl.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`  
    }
     counterEl.textContent = 'There are no tasks'
   
}
//fucntion to render tasks
function renderTask( filterData) {
    todoList.innerHTML = ''
    const filterd = filterTasks(filterData)
    if(filterd.length === 0) {
        todoList.innerHTML = `<p style = "text-align:center;">There are no tasks at the moment </p>`
        taskCounter()
        return
    }
    filterd.forEach(todo => {
        const liEl = document.createElement('li')
        liEl.classList.add('todo-item')

        const left = document.createElement('div')
        left.classList.add('left')

        const checkMark = document.createElement('input')
        checkMark.classList.add('ckeck-mark')
        checkMark.type = 'checkbox';
        checkMark.checked = todo.completed;
        checkMark.addEventListener('change', ()=> checkTask(todo.id))

        const span = document.createElement('span')
        span.textContent = todo.task
        if(todo.completed) span.classList.add('line-through')
        
        left.appendChild(checkMark)
        left.appendChild(span)

        const right = document.createElement('div')
        right.classList.add('right')
        const editBtn = document.createElement('button')
        editBtn.classList.add('edit-btn', 'fa-solid', 'fa-pen')

        editBtn.addEventListener('click', () => {
            const newtxt = prompt('Edit task:', todo.task)
            if(newtxt) {editTask(todo.id, newtxt)}
        })
        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('delete-btn','fa-solid', 'fa-trash')
        deleteBtn.addEventListener('click', ()=> {
            deleteTask(todo.id)
        })
        right.appendChild(editBtn)
        right.appendChild(deleteBtn)
        liEl.appendChild(left)
        liEl.appendChild(right)
        todoList.appendChild(liEl)
    })
    taskCounter()
}

addEl.addEventListener('click' ,()=> {
    const task = inputEL.value
    if(!task.trim()) return
    addTask(task)
    inputEL.value = ''

})

inputEL.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        e.preventDefault()
        addEl.click()
    }
})
filterEl.querySelectorAll('button').forEach(filter =>{
    filter.addEventListener('click' , () => {
        filterData = filter.dataset.filter
         filterEl.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));

        filter.classList.add('active');
        renderTask(filterData)
        })     
    

})
clearEl.addEventListener('click', () => {
    clearAllTasks();
})








