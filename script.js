"use strict";

// Variables:
const emptyString = "";
const allTasks = document.getElementById("all_tasks");
const checkedTasks = document.getElementById("checked_tasks");
const favoritesTasks = document.getElementById("favorites_tasks");
const allTasksCounter = document.getElementById("all_tasks_counter");
const checkedTasksCounter = document.getElementById("checked_tasks_counter");
const favoritesTasksCounter = document.getElementById(
  "favorites_tasks_counter"
);
const categoriesList = document.getElementById("categories_list");
const newCategoryForm = document.getElementById("new_category_form");
const newCategoryButton = document.getElementById("new_category_button");
const newCategoryInput = document.getElementById("new_category_input");
let categoriesArray = JSON.parse(localStorage.getItem("categories")) || [
  {
    title: "Groceries",
  },
  {
    title: "Work",
  },
  {
    title: "Study",
  },
  {
    title: "Sports",
  },
];
const title = document.getElementById("title");
const newTaskForm = document.getElementById("new_task_form");
const newTaskInput = document.getElementById("new_task_input");
const newTaskCategory = document.getElementById("new_task_category");
const newTaskButton = document.getElementById("new_task_button");
const tasksList = document.getElementById("tasks_list");
let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: 1,
    title: "Buy Bananas for the pancakes",
    category: "Groceries",
    isChecked: true,
    isFavorites: true,
  },
  {
    id: 2,
    title: "Go to the Gym Sports",
    category: "Sports",
    isChecked: true,
    isFavorites: false,
  },
  {
    id: 3,
    title: "Prepare roadmap for MVP Work",
    category: "Work",
    isChecked: false,
    isFavorites: false,
  },
  {
    id: 4,
    title: "Call Peter Work",
    category: "Work",
    isChecked: false,
    isFavorites: false,
  },
  {
    id: 5,
    title: "Read chapter 3 from Math book Study",
    category: "Study",
    isChecked: false,
    isFavorites: false,
  },
];

// Events Listener:
newCategoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newCategoryInputValue = newCategoryInput.value.trim();
  if (!newCategoryInputValue) {
    alert("The category input cannot be blank!");
  } else {
    pushNewCategoryIntoCategoriesArray(newCategoryInputValue);
    setCategoriesArrayIntoLocalStorage();
    renderCategories();
    pushNewCategoryIntoCategoriesSelectList();
    newCategoryInput.value = emptyString;
  }
});

newTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTaskInputValue = newTaskInput.value.trim();
  if (!newTaskInputValue) {
    alert("The task input cannot be blank!");
  } else {
    pushNewTaskIntoTasksArray(newTaskInputValue);
    setTasksArrayIntoLocalStorage();
    allTasksCounterFunc();
    renderCategories();
    renderTasks();
    newTaskInput.value = emptyString;
  }
});

// Functions:
function pushNewCategoryIntoCategoriesArray(categoryTitle) {
  const newCategory = {
    title: categoryTitle,
  };
  categoriesArray.push(newCategory);
}

function setCategoriesArrayIntoLocalStorage() {
  localStorage.setItem("categories", JSON.stringify(categoriesArray));
}

function renderCategories() {
  categoriesList.innerHTML = emptyString;
  categoriesArray.forEach((category) => {
    const createListItemElement = document.createElement("li");
    const createButtonElement = document.createElement("button");
    const createSpanElement = document.createElement("span");
    createButtonElement.textContent = category.title;
    createButtonElement.classList.add("category_name");
    createSpanElement.classList.add("tasks_counter");
    createSpanElement.textContent = `(${
      tasksArray.filter(
        (task) =>
          task.category.toLowerCase().split(" ").join("_") ===
          category.title.toLowerCase().split(" ").join("_")
      ).length
    })`;
    createButtonElement.addEventListener("click", () => {
      title.textContent = category.title;
      const filteredTasksArray = tasksArray.filter(
        (task) =>
          task.category.toLowerCase().split(" ").join("_") ===
          category.title.toLowerCase().split(" ").join("_")
      );
      renderTasks(filteredTasksArray);
    });
    createListItemElement.appendChild(createButtonElement);
    createListItemElement.appendChild(createSpanElement);
    categoriesList.appendChild(createListItemElement);
  });
}
renderCategories();

function allTasksCounterFunc() {
  allTasks.addEventListener("click", () => {
    title.textContent = "All Tasks";
    renderTasks();
  });
  allTasksCounter.textContent = `(${tasksArray.length})`;
}
allTasksCounterFunc();

