// Grab elements functions
const selectElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) return element;
  throw new Error(
    `Something went wrong! Make sure that ${selector} exists/is typed correctly.`
  );
};

const selectAllElements = (selector) => {
  const element = document.querySelectorAll(selector);
  if (element) return element;
  throw new Error(
    `Something went wrong! Make sure that ${selector} exists/is typed correctly.`
  );
};

const createElement = (selector) => {
  const newElement = document.createElement(selector);
  if (newElement) return newElement;
  throw new Error(
    `Something went wrong! Make sure that ${selector} exists/is typed correctly.`
  );
};

// getSavedTodos
const getLocalTodos = () => {
  const todosJSON = localStorage.getItem("todos");

  try {
    return todosJSON ? JSON.parse(todosJSON) : [];
  } catch (e) {
    return [];
  }
};

// Save todos to localStorage
const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const removeTodo = (id) => {
    const index = todos.findIndex((todo) => todo.id === id)

    if (index > -1){
        todos.splice(index, 1);
    }
    return todos;
}

const createTodoDOM = (todos) => {
  todos.forEach((todo) => {
    const todoElement = createElement("label");
    const containerElement = createElement("div");
    const checkbox = createElement("input");
    const removeButton = createElement("button");
    const todoText = createElement("span");

    //Setup container
    containerElement.classList.add("list-item__container");
    todoElement.classList.add("list-item");
    todoElement.appendChild(containerElement);

    //create checkbox
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = todo.completed;
    containerElement.appendChild(checkbox);
    checkbox.addEventListener("change", (e) => {
      todo.completed = e.target.checked;
      saveTodos(todos);
      renderTodos(todos, filters);
    });

    //Create text element for the Todo
    todoText.textContent = todo.text;
    containerElement.appendChild(todoText);

    //Create remove button
    removeButton.textContent = "remove";
    removeButton.classList.add("button", "button--text");
    todoElement.appendChild(removeButton);
    removeButton.addEventListener("click", () => {
      todos = removeTodo(todo.id);
      saveTodos(todos);
      renderTodos(todos, filters);
    });

    document.querySelector("#todos").appendChild(todoElement);
  });
};

const getSummaryDOM = (todos) => {
  const summary = createElement("h2");
  const completedTodos = todos.filter((todo) => !todo.completed);
  summary.classList.add("list-title");
  if (completedTodos.length > 1) {
    summary.textContent = `You have ${completedTodos.length} todos left`;
  } else {
    summary.textContent = `You have ${completedTodos.length} todo left`;
  }
  selectElement("#todos").appendChild(summary);
};

const renderTodos = (todos, filters) => {
  selectElement("#todos").innerHTML = "";
  let filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
  );
  if (filters.hideCompleted) {
    filteredTodos = todos.filter(
      (todo) => todo.completed === !filters.hideCompleted
    );
  }
  getSummaryDOM(todos);
  createTodoDOM(filteredTodos);
};

const todos = getLocalTodos();
const filters = {
    searchText: "",
    hideCompleted: false
};

renderTodos(todos, filters);

selectElement('#filter-todo').addEventListener('input', (e) => {
    filters.searchText = e.target.value;
    renderTodos(todos, filters);
});

selectElement('#todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const todoValue = e.target.elements.addTodo.value.trim();
    if(todoValue) {
        todos.push({
            id: Math.random(),
            text: todoValue,
            completed: false
        });
        console.log(todos);
        saveTodos(todos);
        renderTodos(todos, filters);
        e.target.elements.addTodo.value = "";
    }
});

selectElement("#hide-completed").addEventListener("change", (e) => {
  filters.hideCompleted = e.target.checked;
  renderTodos(todos, filters);
});