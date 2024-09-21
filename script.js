"use strict";

// Importing arrays of categories and tasks from the data.js module
import { categoriesArray, tasksArray } from "./data.js";

// DOM Elements:
let selectedCategory = "All Tasks";
const title = document.getElementById("title");
title.textContent = selectedCategory;
const categoryList = document.getElementById("category-list");
const addCategoryForm = document.getElementById("add-category-form");
const categoryNameInput = document.getElementById("category-name-input");
const addCategoryButton = document.getElementById("add-category-button");
const addTaskForm = document.getElementById("add-task-form");
const taskNameInput = document.getElementById("task-name-input");
const newTaskCategory = document.getElementById("new-task-category");
const addTaskButton = document.getElementById("add-task-button");
const searchTaskInput = document.getElementById("search-task-input");
const searchTaskButton = document.getElementById("search-task-button");
const taskList = document.getElementById("task-list");

// Functions:
export const saveDataToLocalStorage = (key, array) => {
  localStorage.setItem(key, JSON.stringify(array));
};

function updateAndSaveTaskState() {
  saveDataToLocalStorage("tasks", tasksArray);
  renderTasks(filterTasksBySelectedCategory(selectedCategory));
  renderCategories();
}

const showAlertForMissingFields = (
  type,
  inputValue,
  selectedCategory = null
) => {
  if (!inputValue) {
    if (selectedCategory === null) {
      alert(
        `Please enter a ${type} name and select a category before submitting!`
      );
    } else {
      alert(`Please enter a ${type} name before submitting!`);
    }
  } else if (!selectedCategory) {
    alert(
      `Please select a category to assign your task. This helps in organizing your tasks effectively.`
    );
  }
};

const checkDuplicateName = (array, searchName, type) => {
  const exists = array.some(
    (item) => item.name.toLowerCase() === searchName.toLowerCase()
  );
  exists
    ? alert(
        `A ${type} with the name "${searchName}" already exists in your list!`
      )
    : null;
  return exists;
};

const showAddNewCategoryButton = () => {
  addCategoryButton.style.display = categoryNameInput.value.trim()
    ? "block"
    : "none";
};
showAddNewCategoryButton();

const toggleCategoryActiveState = (categoryName) => {
  categoriesArray.forEach((category) => {
    category.active = category.name === categoryName;
  });
  renderCategories();
};

const filterTasksBySelectedCategory = (categoryName) => {
  switch (categoryName) {
    case "All Tasks":
      return tasksArray;
    case "Checked Tasks":
      return tasksArray.filter((task) => task.isChecked);
    case "Favorite Tasks":
      return tasksArray.filter((task) => task.isFavorites);
    default:
      return tasksArray.filter(
        (task) => task.category.toLowerCase() === categoryName.toLowerCase()
      );
  }
};

const getTaskCountByCategory = (categoryName) => {
  return filterTasksBySelectedCategory(categoryName).length;
};

const renderCategories = () => {
  categoryList.innerHTML = "";
  categoriesArray.forEach((category) => {
    let listItemELe = document.createElement("li");
    listItemELe.innerHTML = `<button type="button" class="category-name ${
      category.active ? "active" : ""
    }">${category.name}</button>
    <span>(${getTaskCountByCategory(category.name)})</span>`;
    const categoryNameButton = listItemELe.querySelector(".category-name");
    categoryNameButton.addEventListener("click", () => {
      selectedCategory = category.name;
      title.textContent = selectedCategory;
      toggleCategoryActiveState(category.name);
      let filteredTasks = filterTasksBySelectedCategory(selectedCategory);
      renderTasks(filteredTasks);
    });
    categoryList.appendChild(listItemELe);
  });
};
renderCategories();

const renderCategoryToCategorySelectList = () => {
  let categoriesOptions = categoriesArray
    .slice(3)
    .map((category) => {
      return `<option value="${category.name}">${category.name}</option>`;
    })
    .join("");
  newTaskCategory.innerHTML += categoriesOptions;
};
renderCategoryToCategorySelectList();

const markTaskAsFavorite = (taskId) => {
  tasksArray.forEach((task) => {
    if (task.id === taskId) {
      task.isFavorites = !task.isFavorites;
    }
  });
  updateAndSaveTaskState();
};

const toggleTaskCompletion = (taskId) => {
  tasksArray.forEach((task) => {
    if (task.id === taskId) {
      task.isChecked = !task.isChecked;
    }
  });
  updateAndSaveTaskState();
};

const changeTaskCategory = (taskId, newCategory) => {
  tasksArray.forEach((task) => {
    if (task.id === taskId) {
      task.category = newCategory;
    }
  });
  updateAndSaveTaskState();
};

