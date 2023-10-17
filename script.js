document.title = "Tofunmi's To-do";

let taskList = document.getElementById("task-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function createItem(todo, isCompleted) {
  //create the item
  const todoEl = document.createElement("div");
  todoEl.classList.add("task");

  todoEl.innerHTML = `
  <label for="${todo.id}">
    <input onclick="updateStatus(this)" type="checkbox" id="${todo.id}" ${isCompleted}>
    <p class="${isCompleted}">${todo.name}</p>
  </label>
  `
  taskList.appendChild(todoEl);

  //create the options-menu
  const menu = document.createElement("div");
  menu.classList.add("options-menu");
  menu.style.display="none";

  //create the edit option
  const editOption = document.createElement("div");
  editOption.classList.add("option");

  const editIcon = document.createElement("img");
  editIcon.src = "svgs/edit.svg";
  editIcon.alt = "edit";

  const editText = document.createElement("p");
  editText.innerText = "Edit";

  editOption.appendChild(editIcon);
  editOption.appendChild(editText);

  //create the delete option
  const deleteOption = document.createElement("div");
  deleteOption.classList.add("option", "delete");

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "svgs/delete.svg";
  deleteIcon.alt = "delete";

  const deleteText = document.createElement("p");
  deleteText.innerText = "Delete";

  deleteOption.appendChild(deleteIcon);
  deleteOption.appendChild(deleteText);

  //append options to menu
  menu.appendChild(editOption);
  menu.appendChild(deleteOption);

  //create the menu button
  let optionsMenu = document.createElement("div");
  optionsMenu.classList.add("task-options");

  const optionsIcon = document.createElement("img");
  optionsIcon.classList.add("options-icon");
  optionsIcon.src = "svgs/options1.svg";

  //append menu icon + menu tray to the menu button
  optionsMenu.appendChild(optionsIcon);
  optionsMenu.appendChild(menu);

  //append the menu to the task
  todoEl.appendChild(optionsMenu);


  //add event listener to the delete option
  deleteOption.addEventListener("click", () => {

    const idToDelete = todo.id;
    const indexToDelete = todos.findIndex(todo => todo.id === idToDelete);
    
    todos.splice(indexToDelete, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    todoEl.remove();
  })
}

function getTodos() {
  todos.forEach((todo, index) => {
    let isCompleted = todo.status == "completed" ? "checked" : "";
    createItem(todo, isCompleted);
  })
}

getTodos();


function getLatestItem() {
  const latestItem = todos[todos.length - 1];
  createItem(latestItem);
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentNode.querySelector("p");
  //get task index
  const idToCheck = parseInt(selectedTask.id, 10);

  const indexToCheck = todos.findIndex(todo => todo.id === idToCheck);
  //check task status
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    console.log(idToCheck);
    console.log(indexToCheck);
    todos[indexToCheck].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[indexToCheck].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todos));
}

//add event listener to the task divs
const taskItem = document.querySelectorAll(".task");

// taskItem.forEach(task => {
//   task.addEventListener("click", () => {
//     const taskInputEl = task.querySelector("input");
//     taskInputEl.click();
//   })

// })

//add event listener to the submit button 
const inputSubmitBtn = document.getElementById("submit");
inputSubmitBtn.addEventListener("click", () => {
  addTodo();
})

//add event listener to the enter key
const taskInput = document.querySelector(".new-task input");
taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTodo();
    
  }
});

function addTodo() {
  const task = taskInput.value.trim();
  if (task != "") {
    let taskInfo = {name: task, id: Date.now(), status: "pending" };
    todos.push(taskInfo);
    localStorage.setItem("todos", JSON.stringify(todos));
    taskInput.value = "";
    getLatestItem();
  }
}

// Add a click event listener to the document
document.addEventListener('click', function(event) {

    function closeMenus() {
      const menus = document.querySelectorAll('.options-menu');
      menus.forEach(function(menu) {
      menu.style.display = 'none';
          });
    }

    // Check if the click target is inside the options menu
    if (event.target.matches('.task-options') || event.target.matches(".options-icon")) {
      
      const task = event.target.closest(".task");
      const optionsMenu = task.querySelector('.options-menu');
      if (optionsMenu.style.display == "flex") {
        optionsMenu.style.display = "none";
      } else {
        closeMenus();
        optionsMenu.style.display = "flex"; 
      }
      
    } else if (event.target.matches('.task')) {
       const task = event.target.closest(".task");
       const taskInputEl = task.querySelector("input");
       taskInputEl.click();
      
    } else {
      // Close all option menus by hiding them
      closeMenus();
    }

  
});