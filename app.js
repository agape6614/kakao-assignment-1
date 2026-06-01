// DOM 요소를 선택하여 상수에 할당합니다.
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');

// 할 일 데이터를 저장할 상태(State) 배열입니다.
// 형태: { id: 숫자, text: 문자열, isCompleted: 불리언 }
let todos = [];

// 데이터 구분을 위한 고유 ID 값입니다.
let todoIdCounter = 0;

/**
 * 새로운 할 일을 추가하는 함수
 */
function addTodo() {
    const text = todoInput.value.trim(); // 양쪽 공백을 제거합니다.

    // 1. 입력값이 비어있는지 검증(Validation)합니다.
    if (text === '') {
        showError(true);
        return;
    }

    // 검증을 통과했다면 에러 메시지를 숨깁니다.
    showError(false);

    // 2. 새로운 Todo 객체를 생성합니다.
    const newTodo = {
        id: todoIdCounter++,
        text: text,
        isCompleted: false
    };

    // 3. 상태 배열에 추가하고 UI를 렌더링합니다.
    todos.push(newTodo);
    todoInput.value = ''; // 입력창을 비워줍니다.
    
    renderTodos();
}

/**
 * 할 일을 삭제하는 함수
 * @param {number} id - 삭제할 Todo의 고유 ID
 */
function deleteTodo(id) {
    // 삭제할 ID와 일치하지 않는 항목만 필터링하여 배열을 갱신합니다.
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

/**
 * 할 일의 완료 상태를 토글하는 함수
 * @param {number} id - 완료 상태를 변경할 Todo의 고유 ID
 */
function toggleComplete(id) {
    // 배열을 순회하면서 해당 ID의 isCompleted 값을 반전시킵니다.
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
 * @param {number} id - 수정할 Todo의 고유 ID
 */
function editTodo(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (!todoToEdit) return;

    // 브라우저 기본 prompt를 사용해 수정할 내용을 입력받습니다.
    const newText = prompt('수정할 내용을 입력하세요:', todoToEdit.text);

    // 사용자가 취소를 누르지 않았고, 빈 문자가 아닐 때만 갱신합니다.
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
 * 에러 메시지 UI를 켜고 끄는 함수
 * @param {boolean} isShow - 표시 여부
 */
function showError(isShow) {
    if (isShow) {
        errorMessage.classList.remove('error-hidden');
    } else {
        errorMessage.classList.add('error-hidden');
    }
}

/**
 * todos 배열을 기반으로 화면에 HTML을 생성하여 그려주는 함수
 */
function renderTodos() {
    // 기존에 그려진 리스트를 초기화합니다.
    todoList.innerHTML = '';

    // 상태 배열을 순회하며 DOM 요소를 생성합니다.
    todos.forEach(todo => {
        // 1. li 요소 생성 및 클래스 할당
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        // 완료된 항목이면 completed 클래스를 추가하여 취소선 등 스타일 적용
        if (todo.isCompleted) {
            li.classList.add('completed');
        }

        // 2. 텍스트 영역
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        // 3. 버튼들을 묶어줄 컨테이너
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        // 3-1. 완료 버튼
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn-complete';
        completeBtn.textContent = todo.isCompleted ? '취소' : '완료';
        completeBtn.onclick = () => toggleComplete(todo.id);

        // 3-2. 수정 버튼
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '수정';
        editBtn.onclick = () => editTodo(todo.id);

        // 3-3. 삭제 버튼
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        // 4. 요소들을 조립합니다.
        buttonGroup.appendChild(completeBtn);
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(buttonGroup);

        // 5. 최종적으로 완성된 li를 화면(ul)에 추가합니다.
        todoList.appendChild(li);
    });
}

// 이벤트 리스너 등록
// 버튼 클릭 시 할 일 추가
addButton.addEventListener('click', addTodo);

// 텍스트 입력창에서 Enter 키를 눌렀을 때도 할 일이 추가되도록 설정
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});