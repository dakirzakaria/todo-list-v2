"use strict";
// Variables:
// const BurgerButton = document.getElementById("burger_button");
const CategoriesList = document.getElementById("categories_list");
const AddNewCategoryForm = document.getElementById("add_new_category_form");
const AddNewCategoryButton = document.getElementById("add_new_category_button");
const AddNewCategoryInput = document.getElementById("add_new_category_input");
const CategoriesArray = JSON.parse(localStorage.getItem("categories")) || [
  // {
  //   id: 1,
  //   name: "All Tasks",
  // },
  // {
  //   id: 2,
  //   name: "Favourites",
  // },
];
const Title = document.getElementById("title");
// const BlurDiv = document.getElementById("blur");
const AsideMenu = document.getElementById("aside_menu");
const AddNewTaskForm = document.getElementById("add_new_task_form");
const AddNewTaskInput = document.getElementById("add_new_task_input");
const NewTaskCategory = document.getElementById("select_new_task_category");
const AddNewTaskButton = document.getElementById("add_new_task_button");
const TasksList = document.getElementById("tasks_list");
const TasksArray = JSON.parse(localStorage.getItem("tasks")) || [];
// Events Listener:
// BurgerButton.addEventListener("click", () => {
//   AsideMenu.classList.toggle("show_aside");
//   BlurDiv.classList.toggle("display_block");
// });
// BlurDiv.addEventListener("click", () => {
//   AsideMenu.classList.toggle("show_aside");
//   BlurDiv.classList.toggle("display_block");
// });
AddNewCategoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const AddNewCategoryInputValue = AddNewCategoryInput.value.trim();
  if (AddNewCategoryInputValue === "") {
    AddNewCategoryInput.placeholder = "Please add Category";
    AddNewCategoryInput.style.outline = "solid 1px red";
  } else {
    AddNewCategoryInput.style.outline = "none";
    AddNewCategoryInput.placeholder = "Add a new Category";
    AddNewCategoryToCategoriesArray();
    AddNewCategoryInput.value = "";
  }
});


AddNewTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const AddNewTaskInputValue = AddNewTaskInput.value.trim();
  if (!AddNewTaskInputValue) {
    AddNewTaskInput.placeholder = "Please add task";
    AddNewTaskInput.style.outline = "solid 1px red";
  } else {
    AddNewTaskInput.style.outline = "none";
    AddNewTaskInput.placeholder = "Add a new task";
    AddNewTaskToTasksArray();
    AddNewTaskInput.value = "";
  }
});
// Functions:
const addNewCategoryToCategoriesArray = ()=> {
  const AddNewCategoryInputValue = AddNewCategoryInput.value.trim();
  const NewCategory = {
    id: Date.now(),
    name: AddNewCategoryInputValue,
  };
  CategoriesArray.push(NewCategory);
  AddCategoriesArrayToCategoriesList(NewCategory.id, NewCategory.name);
  SetCategoriesArrayToLocalStorage();
  AddCategoriesArrayToSelectListCategories()
}

function AddCategoriesArrayToCategoriesList(id,name) {
  // CategoriesList.innerHTML = "";
  // CategoriesArray.forEach((category) => {
    const CreteListItemElement = document.createElement("li");
    const CreteButtonElement = document.createElement("button");
    const createSpan = document.createElement("span")
    CreteButtonElement.classList.add("category_name");
    CreteButtonElement.setAttribute("data-id", id);
    CreteButtonElement.textContent = name;
    CreteListItemElement.appendChild(CreteButtonElement);
    CreteListItemElement.appendChild(createSpan);
    CategoriesList.appendChild(CreteListItemElement);
  // });
  // DisplayCategoryTasks()
}
AddCategoriesArrayToCategoriesList();

function SetCategoriesArrayToLocalStorage() {
  localStorage.setItem("categories", JSON.stringify(CategoriesArray));
}
// 
// 

function AddCategoriesArrayToSelectListCategories(){
  NewTaskCategory.innerHTML = "";
  CategoriesArray.forEach((category) => {
    const CreteOptionElement = document.createElement("option");
    CreteOptionElement.setAttribute("value", category.name.split(" ").join("_"))
    CreteOptionElement.textContent = category.name
    NewTaskCategory.appendChild(CreteOptionElement)
  });
}

AddCategoriesArrayToSelectListCategories()

//
//

function AddNewTaskToTasksArray() {
  const AddNewTaskInputValue = AddNewTaskInput.value.trim();
  const NewTask = {
    id: Date.now(),
    name: AddNewTaskInputValue,
    category: NewTaskCategory.value,
    completed: false,
  };
  TasksArray.unshift(NewTask);
  AddTasksArrayToTasksList();
  SetTasksArrayToLocalStorage();
}
function AddTasksArrayToTasksList() {
  TasksList.innerHTML = "";
  TasksArray.forEach((task, index) => {
    const CreteListItemElement = document.createElement("li");
    const CreteLabelElement = document.createElement("label");
    const CreteInputElement = document.createElement("input");
    const CreteSpanElement = document.createElement("span");
    CreteListItemElement.classList.add(
      task.category.toLowerCase().split(" ").join("_"),
      "all_tasks"
    );
    // if (task.completed) {
    //   CreteInputElement.setAttribute("checked", true);
    // }
    CreteInputElement.type = "checkbox";
    CreteInputElement.setAttribute("checked", !task.completed)
    CreteInputElement.setAttribute("id", `task_${index}`);
    CreteLabelElement.setAttribute("for", `task_${index}`);
    CreteLabelElement.setAttribute("data-id", task.id);
    CreteLabelElement.setAttribute("data-id", task.id);
    CreteLabelElement.textContent = task.name;
    CreteSpanElement.textContent = task.category;
    CreteListItemElement.appendChild(CreteInputElement);
    CreteListItemElement.appendChild(CreteLabelElement);
    CreteListItemElement.appendChild(CreteSpanElement);
    TasksList.appendChild(CreteListItemElement);
  });
}
AddTasksArrayToTasksList();
function SetTasksArrayToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(TasksArray));
}
TasksList.addEventListener("click", (event) => {
  if (event.target.tagName.toLowerCase() === "input") {
    const TaskId = parseInt(
      event.target.parentElement.querySelector("label").getAttribute("data-id")
    );
    const TaskIndex = TasksArray.findIndex((task) => task.id === TaskId);
    TasksArray[TaskIndex].completed = event.target.checked;
    AddTasksArrayToTasksList();
    SetTasksArrayToLocalStorage();
  }
});

