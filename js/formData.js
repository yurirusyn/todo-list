const refs = {
    inputTitle: document.querySelector(".modal-input"),
    inputDescription: document.querySelector(".modal-text"),
    inputDate: document.querySelector(".modal-date"),
    tasksDiv: document.querySelector(".tasks"),
    task: document.querySelector(".task"),
    // containerDiv: document.querySelector(".container"),
    formEditing: document.querySelector(".login-formEditing"),
    form: document.querySelector(".login-form"),
    resolvedBtn: document.querySelector(".buttonResolved"),
    openModalBtn: document.querySelectorAll('[data-modalediting-open]'),
    closeModalBtn: document.querySelector('[data-modalEditing-close]'),
    modal: document.querySelector('[data-modalEditing]'),
    inputTitleEditing: document.querySelector(".modalEditing-input"),
    inputDescriptionEditing: document.querySelector(".modalEditing-text"),
    inputDateEditing: document.querySelector(".modalEditing-date"),
    submitEditingEle: document.querySelector(".submitEditing-button"),
    cancelEditingEle: document.querySelector(".cancelEditingEle-button"),
    modalResolved: document.querySelector('[data-modalResolved]'),
    closeModalResolvedBtn: document.querySelector('[data-modalresolved-close]'),
    modalResolvedDiv: document.querySelector(".taskResolved"),
    buttons: document.querySelector('.deadlineTitle')
};


let arrayOfTasks =[];
let dataId;


function toggleModal() {
    refs.modal.classList.toggle('is-hidden');
}

function toggleModalResolved() {
    refs.modalResolved.classList.toggle('is-hidden');
}

refs.form.addEventListener("submit", handleSubmit);


if(window.localStorage.getItem("tasks")) {
    arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"))
}
getTaskFromLocalStorage();

function handleSubmit(event) {
    event.preventDefault();

    if (refs.inputTitle.value === "" || refs.inputDescription.value === "") {
      return alert("Please fill in all the fields!");
    }
    
    const deadline = new Date(refs.inputDate.value);
    const task = {
        id : Date.now(),
        deadline: deadline.getTime(),
        title : refs.inputTitle.value,
        description : refs.inputDescription.value,
        complated : false,
    };

    arrayOfTasks.push(task);
    addTaskToLocalStorage(arrayOfTasks);
    addTaskToPage(arrayOfTasks);
    event.currentTarget.reset();
    getTaskFromLocalStorage();
  }


  function handleSubmitEditing(event) {
    event.preventDefault();
    const deadline = new Date(refs.inputDateEditing.value);
    
    if (refs.inputTitleEditing.value === "" || refs.inputDescriptionEditing.value === "") {
      return alert("Please fill in all the fields!");
    }
    
    const newTask = {
        id : Number(dataId),
        deadline: deadline.getTime(),
        title : refs.inputTitleEditing.value,
        description : refs.inputDescriptionEditing.value,
        complated : false,
    };
   let replaced = [newTask, ...arrayOfTasks.filter(i => i.id !== newTask.id)]
    arrayOfTasks.push(replaced);
    addTaskToLocalStorage(replaced);
    addTaskToPage(replaced);
    event.currentTarget.reset();

  }

  refs.formEditing.addEventListener("submit", handleSubmitEditing)
  

function addTaskToPage(arrayOfTasks) {
    refs.tasksDiv.innerHTML = "";

    arrayOfTasks.forEach((task) => {
        let currentTime = task.deadline - Date.now();
        const {days, hours,  minutes}  =  convertMs(currentTime);
        let div = document.createElement("div");
        let divButtons = document.createElement("div");
        div.className = "task";
        if(task.complated){
            div.className = "task done";
        }
        div.setAttribute("data-id",task.id);
        divButtons.setAttribute("data-id",task.id);

        let span = document.createElement("span");
        let title = document.createElement("p");
        let deadline = document.createElement("span")
        let deadlineTitle = document.createElement("p")
        let taskContent = document.createElement("p")
        let editingButton = document.createElement("button")
        let doneButton = document.createElement("button")

        doneButton.className = "doneButton"
        divButtons.className = "editingButtonDiv"
        editingButton.setAttribute("data-modalediting-open", "");
        editingButton.className = "editingButton"
        deadlineTitle.className = "deadlineTitle";
        span.className = "del";
        title.className = "task-title"
        taskContent.className = "task-content"
        deadline.className = "deadline"
        
        doneButton.appendChild(document.createTextNode("Done"))
        editingButton.appendChild(document.createTextNode("Editing"))
        span.appendChild(document.createTextNode("Delete"))
        title.appendChild(document.createTextNode(task.title))
        taskContent.appendChild(document.createTextNode(task.description))
        deadlineTitle.appendChild(document.createTextNode("Time until the deadline"))
        deadline.appendChild(document.createTextNode(`Days:${' '}${days} Hours:${' '} ${hours} Minutes:${' '} ${minutes}`))
        
        div.appendChild(title)
        div.appendChild(taskContent)
        div.appendChild(deadlineTitle)
        div.appendChild(deadline)
        divButtons.appendChild(span);
        divButtons.appendChild(doneButton);
        divButtons.appendChild(editingButton)
        
        refs.tasksDiv.appendChild(div)
        div.appendChild(divButtons)
    });
}

