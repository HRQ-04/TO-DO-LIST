const tasks = [];

document.getElementById('addTask').addEventListener('submit', function(event) {
    event.preventDefault();
    addToTable();
});

const selectHour = document.getElementById('startTime');
        
    for (let hours = 0; hours <= 23; hours++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
            const hourFormat = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = hourFormat;
            option.text = hourFormat;
            selectHour.appendChild(option);
        }
    }

const selectHour2 = document.getElementById('endTime');
        
    for (let hours = 0; hours <= 23; hours++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
            const hourFormat = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = hourFormat;
            option.text = hourFormat;
            selectHour2.appendChild(option);
        }
    }

function addToTable() {
    const taskTitle = document.getElementById("taskTitle").value;
    const daysWeek = document.getElementById("daysWeek").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const categories = document.getElementById("categories").value;

    if (taskTitle === "" || daysWeek === "" || startTime === "" || endTime === "" || categories === "") {
        alert("Please fill in all fields!");
        return;
    } else if (taskTitle.length > 30) {
        alert("Your task name must be less than 30 characters!");
        return;
    } else if (tasks.some(t => (t.daysWeek === daysWeek && t.startTime === startTime || t.daysWeek === daysWeek && t.endTime === endTime))) {
        alert("There is already a task scheduled at this time!");
        return;
    }

    const newTask = { taskTitle, daysWeek, startTime, endTime, categories };
    tasks.push(newTask);
    renderTable();
    clearForm();
}

function renderTable() {
    const table = document.getElementById("content");
    table.innerHTML = "";

    const sortedTasks = tasks.sort((a, b) => {
        
        const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const dayComparison = dayOrder.indexOf(a.daysWeek) - dayOrder.indexOf(b.daysWeek);
        if (dayComparison !== 0) return dayComparison;

        const startTimeA = parseInt(a.startTime.split(':')[0]) * 60 + parseInt(a.startTime.split(':')[1]);
        const startTimeB = parseInt(b.startTime.split(':')[0]) * 60 + parseInt(b.startTime.split(':')[1]);
        return startTimeA - startTimeB;
    });

    sortedTasks.forEach(task => {
        const newRow = table.insertRow();
        const cellTaskTitle = newRow.insertCell(0);
        const cellDaysWeek = newRow.insertCell(1);
        const cellStartTime = newRow.insertCell(2);
        const cellEndTime = newRow.insertCell(3);
        const cellCategories = newRow.insertCell(4);
        const cellRemoveButton = newRow.insertCell(5);

        cellTaskTitle.innerHTML = task.taskTitle;
        cellDaysWeek.innerHTML = task.daysWeek;
        cellStartTime.innerHTML = task.startTime;
        cellEndTime.innerHTML = task.endTime;
        cellCategories.innerHTML = task.categories;
        
        const removeButton = document.createElement('i');
        removeButton.className = "fa-solid fa-trash-can";
        removeButton.style.color = '#000000';
        removeButton.style.border = '0';
        removeButton.style.fontSize = 'larger';
        removeButton.style.backgroundColor = '#ffffff';
        removeButton.style.cursor = 'pointer';
        removeButton.addEventListener('click', () => {
        removeTask(task);
        });

        cellRemoveButton.appendChild(removeButton);
    });
};

function clearForm() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("daysWeek").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("categories").value = "";
}

function removeTask(taskToRemove) {
    const index = tasks.indexOf(taskToRemove);
    if (index !== -1) {
        tasks.splice(index, 1);
        renderTable();
    }
}

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("Data saved!");
    displayCategoryMessage();
}

function upload() {
    const data = localStorage.getItem("tasks");

    if (data) {
        tasks.length = 0;
        tasks.push(...JSON.parse(data));
        renderTable();
        alert("Data loaded!");
        displayCategoryMessage();
    } else {
        alert("You don't have saved data");
    }
}

function displayCategoryMessage() {
    const categoryCounts = tasks.reduce((counts, task) => {
        counts[task.categories] = (counts[task.categories] || 0) + 1;
        return counts;
    }, {});

    const predominantCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

    const messages = {
        "Indispensable": "Congratulations! Most of your tasks are indispensable!",
        "High priority": "Excellent! Most of your tasks are high priority!",
        "Medium priority": "Be careful! Most of your tasks are medium priority.",
        "Low priority": "Try to be more productive. Most of your tasks are low priority.",
        "Don't do this again": "Learn to say no to tasks that don't make you happy. Most of your tasks should not be repeated."
    };

    displayTemporaryMessage(messages[predominantCategory]);
}

function displayTemporaryMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = "";
    }, 15000);
}