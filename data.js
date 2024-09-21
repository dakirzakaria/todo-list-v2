"use strict";

export let categoriesArray = JSON.parse(localStorage.getItem("categories")) || [
  {
    name: "All Tasks",
    active: true,
  },
  {
    name: "Checked Tasks",
  },
  {
    name: "Favorite Tasks",
  },
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

export let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [
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
