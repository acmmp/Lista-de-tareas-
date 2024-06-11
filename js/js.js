document.addEventListener('DOMContentLoaded', (event) => {
    loadTasks();
    loadCalendar();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskStartTime = document.getElementById('taskStartTime');
    const taskEndTime = document.getElementById('taskEndTime');
    const taskList = document.getElementById('taskList');
    const taskText = taskInput.value.trim();
    const taskDateValue = taskDate.value;
    const taskStartTimeValue = taskStartTime.value;
    const taskEndTimeValue = taskEndTime.value;

    if (taskText === '' || taskDateValue === '' || taskStartTimeValue === '' || taskEndTimeValue === '') {
        alert('Por favor, ingresa una tarea, una fecha y horas de inicio y fin.');
        return;
    }

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item task-item';
    listItem.innerHTML = `
        <span>${taskText} (Fecha: ${taskDateValue}, De: ${taskStartTimeValue} a: ${taskEndTimeValue})</span>
        <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Eliminar</button>
    `;

    taskList.appendChild(listItem);
    taskInput.value = '';
    taskDate.value = '';
    taskStartTime.value = '';
    taskEndTime.value = '';

    saveTasks();
    loadCalendar();
}

function deleteTask(button) {
    const listItem = button.parentElement;
    listItem.remove();
    saveTasks();
    loadCalendar();
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    taskList.querySelectorAll('.task-item span').forEach(task => {
        const taskText = task.innerText;
        const taskParts = taskText.split(' (Fecha: ');
        const taskDescription = taskParts[0];
        const taskDateAndTime = taskParts[1].slice(0, -1); // Eliminar el paréntesis final
        const [taskDate, taskTime] = taskDateAndTime.split(', De: ');
        const [startTime, endTime] = taskTime.split(' a: ');
        tasks.push({ description: taskDescription, date: taskDate, startTime: startTime, endTime: endTime });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        const taskList = document.getElementById('taskList');
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item task-item';
            listItem.innerHTML = `
                <span>${task.description} (Fecha: ${task.date}, De: ${task.startTime} a: ${task.endTime})</span>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Eliminar</button>
            `;
            taskList.appendChild(listItem);
        });
    }
}

function loadCalendar() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const events = tasks.map(task => ({
        title: task.description,
        start: `${task.date}T${task.startTime}`,
        end: `${task.date}T${task.endTime}`
    }));

    $('#calendar').fullCalendar('destroy'); // Destruir el calendario previo para evitar duplicados
    $('#calendar').fullCalendar({
        events: events,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        editable: true
    });
}


