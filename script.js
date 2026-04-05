// Initialize todos from local storage
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Add a new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.push(todo);
    saveTodos();
    input.value = '';
    renderTodos();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Edit a todo
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('Edit task:', todo.text);
        if (newText && newText.trim() !== '') {
            todo.text = newText.trim();
            saveTodos();
            renderTodos();
        }
    }
}

// Clear all completed todos
function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTodos();
}

// Render todos to the DOM
function renderTodos() {
    const todoList = document.getElementById('todoList');
    let filtered = todos;

    if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    } else if (currentFilter === 'active') {
        filtered = todos.filter(t => !t.completed);
    }

    if (filtered.length === 0) {
        todoList.innerHTML = '<div class="empty-state"><p>No tasks yet. Add one to get started! 🚀</p></div>';
    } else {
        todoList.innerHTML = filtered.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="btn-edit" onclick="editTodo(${todo.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteTodo(${todo.id})">🗑️</button>
                </div>
            </li>
        `).join('');
    }

    updateStats();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    
    document.getElementById('totalTodos').textContent = `Total: ${total}`;
    document.getElementById('completedTodos').textContent = `Completed: ${completed}`;
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to add todo
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Initial render
document.addEventListener('DOMContentLoaded', function() {
    renderTodos();
});