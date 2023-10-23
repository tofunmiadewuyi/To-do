let taskList = document.getElementById("task-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let toEditId = null;

function getUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.title = user + "'s To-do";
    document.getElementById("name").innerHTML = user;
  } else {
    window.location.href = "index.html";
  }
}

getUser();

filters = document.querySelectorAll('.tab');

filters.forEach(filter => {
  filter.addEventListener('click', () => {
    document.querySelector(".active").classList.remove("active");
    filter.classList.add("active");
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
      task.remove();
    })
      getTodos(filter.id);
  })
})

function createItem(todo, isCompleted, filter) {
  //create the item
  const todoEl = document.createElement("div");
  todoEl.classList.add("task");

  if (filter == todo.status || filter == "all") {
    todoEl.innerHTML = `
    <label for="${todo.id}">
      <input onclick="updateStatus(this)" type="checkbox" id="${todo.id}" ${isCompleted}>
      <p class="${isCompleted}">${todo.name}</p>
    </label>
    `
    taskList.appendChild(todoEl);
  } else {
    console.log("else is elsing...");
    addEmptyState();
  }

  purgeEmptyState();
  
  //create the options-menu
  const menu = document.createElement("div");
  menu.classList.add("options-menu");
  menu.style.display="none";

  //create the edit option
  const editOption = document.createElement("div");
  editOption.classList.add("option", "edit");

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
    reloadItems();
  })
}

function getTodos(filter) {
  //remove all existing content
  const taskListItems = document.querySelectorAll('.empty-state');
  taskListItems.forEach(item => {
    item.remove();
  })
  
  if (todos.length > 0) {
    todos.forEach((todo) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      createItem(todo, isCompleted, filter);
      })}
    else {
      addEmptyState();
    }
}

getTodos("all");


function reloadItems() {
  const allTasks  = taskList.querySelectorAll('.task');
  console.log(allTasks);
  for (let i = 0; i < allTasks.length; i++) {
    const taskToRemove = allTasks[i];
    taskList.removeChild(taskToRemove);
  }
  localStorage.setItem("todos", JSON.stringify(todos));
  getTodos("all");
  checkScroll();
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentNode.querySelector("p");
  //get task index
  const idToCheck = parseInt(selectedTask.id, 10);

  const indexToCheck = todos.findIndex(todo => todo.id === idToCheck);
  //check task status
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[indexToCheck].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[indexToCheck].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todos));
}


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
    userMenu.classList.add('hide-menu');
  }
});

function addTodo() {
  const task = taskInput.value.trim();
  if (task != "" && toEditId == null) {
    let taskInfo = {name: task, id: Date.now(), status: "pending" };
    todos.push(taskInfo);
    localStorage.setItem("todos", JSON.stringify(todos));
    taskInput.value = "";
    reloadItems();
  } else if (task != "" && toEditId != null) {
    const taskToUpdate = todos.find(todo => todo.id === toEditId);
    taskToUpdate.name = task;
    //todos.push(taskInfo);
    localStorage.setItem("todos", JSON.stringify(todos));
    taskInput.value = "";
    toEditId = null;
    reloadItems();
    
  }
}

function updateMenuPosition(task) {
  const containerRect = taskList.getBoundingClientRect();
  const childRect = task.getBoundingClientRect();

  const topDistanceToClear =  childRect.top - containerRect.top;
  const btmDistanceToClear =  containerRect.bottom - childRect.bottom;

  //optionsmenu is 106px tall, don't ask me how i know ;)
  if (topDistanceToClear > 106) {
    task.classList.remove("open-downwards");
    task.classList.remove("open-leftwards");
    
    task.classList.add("open-upwards");
    
  } else if (btmDistanceToClear > 106) {
    task.classList.remove("open-upwards");
    task.classList.remove("open-leftwards");
    
    task.classList.add("open-downwards");
    
  } else {
    task.classList.remove("open-upwards");
    task.classList.remove("open-downwards");
    
    task.classList.add("open-leftwards");
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
        updateMenuPosition(task);
        optionsMenu.style.display = "flex";
      }
      
    } else if (event.target.matches('.task')) {
       const task = event.target.closest(".task");
       const taskInputEl = task.querySelector("input");
       taskInputEl.click();
      
    } else if (event.target.matches('.edit')) {
        const task = event.target.closest(".task");
        const taskInputEl = taskInput;
        taskInputEl.value = task.querySelector("p").textContent;
        taskInputEl.focus();
        console.log("edit option clicked");
        toEditId = parseInt(task.querySelector("input").id, 10);
        console.log(toEditId)
        
    } else {
      // Close all option menus by hiding them
      closeMenus();
    }
  
});

console.log(todos.length);

//check if the tasks should be scrollable
function checkScroll() {
  if (todos.length >= 6) {
    taskList.classList.add('scrollable');
  } else {
    taskList.classList.remove('scrollable');
  }
}

checkScroll();

//handle user menu
const userMenu = document.querySelector('.user-menu');

const clearAllBtn = document.querySelector('.clear-all');
const logOutBtn = document.querySelector('.logout');

clearAllBtn.addEventListener('click', () => {
  todos = []
  localStorage.setItem("todos", JSON.stringify(todos));
  reloadItems();
  userMenu.classList.add('hide-menu');
});

logOutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
})

//handle menu open/close
const profileBtn = document.getElementById("profile");

profileBtn.addEventListener('click', () => {
  userMenu.classList.toggle('hide-menu');
})

const closeMenuBtn = document.querySelector('.close-menu');

  closeMenuBtn.addEventListener('click', () => {
  const userMenu = document.querySelector('.user-menu');
  userMenu.classList.toggle('hide-menu');
})


//empty state
function addEmptyState() {
  const allEmptyStates = document.querySelectorAll('.empty-state');
  allEmptyStates.forEach(item => {
    item.remove();
  })
  const emptyEl = document.createElement("div");
    emptyEl.classList.add("empty-state");
  emptyEl.innerHTML = `
  <div class="empty-state-content">
    <img src="/svgs/emptystate.svg" alt="empty state image">
    <p class="">This list is empty.</p>
  </div>
  `
  taskList.appendChild(emptyEl);
}

//purge empty state
function purgeEmptyState() {
  if (document.querySelectorAll('.task').length > 0 && document.querySelector('.empty-state') != null) {
    document.querySelector('.empty-state').remove();
  }
}
