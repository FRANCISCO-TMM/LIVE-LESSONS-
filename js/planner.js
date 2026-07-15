// Academic Planner — add / complete / delete / filter tasks, persisted in localStorage
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'eo_planner_tasks';

  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const addBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const filterBtns = document.querySelectorAll('.filter-btn');

  const totalStat = document.getElementById('totalStat');
  const pendingStat = document.getElementById('pendingStat');
  const completedStat = document.getElementById('completedStat');

  let tasks = loadTasks();
  let currentFilter = 'all';

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.focus();
      taskInput.classList.add('invalid');
      setTimeout(() => taskInput.classList.remove('invalid'), 900);
      return;
    }
    tasks.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text,
      priority: prioritySelect.value,
      completed: false
    });
    taskInput.value = '';
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }

  function filteredTasks() {
    if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }

  function render() {
    const visible = filteredTasks();

    taskList.innerHTML = '';

    if (visible.length === 0) {
      emptyState.style.display = 'block';
      emptyState.querySelector('.empty-text').textContent =
        tasks.length === 0
          ? 'No tasks logged yet. Add one above to get started.'
          : 'Nothing matches this filter.';
    } else {
      emptyState.style.display = 'none';
      visible.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item hud-panel' + (task.completed ? ' completed' : '');
        item.innerHTML = `
          <button class="task-check" aria-label="Toggle complete" data-id="${task.id}">✓</button>
          <span class="task-text"></span>
          <span class="task-priority ${task.priority}">${task.priority}</span>
          <button class="task-delete" aria-label="Delete task" data-id="${task.id}">✕</button>
        `;
        // set text via textContent to avoid HTML injection from user input
        item.querySelector('.task-text').textContent = task.text;
        taskList.appendChild(item);
      });
    }

    totalStat.textContent = tasks.length;
    pendingStat.textContent = tasks.filter(t => !t.completed).length;
    completedStat.textContent = tasks.filter(t => t.completed).length;
  }

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  taskList.addEventListener('click', e => {
    const checkBtn = e.target.closest('.task-check');
    const delBtn = e.target.closest('.task-delete');
    if (checkBtn) toggleTask(checkBtn.dataset.id);
    if (delBtn) deleteTask(delBtn.dataset.id);
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  render();
});