function addTaskToResolvedPage(arrayOfTasks) {

    arrayOfTasks.forEach((task) => {
        let currentTime = task.deadline - Date.now();
        const {days, hours,  minutes}  =  convertMs(currentTime);
        let div = document.createElement("div");
        div.className = "taskResolved";
        if(task.complated){
            div.className = "task done";
        }
        div.setAttribute("data-id",task.id);
        let delButton = document.createElement("button");
        let title = document.createElement("p");
        let deadline = document.createElement("span")
        let deadlineTitle = document.createElement("p")
        let taskContent = document.createElement("p")
     
        deadlineTitle.className = "deadlineTitle";
        delButton.className = "del";
        title.className = "task-title"
        taskContent.className = "task-content"
        deadline.className = "deadline"
        

        delButton.appendChild(document.createTextNode("Delete"))
        title.appendChild(document.createTextNode(task.title))
        taskContent.appendChild(document.createTextNode(task.description))
        deadlineTitle.appendChild(document.createTextNode("Time until the deadline"))
        deadline.appendChild(document.createTextNode(`Days:${days} Hours:${hours} Minutes:${minutes}`))

        div.appendChild(title)
        div.appendChild(taskContent)
        div.appendChild(deadlineTitle)
        div.appendChild(deadline)
        div.appendChild(delButton);

        refs.modalResolvedDiv.appendChild(div)
    });
}


``
function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }

function addTaskToLocalStorage(arrayOfTasks){
    window.localStorage.setItem("tasks",JSON.stringify(arrayOfTasks));
}

function getTaskFromLocalStorage(){
    let data = window.localStorage.getItem("tasks")
    if(data){
        let tasks = JSON.parse(data);
        const taskactive = tasks.filter(obj => obj.complated === false)
        const taskResolved = tasks.filter(obj => obj.complated === true)
        addTaskToPage(taskactive);
        addTaskToResolvedPage(taskResolved)
    }
}

// Buttons 

refs.tasksDiv.onclick = ((e) => {
    if (e.target.classList.contains("del")) {
        deleteTaskFromLocalStorage(e.target.parentElement.getAttribute("data-id"));
        getTaskFromLocalStorage();
    }
    
    if (e.target.classList.contains("doneButton")) {
        updateStatusInLocalStorage(e.target.parentElement.getAttribute("data-id"));
        getTaskFromLocalStorage()
    }

    if (e.target.classList.contains("editingButton")) {
        dataId = e.target.closest('.task').getAttribute('data-id');
        refs.modal.classList.toggle('is-hidden');
        refs.closeModalBtn.addEventListener('click', toggleModal);
        refs.cancelEditingEle.addEventListener('click', toggleModal);
        return dataId
    }

})


refs.resolvedBtn.onclick = ((e) => {
    const results = arrayOfTasks.filter(obj => obj.complated === true)
    if (results.length === 0) {
        return alert("You don't have completed tasks");
    }
    refs.closeModalResolvedBtn.addEventListener('click', toggleModalResolved);
    refs.modalResolved.classList.toggle('is-hidden');
})


refs.modalResolvedDiv.onclick = ((e) => {
    if (e.target.classList.contains("del")) {
        deleteTaskFromLocalStorage(e.target.parentElement.getAttribute("data-id"));
        getTaskFromLocalStorage()
        e.target.parentElement.remove();
    } 
})



function deleteTaskFromLocalStorage(taskId) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
    addTaskToLocalStorage(arrayOfTasks);
}
function updateStatusInLocalStorage(taskId) {
    arrayOfTasks.forEach((task) =>{
        if(task.id == taskId)
            task.complated == false ? task.complated = true:task.complated = false;
    });

    addTaskToLocalStorage(arrayOfTasks);
}
