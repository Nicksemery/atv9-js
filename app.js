document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const dueDateInput = document.getElementById('due-date');
    const priorityInput = document.getElementById('priority');
    const taskList = document.getElementById('task-list');
    const filterStatusButton = document.getElementById('filter-status');
    const filterPriorityButton = document.getElementById('filter-priority');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let statusFilter = 'all'; 
    let priorityFilter = null; 

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';

        let filteredTasks = tasks.filter(task => {
            if (statusFilter !== 'all' && task.status !== statusFilter) return false;
            if (priorityFilter && task.priority !== priorityFilter) return false;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add(task.status);
            if (isUrgent(task.dueDate)) li.classList.add('urgent');

            li.innerHTML = `
                <span><strong>${task.name}</strong></span>
                <span>Devido em: ${task.dueDate}</span>
                <span>Prioridade: ${task.priority}</span>
                <button onclick="editTask(${task.id})">Editar</button>
                <button onclick="toggleStatus(${task.id})">${task.status === 'completed' ? 'Marcar como Pendente' : 'Marcar como Concluída'}</button>
                <button onclick="deleteTask(${task.id})">Excluir</button>
            `;
            taskList.appendChild(li);
        });
    }

    
    function isUrgent(dueDate) {
        const now = new Date();
        const taskDate = new Date(dueDate);
        const timeDiff = taskDate - now;
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysLeft <= 2; 
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = taskNameInput.value;
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        const newTask = {
            id: Date.now(),
            name: taskName,
            dueDate: dueDate,
            priority: priority,
            status: 'pending' 
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        taskForm.reset();
    });

    function toggleStatus(taskId) {
        const task = tasks.find(t => t.id === taskId);
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        saveTasks();
        renderTasks();
    }

    function editTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        taskNameInput.value = task.name;
        dueDateInput.value = task.dueDate;
        priorityInput.value = task.priority;

        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(t => t.id !== taskId); 
        saveTasks(); 
        renderTasks(); 
    }

    filterStatusButton.addEventListener('click', () => {
        if (statusFilter === 'all') {
            statusFilter = 'completed';
        } else if (statusFilter === 'completed') {
            statusFilter = 'pending';
        } else {
            statusFilter = 'all';
        }
        renderTasks();
    });

    filterPriorityButton.addEventListener('click', () => {
        const priorities = ['alta', 'media', 'baixa'];
        const currentIndex = priorities.indexOf(priorityFilter);
        priorityFilter = priorities[(currentIndex + 1) % priorities.length];
        renderTasks();
    });

    renderTasks();
});
