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

  // 날짜 선택기(Date Picker) 변경
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // 오늘 날짜로 즉시 이동
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
      date: selectedDate,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
    setErrorMessage(''); 
  };

  // Todo 삭제, 완료 토글, 수정 로직
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  const handleStartEdit = (id, currentText) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  const handleSaveEdit = (id) => {
    if (editValue.trim() === '') {
      alert('수정할 내용을 입력하거나 취소를 눌러주세요.');
      return;
    }
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text: editValue } : todo
    ));
    setEditingId(null); 
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // ⭐️ [왼쪽 메인 영역] 렌더링할 목록 (날짜 조건 -> 상태 조건)
  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== selectedDate) return false;
    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true; 
  });

  // ⭐️ [오른쪽 사이드바 영역] 진행 중인 다가오는 일정 필터링
  // 1. 완료 안됨 (!todo.isCompleted)
  // 2. 과거 제외, 오늘부터 미래 (todo.date >= todayString)
  const todayString = getFormattedDate(new Date());
  const upcomingTodos = todos
    .filter((todo) => !todo.isCompleted && todo.date >= todayString)
    .sort((a, b) => a.date.localeCompare(b.date)); // 날짜가 가까운 순서대로 오름차순 정렬

  return (
    <div className="app-wrapper">
      {/* 왼쪽 메인 화면 (기존 Daily View) */}
      <main className="main-content">
        <header className="header">
          <h1>Todo List</h1>
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
            <button className="today-btn" onClick={handleGoToToday}>오늘</button>
          </div>
        </header>

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

        <div className="filter-tabs">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>전체</button>
          <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>진행 중</button>
          <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>완료</button>
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <p className="empty-message">이 날짜에는 할 일이 없습니다.</p>
          ) : (
            filteredTodos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
                {editingId === todo.id ? (
                  <div className="edit-mode">
                    <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="edit-input" autoFocus />
                    <div className="action-buttons">
                      <button onClick={() => handleSaveEdit(todo.id)} className="save-btn">확인</button>
                      <button onClick={handleCancelEdit} className="cancel-btn">취소</button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="todo-text" onClick={() => handleToggleComplete(todo.id)}>{todo.text}</span>
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

      {/* ⭐️ 오른쪽 사이드바 (다가오는 일정) */}
      <aside className="sidebar-content">
        <h2>다가오는 일정</h2>
        <ul className="upcoming-list">
          {upcomingTodos.length === 0 ? (
            <p className="empty-message">예정된 진행 중 일정이 없습니다.</p>
          ) : (
            upcomingTodos.map((todo) => (
              <li key={todo.id} className="upcoming-item">
                <span className="upcoming-date">{todo.date}</span>
                <span className="upcoming-text">{todo.text}</span>
              </li>
            ))
          )}
        </ul>
      </aside>
    </div>
  );
}

export default App;