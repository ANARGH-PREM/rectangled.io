document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.sidebar nav ul li:first-child').addEventListener('click', showTodayTasks);
    document.querySelector('.sidebar .scheduled-tasks').addEventListener('click', showScheduledTasks);
    document.querySelector('.sidebar .settings').addEventListener('click', showSettings);
    document.getElementById('addFilterButton').addEventListener('click', showColorPicker);
    document.getElementById('addNewFilterButton').addEventListener('click', addNewFilter);
    document.getElementById('cancelFilterButton').addEventListener('click', hideColorPicker);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filters = [];

    function initializeDatePicker() {
        flatpickr("#dateInput", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            defaultDate: new Date(),
        });

        document.getElementById('dateIcon').addEventListener('click', () => {
            document.getElementById('dateInput')._flatpickr.open();
        });

        document.getElementById('timeIcon').addEventListener('click', () => {
            document.getElementById('dateInput')._flatpickr.open();
        });
    }

    function resetStyles() {
        const mainContent = document.querySelector('.main-content');
        mainContent.style.backgroundColor = '#A18AFF';
        mainContent.style.color = 'white';
    }

    function showColorPicker() {
        const colorPickerContainer = document.getElementById('colorPickerContainer');
        const addFilterButton = document.getElementById('addFilterButton');
        colorPickerContainer.style.top = `${addFilterButton.offsetTop - colorPickerContainer.offsetHeight - 10}px`;
        colorPickerContainer.style.left = `${addFilterButton.offsetLeft}px`;
        colorPickerContainer.hidden = false;
    }

    function hideColorPicker() {
        document.getElementById('colorPickerContainer').hidden = true;
    }

    function addNewFilter() {
        const color = document.getElementById('colorPicker').value;
        const name = document.getElementById('filterNameInput').value.trim();

        if (!name) {
            alert('Please enter a filter name!');
            return;
        }

        const newFilter = { name, color };
        filters.push(newFilter);

        const filterContainer = document.createElement('div');
        filterContainer.classList.add('subtitle-item');
        filterContainer.innerHTML = `<i class="fa-solid fa-circle" style="color: ${color};"></i> ${name}`;

        document.querySelector('.today-tasks-subtitles').appendChild(filterContainer);

        document.getElementById('colorPickerContainer').hidden = true;
        document.getElementById('filterNameInput').value = '';
    }

    function showTodayTasks() {
        resetStyles();
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        const heading = document.createElement('h2');
        heading.textContent = "Today’s Main Focus";
        mainContent.appendChild(heading);
        const mainFocus = document.createElement('h1');
        mainFocus.textContent = "Design Team Meeting";
        mainContent.appendChild(mainFocus);
        const taskInputSection = document.createElement('div');
        taskInputSection.classList.add('js-add-grid');
        taskInputSection.innerHTML = `
            <div class="input-container">
                <input type="text" id="taskInput" placeholder="What is your next task?" />
                <div class="date-time-picker">
                    <input type="text" id="dateInput" placeholder="Pick a date and time">
                    <i class="fa-solid fa-calendar" id="dateIcon"></i>
                    <i class="fa-solid fa-clock" id="timeIcon"></i>
                </div>
                <button id="addTaskButton">Add Task</button>
            </div>
            <ul class="task-list" id="taskList"></ul>
        `;
        mainContent.appendChild(taskInputSection);
        initializeDatePicker();
        document.getElementById('addTaskButton').addEventListener('click', addTask);
        renderTasks();
    }

    function showScheduledTasks() {
        resetStyles();
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        const heading = document.createElement('h2');
        heading.textContent = "Scheduled Tasks";
        mainContent.appendChild(heading);
        const taskList = document.createElement('ul');
        taskList.classList.add('task-list');
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task');
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <span style="font-size: 0.8rem; color: #777;">${task.date}</span>
                <input type="checkbox" class="task-complete">
            `;
            taskList.appendChild(taskItem);
        });
        mainContent.appendChild(taskList);
    }

    function showSettings() {
        resetStyles();
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        const heading = document.createElement('h2');
        heading.textContent = "Settings";
        mainContent.appendChild(heading);

        const settingsList = document.createElement('ul');
        settingsList.classList.add('settings-list');
        settingsList.innerHTML = `
            <li>Edit Profile <i class="fa-solid fa-user"></i></li>
            <li>Change Password <i class="fa-solid fa-lock"></i></li>
            <li>Privacy <i class="fa-solid fa-shield-alt"></i></li>
            <li>Notifications <i class="fa-solid fa-bell"></i></li>
            <li>Language and Country <i class="fa-solid fa-globe"></i></li>
        `;
        mainContent.appendChild(settingsList);
    }

    function addTask() {
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value.trim();
        if (!taskText) {
            alert('Please enter a task!');
            return;
        }
        if (!taskDate) {
            alert('Please select a date and time!');
            return;
        }
        const newTask = { text: taskText, date: taskDate };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks();
        if (document.querySelector('.main-content h2')?.textContent === 'Scheduled Tasks') {
            showScheduledTasks();
        }
        taskInput.value = '';
        dateInput.value = '';
    }

    function renderTasks() {
        const todayTaskList = document.getElementById('taskList');
        todayTaskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task');
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <span style="font-size: 0.8rem; color: #777;">${task.date}</span>
                <input type="checkbox" class="task-complete">
                <i class="fa-solid fa-trash delete-task" data-index="${index}" style="cursor: pointer; color: red;"></i>
            `;
            todayTaskList.appendChild(taskItem);
        });

        const deleteButtons = document.querySelectorAll('.delete-task');
        deleteButtons.forEach(button => {
            button.addEventListener('click', deleteTask);
        });
    }

    function deleteTask(event) {
        const taskIndex = event.target.getAttribute('data-index');
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    showTodayTasks();
});
