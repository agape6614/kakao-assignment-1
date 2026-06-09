import { useState, useEffect } from 'react';
import './App.css';

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 헬퍼 함수
const getFormattedDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  // 로컬스토리지 연동 초기화
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return []; 
  });

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 인라인 수정 관련 상태
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 탭 필터 상태 관리 ('all', 'active', 'completed')
  const [filter, setFilter] = useState('all');

  // 날짜 상태 관리 (기본값: 오늘 날짜)
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));

  // todos 배열 변경 시 로컬스토리지 자동 저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 이전 날짜로 이동 함수
  const handlePrevDate = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(getFormattedDate(current));
  };

  // 다음 날짜로 이동 함수
  const handleNextDate = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(getFormattedDate(current));
  };

  // 날짜 선택기(Date Picker)에서 직접 날짜를 바꿨을 때의 함수
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // ⭐️ 오늘 날짜로 즉시 이동하는 함수
  const handleGoToToday = () => {
    setSelectedDate(getFormattedDate(new Date()));
  };

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
      date: selectedDate, // 현재 화면에 선택된 날짜 저장
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

  // 렌더링할 목록 계산 (이중 필터링: 1. 날짜 조건 -> 2. 상태 조건)
  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== selectedDate) return false;

    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true; 
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>Todo List</h1>
        
        {/* 네비게이션 UI: Date Picker와 오늘 버튼 추가 */}
        <div className="date-navigation">
          <button className="date-btn" onClick={handlePrevDate}>&lt;</button>
          <input 
            type="date" 
            className="date-picker-input" 
            value={selectedDate} 
            onChange={handleDateChange} 
            required 
          />
          <button className="date-btn" onClick={handleNextDate}>&gt;</button>
          {/* ⭐️ 오늘 버튼 UI */}
          <button className="today-btn" onClick={handleGoToToday}>오늘</button>
        </div>
      </header>

      <main>
        {/* Todo 입력 폼 */}
        <form className="input-section" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`${selectedDate}의 할 일을 입력하세요...`}
            className="todo-input"
          />
          <button type="submit" className="add-button">추가</button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* 필터링 탭 영역 */}
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

        {/* Todo 목록 렌더링 */}
        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <p className="empty-message">이 날짜에는 할 일이 없습니다.</p>
          ) : (
            filteredTodos.map((todo) => (
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
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;