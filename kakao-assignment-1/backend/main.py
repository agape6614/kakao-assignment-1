import os
from dotenv import load_dotenv
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# ---------------------------------------------------------
# 0. 환경변수 불러오기
# ---------------------------------------------------------
load_dotenv()

# ---------------------------------------------------------
# 1. 데이터베이스 설정
# ---------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ---------------------------------------------------------
# 2. 데이터베이스 모델
# ---------------------------------------------------------
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, index=True)
    is_completed = Column(Boolean, default=False)
    date = Column(String, index=True)

# ---------------------------------------------------------
# 3. Pydantic 스키마
# ---------------------------------------------------------
class TodoCreate(BaseModel):
    content: str
    date: str

class TodoUpdate(BaseModel):
    content: str
    is_completed: bool
    date: str

class TodoResponse(BaseModel):
    id: int
    content: str
    is_completed: bool
    date: str

    class Config:
        from_attributes = True

Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------
# 4. FastAPI 앱 초기화 및 미들웨어
# ---------------------------------------------------------
app = FastAPI(title="Minimal Todo API", description="#672be0 컬러 테마의 생산성 앱 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 5. 의존성 주입
# ---------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------
# 6. API 엔드포인트 구현
# ---------------------------------------------------------
@app.get("/todos", response_model=List[TodoResponse], summary="전체 목록 조회")
def get_all_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()


@app.post("/todos", response_model=TodoResponse, summary="새로운 할 일 생성")
def create_todo(todo_data: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(content=todo_data.content, date=todo_data.date)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


@app.put("/todos/{todo_id}", response_model=TodoResponse, summary="할 일 수정")
def update_todo(todo_id: int, todo_data: TodoUpdate, db: Session = Depends(get_db)):
    existing_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not existing_todo:
        raise HTTPException(status_code=404, detail="해당 할 일을 찾을 수 없어!")
    
    existing_todo.content = todo_data.content
    existing_todo.is_completed = todo_data.is_completed
    existing_todo.date = todo_data.date
    
    db.commit()
    db.refresh(existing_todo)
    return existing_todo


@app.delete("/todos/{todo_id}", summary="할 일 삭제")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    existing_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not existing_todo:
        raise HTTPException(status_code=404, detail="해당 할 일을 찾을 수 없어!")
    
    db.delete(existing_todo)
    db.commit()
    return {"message": "성공적으로 삭제되었어!"}