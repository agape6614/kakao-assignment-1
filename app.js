// DOM 요소를 선택하여 상수에 할당합니다.
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const filterButtons = document.querySelectorAll('.filter-btn');

// 앱의 상태(State) 데이터
let todos = [];
let todoIdCounter = 0;
let currentFilter = 'all'; // 현재 선택된 필터 상태 ('all', 'active', 'completed')

/**
 * 새로운 할 일을 추가하는 함수
 */
function addTodo() {
    const text = todoInput.value.trim();

    // 1. 유효성 검사
    if (text === '') {
        showError(true);
        return;
    }
    showError(false);

    // 2. 새로운 Todo 객체 생성
    const newTodo = {
        id: todoIdCounter++,
        text: text,
        isCompleted: false
    };

    // 3. 배열에 추가 및 UI 업데이트
    todos.push(newTodo);
    todoInput.value = '';
    renderTodos();
}

/**
 * 할 일을 삭제하는 함수
 */
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

/**
 * 할 일의 완료 상태를 토글하는 함수
 */
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    renderTodos();
}

/**
 * 할 일 내용을 수정하는 함수
 */
function editTodo(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (!todoToEdit) return;

    const newText = prompt('수정할 내용을 입력하세요:', todoToEdit.text);
    if (newText !== null && newText.trim() !== '') {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: newText.trim() };
            }
            return todo;
        });
        renderTodos();
    }
}

/**
 * 에러 메시지 토글 함수
 */
function showError(isShow) {
    if (isShow) {
        errorMessage.classList.remove('error-hidden');
    } else {
        errorMessage.classList.add('error-hidden');
    }
}

/**
 * 필터 상태를 변경하고 탭 스타일을 업데이트하는 함수
 * @param {string} filterType - 변경할 필터 종류 ('all', 'active', 'completed')
 */
function setFilter(filterType) {
    currentFilter = filterType;
    
    // 버튼들의 클래스를 순회하며 현재 선택된 탭만 'active' 클래스 부여
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 필터 조건이 변경되었으므로 리스트를 다시 그립니다.
    renderTodos();
}

/**
 * 상태(todos, currentFilter)를 바탕으로 화면을 그리는 함수
 */
function renderTodos() {
    todoList.innerHTML = '';

    // 현재 필터 상태에 따라 보여줄 목록 필터링
    let filteredTodos = [];
    if (currentFilter === 'all') {
        filteredTodos = todos; // 전체 보기
    } else if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.isCompleted); // 진행 중(미완료) 보기
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.isCompleted); // 완료된 항목 보기
    }

    // 필터링된 배열(filteredTodos)을 순회하며 DOM 요소 생성
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        if (todo.isCompleted) {
            li.classList.add('completed');
        }

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn-complete';
        completeBtn.textContent = todo.isCompleted ? '취소' : '완료';
        completeBtn.onclick = () => toggleComplete(todo.id);

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '수정';
        editBtn.onclick = () => editTodo(todo.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        buttonGroup.appendChild(completeBtn);
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(buttonGroup);

        todoList.appendChild(li);
    });
}

// 할 일 추가 이벤트 리스너 등록
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// 탭 버튼 클릭 이벤트 리스너 등록
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // html 요소의 data-filter 속성값을 가져옵니다.
        const filterType = e.target.dataset.filter;
        setFilter(filterType);
    });
});