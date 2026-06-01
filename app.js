// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const filterButtons = document.querySelectorAll('.filter-btn');

// 날짜 네비게이션 요소 선택
const prevDateBtn = document.getElementById('prev-date');
const nextDateBtn = document.getElementById('next-date');
const currentDateDisplay = document.getElementById('current-date-display');

// 앱의 상태(State) 데이터
let todos = [];
let todoIdCounter = 0;
let currentFilter = 'all'; // 'all', 'active', 'completed'
let selectedDate = new Date(); // 현재 선택된 날짜 (기본값: 오늘)

// 로컬스토리지 접근을 위한 고유 키
const LOCAL_STORAGE_KEY = 'minimal_todo_data';

/**
 * 로컬스토리지에서 Todo 데이터를 불러오는 함수
 */
function loadTodos() {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedData) {
        // 문자열로 저장된 JSON 데이터를 자바스크립트 배열 객체로 변환합니다.
        todos = JSON.parse(savedData);
        
        // 데이터가 존재할 경우, 고유 ID가 겹치지 않도록 가장 큰 ID에 +1을 해줍니다.
        if (todos.length > 0) {
            todoIdCounter = Math.max(...todos.map(todo => todo.id)) + 1;
        }
    }
}

/**
 * 현재 Todo 데이터를 로컬스토리지에 저장하는 함수
 */
function saveTodos() {
    // 자바스크립트 배열 객체를 문자열로 변환하여 로컬스토리지에 저장합니다.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 헬퍼 함수
 */
function getFormattedDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
}

/**
 * 화면 상단에 선택된 날짜를 렌더링하는 함수
 */
function updateDateDisplay() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateDisplay.textContent = selectedDate.toLocaleDateString('ko-KR', options);
}

/**
 * 이전/다음 버튼을 눌렀을 때 날짜를 변경하는 함수
 */
function changeDate(offset) {
    selectedDate.setDate(selectedDate.getDate() + offset);
    updateDateDisplay();
    renderTodos(); 
}

/**
 * 새로운 할 일을 추가하는 함수
 */
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        showError(true);
        return;
    }
    showError(false);

    const newTodo = {
        id: todoIdCounter++,
        text: text,
        isCompleted: false,
        date: getFormattedDateString(selectedDate) 
    };

    todos.push(newTodo);
    todoInput.value = '';
    
    // 데이터가 변경되었으므로 로컬스토리지에 저장하고 렌더링합니다.
    saveTodos();
    renderTodos();
}

/**
 * 할 일을 삭제하는 함수
 */
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    // 데이터가 변경되었으므로 로컬스토리지에 저장하고 렌더링합니다.
    saveTodos();
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
    
    // 데이터가 변경되었으므로 로컬스토리지에 저장하고 렌더링합니다.
    saveTodos();
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
        
        // 데이터가 변경되었으므로 로컬스토리지에 저장하고 렌더링합니다.
        saveTodos();
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
 */
function setFilter(filterType) {
    currentFilter = filterType;
    
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTodos();
}

/**
 * 상태(날짜 및 상태 필터)를 바탕으로 화면을 그리는 함수
 */
function renderTodos() {
    todoList.innerHTML = '';
    
    const targetDateStr = getFormattedDateString(selectedDate);
    let dateFilteredTodos = todos.filter(todo => todo.date === targetDateStr);

    let finalTodos = [];
    if (currentFilter === 'all') {
        finalTodos = dateFilteredTodos;
    } else if (currentFilter === 'active') {
        finalTodos = dateFilteredTodos.filter(todo => !todo.isCompleted);
    } else if (currentFilter === 'completed') {
        finalTodos = dateFilteredTodos.filter(todo => todo.isCompleted);
    }

    finalTodos.forEach(todo => {
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

// --- 초기화(Init) 로직 --- //
loadTodos(); // 페이지 로드 시 로컬스토리지에서 기존 데이터를 불러옵니다.
updateDateDisplay();
renderTodos();

// --- 이벤트 리스너 등록 --- //
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const filterType = e.target.dataset.filter;
        setFilter(filterType);
    });
});

prevDateBtn.addEventListener('click', () => changeDate(-1));
nextDateBtn.addEventListener('click', () => changeDate(1));