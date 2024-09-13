"use strict";

// DOM elements:
const categoryList = document.getElementById("category-list");
const categoryForm = document.getElementById("category-form");
const categoryInput = document.getElementById("category-input");
const addCategoryButton = document.getElementById("add-category-button");
let categoriesArray = JSON.parse(localStorage.getItem("categories")) || [
  {
    name: "Groceries",
  },
  {
    name: "Work",
  },
  {
    name: "Study",
  },
  {
    name: "Sports",
  },
];

const title = document.getElementById("title");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCategory = document.getElementById("task-category");
const addTaskButton = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");
let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: 1,
    name: "Buy Bananas for the pancakes",
    category: "Groceries",
    isChecked: true,
    isFavorites: true,
  },
  {
    id: 2,
    name: "Go to the Gym Sports",
    category: "Sports",
    isChecked: true,
    isFavorites: false,
  },
  {
    id: 3,
    name: "Prepare roadmap for MVP Work",
    category: "Work",
    isChecked: false,
    isFavorites: false,
  },
  {
    id: 4,
    name: "Call Peter Work",
    category: "Work",
    isChecked: false,
    isFavorites: false,
  },
  {
    id: 5,
    name: "Read chapter 3 from Math book Study",
    category: "Study",
    isChecked: false,
    isFavorites: false,
  },
];

/*

  - Functions:

*/

// Alerts the user to enter a valid name for tasks or categories:
const showAlertForMissingName = (type) => {
  return alert(`Please enter a ${type} name before submitting!`);
};

// Checks if a name exists in the provided array (categories or tasks):
const checkIfExists = (array, name, type) => {
  const exists = array.some(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
  exists
    ? alert(`A ${type} with the name "${name}" already exists in your list!`)
    : null;
  return exists;
};

// Saves an array to localStorage under the specified key:
const saveToLocalStorage = (key, array) => {
  localStorage.setItem(key, JSON.stringify(array));
};

// Function to toggle the visibility of the "Add Category" button:
const toggleButtonVisibility = () => {
  addCategoryButton.style.display = categoryInput.value.trim()
    ? "block"
    : "none";
};
toggleButtonVisibility();

// Set the default title to "All Tasks":
title.textContent = "All Tasks";

// Function to render the category list with task counts for all, checked, favorites, and individual categories:
const renderCategory = () => {
  categoryList.innerHTML = `
  <li>
    <button type="button" data-category="all">All Tasks</button>
    <span id="all-tasks-count">(${tasksArray.length})</span>
  </li>
  <li>
    <button type="button" data-category="checked">Checked Tasks</button>
    <span id="checked-tasks-count">(${
      tasksArray.filter((task) => task.isChecked).length
    })</span>
  </li>
  <li>
    <button type="button" data-category="favorites">Favorites Task</button>
    <span id="favorites-tasks-count">(${
      tasksArray.filter((task) => task.isFavorites).length
    })</span>
  </li>
  `;

  taskCategory.innerHTML = `<option value="" selected disabled>Select a Category</option>`;

  categoriesArray.forEach((category) => {
    let categoryItem = document.createElement("li");
    let categoryName = document.createElement("button");
    let tasksCounter = document.createElement("span");
    let option = document.createElement("option");

    categoryName.textContent = category.name;
    categoryName.classList.add("category-button");
    categoryName.dataset.category = category.name.toLowerCase();
    tasksCounter.textContent = `(${
      tasksArray.filter(
        (task) => task.category.toLowerCase() === category.name.toLowerCase()
      ).length
    })`;
    option.textContent = category.name;
    option.value = category.name.toLowerCase();

    categoryItem.appendChild(categoryName);
    categoryItem.appendChild(tasksCounter);
    categoryList.appendChild(categoryItem);
    taskCategory.appendChild(option);
  });

  const categoryButtons = document.querySelectorAll(
    ".category-button, [data-category]"
  );
  categoryButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const selectedCategory = event.target.dataset.category;
      if (selectedCategory === "all") {
        title.textContent = "All Tasks";
        renderTask(tasksArray);
      } else if (selectedCategory === "checked") {
        title.textContent = "Checked Tasks";
        renderTask(tasksArray.filter((task) => task.isChecked));
      } else if (selectedCategory === "favorites") {
        title.textContent = "Favorites Tasks";
        renderTask(tasksArray.filter((task) => task.isFavorites));
      } else {
        title.textContent =
          selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        renderTask(
          tasksArray.filter(
            (task) => task.category.toLowerCase() === selectedCategory
          )
        );
      }
    });
  });
};
renderCategory();

