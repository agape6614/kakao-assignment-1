from typing import List
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# ---------------------------------------------------------
# 1. 데이터베이스 설정
# ---------------------------------------------------------
DATABASE_URL = "sqlite:///./todos.db"

# SQLite는 기본적으로 단일 스레드 접근을 가정하므로, 다중 스레드 허용을 위해 check_same_thread=False 추가
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ---------------------------------------------------------
# 2. 데이터베이스 모델 (DB 테이블 구조 정의)
# ---------------------------------------------------------
class Todo(Base):
    __tablename__ = "todos"
    
    # 각 할 일의 고유 식별자 (Primary Key)
    id = Column(Integer, primary_key=True, index=True)
    # 할 일의 텍스트 내용
    content = Column(String, index=True)
    # 완료 여부 (기본값: 진행 중이므로 False)
    is_completed = Column(Boolean, default=False)
    # 할 일에 지정된 날짜 (YYYY-MM-DD 형식)
    date = Column(String, index=True)

# ---------------------------------------------------------
# 3. Pydantic 스키마 (데이터 검증 및 직렬화/역직렬화)
# ---------------------------------------------------------
class TodoCreate(BaseModel):
    """새로운 Todo를 생성할 때 클라이언트로부터 받을 데이터 구조"""
    content: str
    date: str

class TodoResponse(BaseModel):
    """클라이언트에게 응답으로 돌려줄 Todo 데이터 구조"""
    id: int
    content: str
    is_completed: bool
    date: str

    class Config:
        # SQLAlchemy 모델(ORM) 객체를 Pydantic 모델로 읽을 수 있게 허용
        from_attributes = True

# 데이터베이스 테이블 생성 (이미 존재하면 무시됨)
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------
# 4. FastAPI 앱 초기화 및 미들웨어 설정
# ---------------------------------------------------------
app = FastAPI(title="Minimal Todo API", description="#672be0 컬러 테마의 생산성 앱을 위한 API")

# CORS(Cross-Origin Resource Sharing) 설정
# React 프론트엔드(보통 localhost:5173 등)에서 백엔드 API에 접근할 수 있도록 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 5. 의존성 주입 (Dependency)
# ---------------------------------------------------------
def get_db():
    """
    API 요청이 올 때마다 새로운 데이터베이스 세션을 열고,
    요청 처리가 끝나면 안전하게 닫아주는 역할을 해.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------
# 6. API 엔드포인트 구현 (라우터)
# ---------------------------------------------------------

@app.get("/todos", response_model=List[TodoResponse], summary="전체 Todo 목록 조회")
def get_all_todos(db: Session = Depends(get_db)):
    """
    데이터베이스(todos 테이블)에 저장된 모든 할 일 목록을 가져와서 배열 형태로 반환해.
    """
    # Todo 모델의 모든 데이터를 데이터베이스에서 조회
    all_todos = db.query(Todo).all()
    return all_todos


@app.post("/todos", response_model=TodoResponse, summary="새로운 Todo 생성")
def create_todo(todo_data: TodoCreate, db: Session = Depends(get_db)):
    """
    클라이언트가 보낸 데이터를 바탕으로 새로운 할 일을 데이터베이스에 저장해.
    """
    # 1. Pydantic 모델로 받은 데이터를 SQLAlchemy ORM 모델로 변환해.
    # is_completed는 DB 모델에서 default=False로 설정했으므로 생략해도 자동으로 진행 중 상태로 저장돼!
    new_todo = Todo(
        content=todo_data.content,
        date=todo_data.date
    )
    
    # 2. 새로운 데이터를 세션에 추가해.
    db.add(new_todo)
    
    # 3. 변경사항을 데이터베이스에 영구적으로 저장(Commit)해.
    db.commit()
    
    # 4. 저장 후 데이터베이스에서 자동 생성된 고유 id 등의 최신 정보를 가져와서 객체를 업데이트해.
    db.refresh(new_todo)
    
    # 5. 방금 생성된 새로운 Todo 데이터를 클라이언트에게 반환해.
    return new_todo