const taskInput = document.querySelector(".new-task input");

let taskList = document.getElementById("task-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function createItem(todo) {
  //create the item
  const todoEl = document.createElement("div");
  todoEl.classList.add("task");

  todoEl.innerHTML = `
  <label for="${todo.id}">
    <input type="checkbox" id="${todo.id}">
    <p>${todo.name}</p>
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
  optionsIcon.src = "svgs/options1.svg";

  //append menu icon + menu tray to the menu button
  optionsMenu.appendChild(optionsIcon);
  optionsMenu.appendChild(menu);

  //append the menu to the task
  todoEl.appendChild(optionsMenu);

  //add event listener to the menu button
  optionsMenu.addEventListener("click", () => {
    if (menu.style.display === "none") {
      menu.style.display = "flex";

    } else {
      menu.style.display = "none";
    }
  })

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
    createItem(todo);
  })
}

getTodos();

taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    const task = taskInput.value.trim();
    let taskInfo = {name: task, id: Date.now(), status: "pending" };
    todos.push(taskInfo);
    localStorage.setItem("todos", JSON.stringify(todos));
    taskInput.value = "";
    getLatestItem();
  }
});

function getLatestItem() {
  const latestItem = todos[todos.length - 1];
  createItem(latestItem);
}