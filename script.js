
const form = document.form;
const options = {
    priorityTask: document.querySelector("#container_one_priority__list"),
    newTask: document.querySelector("#container_one_text__field"),
    addTask: document.querySelector("#container_one_button_click"),
    listTask: document.querySelector(".container_three")
};
let filteredTasks = [];
const tasks = [];
options.addTask.onclick = () => {
    addTask();
};

//добавление задачи
function addTask() {
    const priority = options.priorityTask.value
    const text = options.newTask.value;
    if (!text || !priority) {
        alert("Данные введены некорректно");
        return;
    }
    const task = {
        id: Date.now(),
        priority,
        text,
        dataCreation: new Date().toLocaleString(),
        statusId: 1
    };
    tasks.push(task);
    filteredTasks.push(task);
    options.priorityTask.value = "";
    options.newTask.value = "";
    options.priorityTask.focus();
    outputTasks(tasks);
}

//вывод задач
function outputTasks(result) {
    options.listTask.innerHTML = "";
    result.forEach((task, index) => {
        options.listTask.innerHTML += `
        <div class="container_three_task" id="${task.id}">
        
            <div class="container_three__priority container_three__priority_${getPriorityColor(task.priority)}" id="${task.id}">
                ${task.priority}
            </div>

            <div class="container_three__task status-of-task">

                <div class="container_three__textData">

                    <div class="task" type="text" contenteditable="true" onclick=changeTask(${task.id})>
                    ${task.text}
                    </div>

                    <div class="data">
                        ${task.dataCreation}
                    </div>

                </div>

                <div class="container_three__icons">
                    <button class="fa-check fa container_complete__icon completeStatus" onclick=completeTask(${task.id}) aria-hidden="true"></button>
                    <button class="fa-times fa container_canceled__icon canceledStatus" onclick=cancelTask(${task.id}) aria-hidden="true"></button>
                </div>
            </div>
            <button class="fa-trash fa container_three__removal__icon" onclick=deleteTask(${task.id}) aria-hidden="true"></button>
        </div>`;
        outputStatuses(task.statusId, index);
    });
}

//изменение задачи
function changeTask(id){
    const newTexts = document.querySelectorAll(".task");
    const taskIndex = tasks.findIndex(task => task.id == id);
    const newText = newTexts[taskIndex];

    newText.onblur = function() {
        tasks[taskIndex].text = newText.innerText;
        outputTasks(tasks);
    }
}

// удаление задачи
function deleteTask(id) {
    const result = confirm("Вы действительно хотите удалить задачу?");
    if (result) {
        const foundedTaskIndex = tasks.findIndex(task => task.id == id);
        tasks.splice(foundedTaskIndex, 1);
        outputTasks(tasks);
    }
} 

//изменение статуса задачи на завершенный
function completeTask(taskId) {
    changeTaskStatus(taskId, 2);
    outputTasks(tasks);
}

//изменение статуса задачи на отмененный
function cancelTask(taskId) {
    changeTaskStatus(taskId, 3);
    outputTasks(tasks);
}

//присвоение статуса найденной задаче
function changeTaskStatus(taskId, newStatusId) {
    const task = tasks.find(t => t.id === taskId);
    task.statusId = newStatusId;
}

//вывод задач с измененным статусом
function outputStatuses(statusId, index) {
    const taskStatuses = document.querySelectorAll('.status-of-task'); 
    const taskStatusClassList = taskStatuses[index].classList;

    const priorityCompleteStatuses = document.querySelectorAll('.completeStatus');
    const priorityCompleteStatusesClassList = priorityCompleteStatuses[index].classList;

    const priorityCanceledStatuses = document.querySelectorAll('.canceledStatus');
    const priorityCanceledStatusesClassList = priorityCanceledStatuses[index].classList;
    switch (statusId) {
        case 2: {
            taskStatusClassList.remove('cancelled-task');
            taskStatusClassList.add('completed-task');
            priorityCompleteStatusesClassList.remove('fa-check');
            break;
        }
        case 3: {
            taskStatusClassList.remove('completed-task');
            taskStatusClassList.add('cancelled-task');
            priorityCanceledStatusesClassList.remove('fa-times');
            break;
        }
        default: {
            taskStatusClassList.remove('completed-task');
            taskStatusClassList.remove('cancelled-task');
        }
    }
}

//изменение цвета приоритета 
function getPriorityColor(priority) {
    const priorityDictionary = {
        'низкий': 'red',
        'средний': 'yellow',
        'высокий': 'green'
    };
    return priorityDictionary[priority.toLowerCase()];
}

//филтьтрация задач
function filterTasks() {
    const statuses = document.querySelectorAll(".filterstatus input:checked");
    console.log(statuses);
    const status = [Number(form.elements.active.value), Number(form.elements.canceled.value), Number(form.elements.completed.value)];
    const strSearch = form.elements.search.value.substr(1, form.elements.search.value.length);
    filteredTasks = tasks.filter(function (task) {
            return (
                ((task.priority.toLowerCase() === form.elements.filterPriority.value.toLowerCase()) || (form.elements.filterPriority.value.toLowerCase() === "любой")) 
                && 
                    (((task.statusId === status[0]) && (form.elements.active.checked))
                    || ((task.statusId === status[1]) && (form.elements.canceled.checked)) 
                    || ((task.statusId === status[2]) && (form.elements.completed.checked))
                    || (!(form.elements.active.checked) && (!form.elements.canceled.checked) && (!form.elements.completed.checked)))
                && ((task.text.includes(strSearch, 0)) || (form.elements.search.value === ""))
            )
    })
    outputTasks(filteredTasks);
}

