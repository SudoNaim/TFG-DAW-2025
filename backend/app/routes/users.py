from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserLogin
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import traceback

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    print("🟢 Recibida solicitud de registro")

    try:
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email ya registrado")

        hashed_password = pwd_context.hash(user.password)
        new_user = User(username=user.username, email=user.email, password=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print("✅ Usuario creado:", new_user)
        return new_user

    except Exception as e:
        print("🔥 ERROR DETECTADO:")
        traceback.print_exc()  # ⬅️ Esto imprime TODO el error a la consola con línea exacta
        raise HTTPException(status_code=500, detail="Error en el servidor")

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not pwd_context.verify(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {"message": "Login exitoso", "user_id": user.id}