// Function to render a task in the tasks list:
const renderTask = (filteredTasksArray) => {
  taskList.innerHTML = "";
  const tasksToRender = filteredTasksArray || tasksArray;
  if (tasksToRender.length > 0) {
    tasksToRender.forEach((task) => {
      const taskItem = document.createElement("li");
      const taskContainer = document.createElement("div");
      const taskInput = document.createElement("input");
      const taskLabel = document.createElement("label");
      const categorySelect = document.createElement("select");
      const buttonContainer = document.createElement("div");
      const favoriteButton = document.createElement("button");
      const deleteButton = document.createElement("button");

      taskInput.type = "checkbox";
      taskInput.setAttribute("id", task.id);
      taskInput.checked = task.isChecked;
      taskLabel.textContent = task.name;
      taskLabel.setAttribute("for", task.id);
      favoriteButton.id = "favorites-button";
      favoriteButton.classList.add("ph-heart-straight");
      favoriteButton.classList.add(task.isFavorites ? "ph-fill" : "ph-bold");
      deleteButton.id = "delete-button";
      deleteButton.classList.add("ph-bold");
      deleteButton.classList.add("ph-trash");

      categoriesArray.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.name.toLowerCase();
        option.textContent = category.name;
        if (task.category.toLowerCase() === category.name.toLowerCase()) {
          option.selected = true;
        }
        categorySelect.appendChild(option);
      });

      categorySelect.addEventListener("change", (event) => {
        task.category = event.target.value;
        saveToLocalStorage("tasks", tasksArray);
        renderCategory();
      });

      taskInput.addEventListener("click", () => {
        task.isChecked = taskInput.checked;
        saveToLocalStorage("tasks", tasksArray);
        renderCategory();
      });

      favoriteButton.addEventListener("click", () => {
        task.isFavorites = !task.isFavorites;
        saveToLocalStorage("tasks", tasksArray);
        renderTask();
        renderCategory();
      });

      deleteButton.addEventListener("click", () => {
        if (
          confirm(
            `Are you sure you want to permanently delete the task "${task.name}"? This action cannot be undone.`
          )
        ) {
          tasksArray = tasksArray.filter(
            (taskTarget) => taskTarget.id !== task.id
          );
          saveToLocalStorage("tasks", tasksArray);
          renderTask();
          renderCategory();
        }
      });

      taskContainer.appendChild(taskInput);
      taskContainer.appendChild(taskLabel);
      taskContainer.appendChild(categorySelect);
      buttonContainer.appendChild(favoriteButton);
      buttonContainer.appendChild(deleteButton);
      taskItem.appendChild(taskContainer);
      taskItem.appendChild(buttonContainer);

      taskList.prepend(taskItem);
    });
  } else {
    const message = filteredTasksArray
      ? "Nothing was found! How about adding a task instead?"
      : "Your task list is empty. Add your first task!";

    taskList.innerHTML = `<li>${message}</li>`;
  }
};
renderTask();
/*
  - Event Listeners:
*/

// Event listener for input changes to toggle button visibility:
categoryInput.addEventListener("input", toggleButtonVisibility);

// Event listener for category form submission:
categoryForm.addEventListener("submit", (event) => {
  const categoryInputValue = categoryInput.value.trim();

  event.preventDefault();
  if (!categoryInputValue) {
    showAlertForMissingName("Category");
  } else if (checkIfExists(categoriesArray, categoryInputValue, "category")) {
  } else {
    categoriesArray.push({
      name: categoryInputValue,
    });
    saveToLocalStorage("categories", categoriesArray);
    renderCategory();
    renderTask();
    categoryInput.value = "";
    toggleButtonVisibility();
  }
});

// Event listener for task form submission:
taskForm.addEventListener("submit", (event) => {
  const taskInputValue = taskInput.value.trim();
  const selectedCategory = taskCategory.value;

  event.preventDefault();
  if (!taskInputValue) {
    showAlertForMissingName("Task");
  } else if (checkIfExists(tasksArray, taskInputValue, "task")) {
  } else if (!selectedCategory) {
    alert(
      "Please select a category to assign your task. This helps in organizing your tasks effectively."
    );
  } else {
    tasksArray.push({
      id: Date.now(),
      name: taskInputValue,
      category: selectedCategory,
      isChecked: false,
      isFavorites: false,
    });
    saveToLocalStorage("tasks", tasksArray);
    renderTask();
    taskInput.value = "";
    taskCategory.value = "";
  }
});

// Input event listener for filtering tasks based on user input:
taskInput.addEventListener("input", () => {
  const filteredTasks = tasksArray.filter((task) =>
    task.name.toLowerCase().includes(taskInput.value.trim().toLowerCase())
  );
  renderTask(filteredTasks);
});
