const priorityDictionary = {
    "0": {
        id: 0,
        name: "любой",
    },
    "1": {
        id: 1,
        name: "низкий",
        color: "red",
    },
    "2": {
        id: 2,
        name: "средний",
        color: "yellow",
    },
    "3": {
        id: 3,
        name: "высокий",
        color: "green",
    },
}

const form = document.form;
const options = {
    priorityTask: document.querySelector("#container_one_priority__list"),
    newTask: document.querySelector("#container_one_text__field"),
    addTask: document.querySelector("#container_one_button_click"),
    listTask: document.querySelector(".container_three")
};
let filteredTasks = [];
let tasks = [];
getTasks();
/**
 * Добавление задачи
 */
function addTask() {
    const priorityId = options.priorityTask.value
    const text = options.newTask.value;
    if (!text || !priorityId) {
        alert("Данные введены некорректно");
        return;
    }
    const task = {
        priorityId,
        text,
        dataCreation: new Date().toLocaleString(),
        statusId: 1
    };
    tasks.push(task);
    filteredTasks.push(task);
    postTasks(task);
    options.priorityTask.value = "";
    options.newTask.value = "";
    options.priorityTask.focus();
    filterTasks();
}
/**
 * Вывод задач
 * @param {*} resultTasks - результирующие задачи
 */
function outputTasks(resultTasks) {
    options.listTask.innerHTML = "";
    resultTasks.forEach((task, index) => {
        options.listTask.innerHTML += `
        <div class="container_three_task" id="${task.id}">
        
            <div class="container_three__priority container_three__priority_${getPriorityField(task.priorityId, 'color')}" id="${task.id}">
                ${getPriorityField(task.priorityId, 'name')}
            </div>

            <div class="container_three__task status-of-task">

                <div class="container_three__textData cursorPointer">

                    <div class="task" type="text" contenteditable="true" onclick=changeTaskText(${task.id})>
                        ${task.text}
                    </div>

                    <div class="data">
                        ${task.dataCreation}
                    </div>

                </div>

                <div class="container_three__icons">
                    <button class="fa-check fa container_complete__icon completeStatus cursorPointer" onclick=completeTask(${task.id}) aria-hidden="true"></button>
                    <button class="fa-times fa container_canceled__icon canceledStatus cursorPointer" onclick=cancelTask(${task.id}) aria-hidden="true"></button>
                </div>
            </div>
            <button class="fa-trash fa container_three__removal__icon cursorPointer" onclick=deleteTask(${task.id}) aria-hidden="true"></button>
        </div>`;
        outputStatuses(task.statusId, index);
    });
}
/**
 * post-запрос добавление задачи на сервер
 * @param {*} task - задача
 */
async function postTasks(task) {
    let response = await fetch('http://127.0.0.1:3000/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
    });
    getTasks();
}

/**
 * запрос всех добавленных задач с сервера
 */
async function getTasks() {
    const res = await fetch('http://127.0.0.1:3000/items', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
    const data = await res.json();
    tasks = data;
    filterTasks();
}

/**
 * изменение задачи на сервере
 * @param {*} id - идентификатор задачи
 * @param {*} task - задача
 */
async function putTasks(id, task) {
    let response = await fetch(`http://127.0.0.1:3000/items/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
    });
    getTasks();
}

/**
 * удаление задачи с сервера
 * @param {*} id - идентификатор задачи
 */
async function deleteTasks(id) {
    let response = await fetch(`http://127.0.0.1:3000/items/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    });
    getTasks();
}

/**
 * Изменение текста задачи
 * @param {*} id - индентификатор задачи
 */
function changeTaskText(id) {
    const newTexts = document.querySelectorAll(".task");
    const taskIndex = tasks.findIndex(task => task.id == id);
    const newText = newTexts[taskIndex];

    newText.onblur = function() {
        tasks[taskIndex].text = newText.innerText;
        putTasks(id, tasks[taskIndex]);
    }
}

/**
 * Удаление задачи
 * @param {*} id - идентификатор задачи
 */
function deleteTask(id) {
    const result = confirm("Вы действительно хотите удалить задачу?");
    if (result) {
        deleteTasks(id);
    }
} 

/**
 * Изменение статуса задачи на "Завершенный"
 * @param {*} taskId - идентификатор задачи
 */
function completeTask(taskId) {
    changeTaskStatus(taskId, 2);
}

/**
 * Изменение статуса задачи на "Отмененный"
 * @param {*} taskId - идентификатор задачи
 */
function cancelTask(taskId) {
    changeTaskStatus(taskId, 3);
}

/**
 * Присвоение статуса задаче
 * @param {*} taskId - идентификатор задачи
 * @param {*} newStatusId - новый статус задачи
 */
function changeTaskStatus(taskId, newStatusId) {
    const task = tasks.find(t => t.id === taskId);
    task.statusId = newStatusId;
    putTasks(taskId, task);
}

/**
 * Вывод задач с измененным статусом 
 * @param {*} statusId - новый статус задачи
 * @param {*} index - индекс задачи
 */
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

/**
 * Получение поля приоритета
 * @param {*} priorityId - идентификатор приоритета
 * @param {*} field - поле приоритета
 * @returns значение поля приоритета
 */
function getPriorityField(priorityId, field) {
    return priorityDictionary[priorityId][field];
}

/**
 * Фильтрация задач
 */
function filterTasks() {
    const statuses = [...document.querySelector('#status').querySelectorAll("input:checked")];
    const statusesValues = statuses.map((status) => Number(status.value));
    const strSearch = form.elements.search.value.substr(1, form.elements.search.value.length);
    const selectedPriorityId = Number(form.elements.filterPriority.value);
    filteredTasks = tasks.filter(function(task) {
            return (
                ((Number(task.priorityId) === selectedPriorityId) || (selectedPriorityId === priorityDictionary[0].id)) 
                && ((statusesValues.includes(task.statusId)) || (!statuses.length))
                && ((task.text.includes(strSearch, 0)) || (!form.elements.search.value))
            );
    });
    sortByDate();
    sortByPriority();
    outputTasks(filteredTasks);
}

/**
 * Сортировка задач по дате
 */
function sortByDate() {
    const sortDate = form.elements.sortDate.value;
    if (sortDate === "ASC") {
        filteredTasks = filteredTasks.sort((a, b) => a.id < b.id ? 1 : -1); 
    } else {
        filteredTasks = filteredTasks.sort((a, b) => a.id > b.id ? 1 : -1);
    }
    outputTasks(filteredTasks);
}

/**
 * Сортировка задач по приоритету
 */
function sortByPriority() {
    const sortPriority = form.elements.sortPriority.value;
    if (sortPriority === "ASC") {
        filteredTasks = filteredTasks.sort((a, b) => a.priorityId < b.priorityId ? 1 : -1);
    } else {
        filteredTasks = filteredTasks.sort((a, b) => a.priorityId > b.priorityId ? 1 : -1);
    }
    outputTasks(filteredTasks);
}