function checkedCounterFunc() {
  checkedTasks.addEventListener("click", () => {
    title.textContent = "Checked Tasks";
    const filteredTasksArray = tasksArray.filter(
      (task) => task.isChecked === true
    );
    renderTasks(filteredTasksArray);
  });
  checkedTasksCounter.textContent = `(${
    tasksArray.filter((task) => task.isChecked === true).length
  })`;
}
checkedCounterFunc();

function favoritesCounterFunc() {
  favoritesTasks.addEventListener("click", () => {
    title.textContent = "Favorites Tasks";
    const filteredTasksArray = tasksArray.filter(
      (task) => task.isFavorites === true
    );
    renderTasks(filteredTasksArray);
  });
  favoritesTasksCounter.textContent = `(${
    tasksArray.filter((task) => task.isFavorites === true).length
  })`;
}
favoritesCounterFunc();

function pushNewCategoryIntoCategoriesSelectList() {
  newTaskCategory.innerHTML = emptyString;
  categoriesArray.forEach((category) => {
    const createOptionElement = document.createElement("option");
    createOptionElement.textContent = category.title;
    newTaskCategory.appendChild(createOptionElement);
  });
}
pushNewCategoryIntoCategoriesSelectList();

function pushNewTaskIntoTasksArray(taskTitle) {
  const newTask = {
    id: Date.now(),
    title: taskTitle,
    category: newTaskCategory.value,
    isChecked: false,
    isFavorites: false,
  };
  tasksArray.unshift(newTask);
}

function setTasksArrayIntoLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function renderTasks(filteredTasksArray) {
  tasksList.innerHTML = "";
  const tasksToRender = filteredTasksArray || tasksArray;
  if (tasksToRender.length > 0) {
    tasksToRender.forEach((task, index) => {
      const createListItemElement = document.createElement("li");
      const createTaskItemDivElement = document.createElement("div");
      createTaskItemDivElement.classList.add("task_item");
      const createInputElement = document.createElement("input");
      createInputElement.type = "checkbox";
      createInputElement.setAttribute("id", `task_${index}`);
      createInputElement.checked = task.isChecked;
      createInputElement.addEventListener("change", () => {
        task.isChecked = createInputElement.checked;
        setTasksArrayIntoLocalStorage();
        checkedCounterFunc();
      });
      const createLabelElement = document.createElement("label");
      createLabelElement.setAttribute("for", `task_${index}`);
      createLabelElement.setAttribute("data-id", task.id);
      createLabelElement.textContent = task.title;
      const createSpanElement = document.createElement("span");
      createSpanElement.textContent = task.category;
      const createButtonsWrapperDivElement = document.createElement("div");
      createButtonsWrapperDivElement.classList.add("buttons_wrapper");
      createButtonsWrapperDivElement.style.display = "none";
      createListItemElement.addEventListener("mouseenter", () => {
        createButtonsWrapperDivElement.style.display = "flex";
      });
      createListItemElement.addEventListener("mouseleave", () => {
        createButtonsWrapperDivElement.style.display = "none";
      });
      const createTrashButtonElement = document.createElement("button");
      createTrashButtonElement.classList.add("trash_button");
      createTrashButtonElement.classList.add("ri-delete-bin-line");
      createTrashButtonElement.addEventListener("click", () => {      
        if (confirm("Are you sure you want to delete this task..???")) {
          tasksArray = tasksArray.filter(
            (taskTarget) => taskTarget.id !== task.id
          );
          setTasksArrayIntoLocalStorage();
          allTasksCounterFunc();
          checkedCounterFunc();
          favoritesCounterFunc();
          renderCategories();
          renderTasks();
      }
      });
      const createFavoriteButtonElement = document.createElement("button");
      createFavoriteButtonElement.classList.add("favorites_button");
      if (task.isFavorites === true) {
        createFavoriteButtonElement.classList.add("ri-heart-fill");
      } else {
        createFavoriteButtonElement.classList.add("ri-heart-line");
      }
      createFavoriteButtonElement.addEventListener("click", () => {
        task.isFavorites = !task.isFavorites;
        setTasksArrayIntoLocalStorage();
        favoritesCounterFunc();
        renderTasks();
      });
      createTaskItemDivElement.appendChild(createInputElement);
      createTaskItemDivElement.appendChild(createLabelElement);
      createTaskItemDivElement.appendChild(createSpanElement);
      createListItemElement.appendChild(createTaskItemDivElement);
      createButtonsWrapperDivElement.appendChild(createTrashButtonElement);
      createButtonsWrapperDivElement.appendChild(createFavoriteButtonElement);
      createListItemElement.appendChild(createButtonsWrapperDivElement);
      tasksList.appendChild(createListItemElement);
    });
  } else {
    tasksList.innerHTML = "<li>No tasks found.</li>";
  }
}
renderTasks();
