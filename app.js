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

/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 헬퍼 함수
 */
function getFormattedDateString(dateObj) {
    const year = dateObj.getFullYear();
    // month와 date는 1자리일 경우 앞에 '0'을 붙여 2자리로 맞춤
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
}

/**
 * 화면 상단에 선택된 날짜를 'YYYY년 M월 D일' 형식으로 렌더링하는 함수
 */
function updateDateDisplay() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateDisplay.textContent = selectedDate.toLocaleDateString('ko-KR', options);
}

/**
 * 이전/다음 버튼을 눌렀을 때 날짜를 변경하는 함수
 * @param {number} offset - 변경할 일수 (-1: 하루 전, 1: 하루 뒤)
 */
function changeDate(offset) {
    selectedDate.setDate(selectedDate.getDate() + offset);
    updateDateDisplay();
    renderTodos(); // 날짜가 바뀌었으므로 리스트를 새로 그림
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

    // 새로운 Todo 객체 생성 (현재 선택된 날짜 정보 포함)
    const newTodo = {
        id: todoIdCounter++,
        text: text,
        isCompleted: false,
        date: getFormattedDateString(selectedDate) // 할 일이 속한 날짜 데이터 저장
    };

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
    
    // 현재 선택된 날짜 문자열
    const targetDateStr = getFormattedDateString(selectedDate);

    // 1차 필터링: '선택된 날짜'에 해당하는 Todo만 추출
    let dateFilteredTodos = todos.filter(todo => todo.date === targetDateStr);

    // 2차 필터링: '전체 / 진행 중 / 완료' 상태 탭에 따라 추출
    let finalTodos = [];
    if (currentFilter === 'all') {
        finalTodos = dateFilteredTodos;
    } else if (currentFilter === 'active') {
        finalTodos = dateFilteredTodos.filter(todo => !todo.isCompleted);
    } else if (currentFilter === 'completed') {
        finalTodos = dateFilteredTodos.filter(todo => todo.isCompleted);
    }

    // 최종 필터링된 배열을 순회하며 DOM 요소 생성
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

// 초기화 함수 실행 (날짜 표시 및 리스트 렌더링)
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