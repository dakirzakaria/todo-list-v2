"use strict";

const emptyString = "";

// DOM elements
const categoryList = document.getElementById("category-list");
const categoryForm = document.getElementById("category-form");
const categoryInput = document.getElementById("category-input");
const addCategoryButton = document.getElementById("add-category-button");
const allTasksCount = document.getElementById("all-tasks-count");
const checkedTasksCount = document.getElementById("checked-tasks-count");
const favoritesTasksCount = document.getElementById("favorites-tasks-count");

let categoriesArray = JSON.parse(localStorage.getItem("categories")) || [
  "Uncategorized",
  "Groceries",
  "Work",
  "Study",
  "Sports",
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

//--------------------------------------------------------------

/*
  Function to check if a category already exists in the categories array
*/
const checkCategoryExists = (categoryName) => {
  return categoriesArray.some(
    (category) => category.toLowerCase() === categoryName.toLowerCase()
  );
};

/*
  Function to toggle the visibility of the "Add Category" button
*/
const toggleButtonVisibility = () => {
  addCategoryButton.style.display = categoryInput.value.trim()
    ? "block"
    : "none";
};
toggleButtonVisibility();

/*
  Function to save the categories array to localStorage 
*/
const saveCategories = () => {
  localStorage.setItem("categories", JSON.stringify(categoriesArray));
};

/*
  Function to update task counters
*/
const updateTaskCounters = () => {
  const allTasks = tasksArray.length;
  const checkedTasks = tasksArray.filter((task) => task.isChecked).length;
  const favoritesTasks = tasksArray.filter((task) => task.isFavorites).length;

  allTasksCount.textContent = `(${allTasks})`;
  checkedTasksCount.textContent = `(${checkedTasks})`;
  favoritesTasksCount.textContent = `(${favoritesTasks})`;
};
updateTaskCounters();

/*

*/
const renderCategory = () => {
  categoryList.innerHTML = "";
  categoriesArray.forEach((category) => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    let span = document.createElement("span");
    let option = document.createElement("option");
    button.textContent = category;
    button.classList.add("category-button");
    span.textContent = `(${
      tasksArray.filter(
        (task) => task.category.toLowerCase() === category.toLowerCase()
      ).length
    })`;
    option.textContent = category;
    option.value = category.toLowerCase();
    li.appendChild(button);
    li.appendChild(span);
    categoryList.appendChild(li);
    taskCategory.appendChild(option);
  });
};
renderCategory();

/*
  Function to save the tasks array to localStorage 
*/
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
};

/*
  Function to check if a task already exists in the tasks array
*/
const checkTaskExists = (taskName) => {
  return tasksArray.some(
    (task) => task.name.toLowerCase() === taskName.toLowerCase()
  );
};

/*
  Function to render a task in the tasks list
*/
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
      favoriteButton.classList.add(
        task.isFavorites ? "ri-heart-fill" : "ri-heart-line"
      );
      deleteButton.id = "delete-button";
      deleteButton.classList.add("ri-delete-bin-fill");

      categoriesArray.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        if (task.category.toLowerCase() === category.toLowerCase()) {
          option.selected = true;
        }
        categorySelect.appendChild(option);
      });

      categorySelect.addEventListener("change", (event) => {
        task.category = event.target.value;
        saveTasks();
        renderCategory();
      });

      taskInput.addEventListener("click", () => {
        task.isChecked = taskInput.checked;
        saveTasks();
        updateTaskCounters();
      });

      favoriteButton.addEventListener("click", () => {
        task.isFavorites = !task.isFavorites;
        saveTasks();
        renderTask();
        updateTaskCounters();
      });

      deleteButton.addEventListener("click", () => {
        if (confirm("Please confirm if you want to delete this task.")) {
          tasksArray = tasksArray.filter(
            (taskTarget) => taskTarget.id !== task.id
          );
          saveTasks();
          renderTask();
          updateTaskCounters();
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
  Task form submission logic
*/
categoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const categoryInputValue = categoryInput.value.trim();
  if (!categoryInputValue) {
    alert("Please enter a category name before submitting!");
  } else if (checkCategoryExists(categoryInputValue)) {
    alert("A category with this name already exists in your list!");
  } else {
    categoriesArray.push(categoryInputValue);
    saveCategories();
    renderCategory();
    renderTask();
    categoryInput.value = emptyString;
    toggleButtonVisibility();
  }
});

/*
  Add an event listener to the category input field to call
  toggleButtonVisibility whenever the input changes
*/
categoryInput.addEventListener("input", toggleButtonVisibility);

/* 
  Task form submission logic
*/
taskForm.addEventListener("submit", (event) => {
  const taskInputValue = taskInput.value.trim();
  const selectedCategory =
    taskCategory.value === "Categories" ? "Uncategorized" : taskCategory.value;
  event.preventDefault();
  if (!taskInputValue) {
    alert("Please enter a task!");
  } else if (checkTaskExists(taskInputValue)) {
    alert("A task with this name already exists in your list!");
  } else {
    const task = {
      id: Date.now(),
      name: taskInputValue,
      category: selectedCategory,
      isChecked: false,
      isFavorites: false,
    };
    tasksArray.push(task);
    saveTasks();
    renderTask();
    taskInput.value = emptyString;
    taskCategory.value = "Categories";
  }
});

/*
  Input event listener for filtering tasks based on user input
*/
taskInput.addEventListener("input", () => {
  // const taskInputValue = taskInput.value.trim().toLowerCase();
  const filteredTasks = tasksArray.filter((task) =>
    task.name.toLowerCase().includes(taskInput.value.trim().toLowerCase())
  );
  renderTask(filteredTasks);
});
