import { useState } from 'react';
import './App.css';

function App() {
  // 상태 관리: Todo 목록, 새 Todo 입력값, 에러 메시지
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 수정 관련 상태 관리
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // ⭐️ 탭 필터 상태 관리: 'all'(전체), 'active'(진행 중), 'completed'(완료)
  const [filter, setFilter] = useState('all');

  // Todo 추가 함수
  const handleAddTodo = (e) => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      setErrorMessage('할 일을 입력해주세요!');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      isCompleted: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
    setErrorMessage(''); 
  };

  // Todo 삭제 함수
  const handleDeleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  // Todo 완료 상태 토글 함수
  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
  };

  // 인라인 수정 모드 시작
  const handleStartEdit = (id, currentText) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  // 인라인 수정 내용 저장
  const handleSaveEdit = (id) => {
    if (editValue.trim() === '') {
      alert('수정할 내용을 입력하거나 취소를 눌러주세요.');
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: editValue } : todo
    );
    setTodos(updatedTodos);
    setEditingId(null); 
    setEditValue('');
  };

  // 인라인 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // ⭐️ 렌더링할 목록 계산: 현재 선택된 탭(filter) 상태에 따라 배열을 거릅니다.
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.isCompleted; // 진행 중인 항목만
    if (filter === 'completed') return todo.isCompleted; // 완료된 항목만
    return true; // 'all' 일 때는 조건 없이 모두 반환
  });

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

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* ⭐️ 필터링 탭 영역 */}
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            진행 중
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            완료
          </button>
        </div>

        {/* Todo 목록 렌더링 (원본 todos가 아닌 filteredTodos 배열을 순회) */}
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
              
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