import { useState } from 'react';
import './App.css';

function App() {
  // 상태 관리: Todo 목록, 새 Todo 입력값, 에러 메시지
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 수정 관련 상태 관리: 현재 수정 중인 Todo의 ID, 수정할 텍스트 입력값
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 1. Todo 추가 함수 (Create)
  const handleAddTodo = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 빈 값 유효성 검사
    if (inputValue.trim() === '') {
      setErrorMessage('할 일을 입력해주세요!');
      return;
    }

    // 새로운 Todo 객체 생성
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      isCompleted: false, // 기본값은 미완료 상태
    };

    // 기존 목록에 새 Todo를 추가하고 입력창/에러 메시지 초기화
    setTodos([...todos, newTodo]);
    setInputValue('');
    setErrorMessage(''); 
  };

  // 2. Todo 삭제 함수 (Delete)
  const handleDeleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  // 3. Todo 완료 상태 토글 함수 (Update - Complete)
  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
  };

  // 4. 인라인 수정 모드 시작 (Update - Edit Start)
  const handleStartEdit = (id, currentText) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  // 5. 인라인 수정 내용 저장 (Update - Edit Save)
  const handleSaveEdit = (id) => {
    // 수정 내용이 비어있는지 검사
    if (editValue.trim() === '') {
      alert('수정할 내용을 입력하거나 취소를 눌러주세요.');
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: editValue } : todo
    );
    setTodos(updatedTodos);
    
    // 수정 모드 종료 및 초기화
    setEditingId(null); 
    setEditValue('');
  };

  // 6. 인라인 수정 취소 (Update - Edit Cancel)
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Todo List</h1>
      </header>

      <main>
        {/* Todo 입력 폼 */}
        <form className="input-section" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            className="todo-input"
          />
          <button type="submit" className="add-button">추가</button>
        </form>

        {/* 조건부 렌더링: 에러 메시지가 있을 때만 표시 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Todo 목록 렌더링 */}
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
              
              {/* 현재 항목이 수정 모드인지 확인하여 UI를 다르게 렌더링 */}
              {editingId === todo.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                  <div className="action-buttons">
                    <button onClick={() => handleSaveEdit(todo.id)} className="save-btn">확인</button>
                    <button onClick={handleCancelEdit} className="cancel-btn">취소</button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <span
                    className="todo-text"
                    onClick={() => handleToggleComplete(todo.id)}
                  >
                    {todo.text}
                  </span>
                  <div className="action-buttons">
                    <button onClick={() => handleStartEdit(todo.id, todo.text)} className="edit-btn">수정</button>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">삭제</button>
                  </div>
                </div>
              )}

            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;