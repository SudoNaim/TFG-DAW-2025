from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import engine, Base, get_db
from app.models import user as user_model
from app.schemas import UserCreate, UserOut, UserLogin
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()

# ——— Configura CORS aquí ———
"""
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5500"],  # ajusta al puerto de tu frontend
  allow_methods=["*"],
  allow_headers=["*"]
)
"""

@app.post("/login", response_model=UserOut)
def login(data: UserLogin, db: Session = Depends(get_db)):
    # En primer lugar buscamos al usuario por email
    db_user = db.query(user_model.User).filter(user_model.User.email == data.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Email o contraseña inválidos")
    
    if data.password != db_user.password_hash:
        raise HTTPException(status_code=401, detail="Email o contraseña inválidos")
    
    return db_user

# Para revisar el SWAGGER: http://127.0.0.1:8000/docs