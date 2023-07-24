const submitTodoNode = document.getElementById("submitTodo");
const userInputNode = document.getElementById("userInput");
const prioritySelectorNode = document.getElementById("prioritySelector");

const todoListNode = document.getElementById("todo-list");

// listen to click of submit button
submitTodoNode.addEventListener("click", function () {
  // get text from the input
  // send text to server using api we will use fetch method
  // get response from server
  // if request is successful then display text in the list
  // else display error message

  const todoText = userInputNode.value;// input ki value uthali
  userInputNode.value = "";
 
  // Agar task nhi dala to alert show krdo
  if (!todoText) {
    alert("Please enter a todo");
    return;
  }

  const todo = {
    todoText, // According to ES6 if Key,Value both r same
    completed : false 
  };

  fetch("/todo", { // server pe response chla jaega 
    method: "POST",
    headers: { // har ek request ka header hota hai
      "Content-Type": "application/json", // ki content kis type ka ja rha hai server ke pas
    },
    body: JSON.stringify(todo),// frontend se object jaega string ki form mai
  }).then(function (response) {
    if (response.status === 200) {
      // display todo in UI
      showTodoInUI(todo);
    } else {
      alert("something weird happened");
    }
  });
});

function showTodoInUI(todo) {
  
  const todoNode = document.createElement("todo-item");
  todoNode.classList = 'todo-item'
  todoNode.style.alignItems = "center";

  const todoTextNode = document.createElement("text");
  todoTextNode.className = "text";
  todoTextNode.innerText = "Task : "+todo.todoText;
  if (todo.completed){
    todoTextNode.style.textDecoration = "line-through";
    todoTextNode.style.color = "grey";
  }
  const checkboxNode = document.createElement("input");
  checkboxNode.type = 'checkbox';
  checkboxNode.className = 'checkbox';
  checkboxNode.checked = false;
  checkboxNode.style.margin = "10px" ;

  if (todo.completed){
    checkboxNode.disabled = "true";
    checkboxNode.checked = true;
  }

  const xButtonNode = document.createElement('button');
  xButtonNode.className = 'xButton';
  xButtonNode.innerText = 'X';
  xButtonNode.style.margin = "10px";

  todoNode.appendChild(todoTextNode);
  todoNode.appendChild(checkboxNode);
  todoNode.appendChild(xButtonNode);
  todoListNode.appendChild(todoNode);

  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', checkboxChangeHandler);
  });  

  const xButtons = document.querySelectorAll('.xButton');
  xButtons.forEach(xButton => {
    xButton.addEventListener('click', editDoneHandler);
  });
}

function checkboxChangeHandler(event) {
  const checkbox = event.target;
  if (checkbox.checked){
    checkbox.removeEventListener('change', checkboxChangeHandler);

    // Checkbox is checked, delete the parent div
    const parentDiv = this.parentNode;
    const todo_item =  parentDiv.querySelector('.text').innerText.replace("Task : ", "");
    parentDiv.querySelector('.text').style.textDecoration = "line-through";
    parentDiv.querySelector('.text').style.color = "grey";
    parentDiv.querySelector('.checkbox').disabled = "true";
    console.log(todo_item);
    fetch('/edit-todo', {
      method : "POST",
      headers : {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({ filePath : './assign9.json',
                            property : 'todoText',
                            value : todo_item
                          })
    }).then(function(response){
      if (response.status === 200) {
        console.log("success");
      }
      else{
        alert('something weird happened');
      }
    });
  }
}

function editDoneHandler(event){
  const xButton = event.target;
  xButton.removeEventListener('click',editDoneHandler);
  // button is clicked , delete the parent div
  const parentDiv = this.parentNode;
  parentDiv.remove();
  const todo_item =  parentDiv.querySelector('.text').innerText.replace("Task : ", "");;
  console.log(todo_item);
  fetch('/delete-todo', {
    method : "POST",
    headers : {
      "Content-Type": "application/json",
    },
    body : JSON.stringify({ filePath : './assign9.json',
                          property : 'todoText',
                          value : todo_item })
  }).then(function(response){
    if (response.status === 200) {
      console.log("success");
    }
    else{
      alert('something weird happened');
    }
  });    
}


fetch("/todo-data")
  .then(function (response) {
    if (response.status === 200) {
      return response.json();
    } else {
      alert("something weird happened");
    }
  })
  .then(function (todos) {
    todos.forEach(function (todo) {
      showTodoInUI(todo);
    });
});