const deleteTask = (taskId) => {
  tasksArray.forEach((task, index) => {
    if (task.id === taskId) {
      const confirmDelete = confirm(
        `Are you sure you want to permanently delete the task "${task.name}"? This action cannot be undone.`
      );
      if (confirmDelete) {
        tasksArray.splice(index, 1);
        updateAndSaveTaskState();
      }
    }
  });
};

const renderTasks = (filterTasks = tasksArray) => {
  taskList.innerHTML = "";
  if (filterTasks.length > 0) {
    filterTasks.forEach((task) => {
      let listItemEle = document.createElement("li");
      let categoriesOptions = categoriesArray
        .slice(3)
        .map((category) => {
          return `<option value="${category.name}" ${
            category.name === task.category ? "selected" : ""
          }>${category.name}</option>`;
        })
        .join("");

      listItemEle.innerHTML = `
              <div>
              <input type="checkbox" id="${task.id}" class="check-task" ${
        task.isChecked ? "checked" : ""
      }>
              <label for="${task.id}">${task.name}</label>
              <select class="category-dropdown">
                ${categoriesOptions}
              </select>
            </div>
            <div>
              <button class="favorite-button ${
                task.isFavorites ? "ph-fill" : "ph-bold"
              } ph-heart-straight" type="button">
                
              </button>
              <button class="delete-button ph-bold ph-trash" type="button"></button>
            </div>
        `;
      const deleteButton = listItemEle.querySelector(".delete-button");
      const checkTask = listItemEle.querySelector(".check-task");
      const categoryDropdown = listItemEle.querySelector(".category-dropdown");
      const favoriteButton = listItemEle.querySelector(".favorite-button");
      deleteButton.addEventListener("click", () => deleteTask(task.id));
      favoriteButton.addEventListener("click", () =>
        markTaskAsFavorite(task.id)
      );
      checkTask.addEventListener("change", () => toggleTaskCompletion(task.id));
      categoryDropdown.addEventListener("change", (event) => {
        changeTaskCategory(task.id, event.target.value);
      });
      taskList.prepend(listItemEle);
    });
  } else {
    taskList.innerHTML = `<li>No tasks found.</li>`;
  }
};
renderTasks();

const searchTasks = (tasks, query) => {
  return tasks.filter((task) =>
    task.name.toLowerCase().includes(query.toLowerCase())
  );
};

// Event Listeners:
addCategoryForm.addEventListener("submit", (event) => {
  const newCategoryName = categoryNameInput.value.trim();
  event.preventDefault();
  if (!newCategoryName) {
    showAlertForMissingFields("Category", newCategoryName);
  } else if (checkDuplicateName(categoriesArray, newCategoryName, "Category")) {
  } else {
    categoriesArray.push({ name: newCategoryName });
    saveDataToLocalStorage("categories", categoriesArray);
    renderCategories();
    categoryNameInput.value = "";
    showAddNewCategoryButton();
  }
});

categoryNameInput.addEventListener("input", showAddNewCategoryButton);

addTaskButton.addEventListener("click", () => {
  if (!taskNameInput.classList.contains("hidden")) {
    addTaskButton.type = "submit";
  } else {
    taskNameInput.classList.remove("hidden");
    newTaskCategory.classList.remove("hidden");
    searchTaskInput.classList.add("hidden");
  }
});

searchTaskButton.addEventListener("click", () => {
  if (!taskNameInput.classList.contains("hidden")) {
    taskNameInput.classList.add("hidden");
    newTaskCategory.classList.add("hidden");
    searchTaskInput.classList.remove("hidden");
  } else {
    searchTaskInput.classList.remove("hidden");
  }
});

addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskName = taskNameInput.value.trim();
  const taskCategory = newTaskCategory.value;
  if (!taskName || !taskCategory) {
    showAlertForMissingFields("Task", taskName, taskCategory);
  } else if (checkDuplicateName(tasksArray, taskName, "task")) {
  } else {
    tasksArray.push({
      id: Date.now(),
      name: taskName,
      category: taskCategory,
      isChecked: false,
      isFavorites: false,
    });
    updateAndSaveTaskState();
    taskNameInput.value = "";
    newTaskCategory.value = "";
  }
});

searchTaskInput.addEventListener("input", (event) => {
  const searchQuery = event.target.value.trim();
  let filteredTasks = filterTasksBySelectedCategory(selectedCategory);
  if (searchQuery) {
    filteredTasks = searchTasks(filteredTasks, searchQuery);
  }
  renderTasks(filteredTasks);
});
