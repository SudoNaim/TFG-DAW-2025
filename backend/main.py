from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import engine, Base, get_db

# Ya tienes estos:
from app.models import user as user_model
from app.models.post import Post
from app.models.user import User

from app.schemas import UserCreate, UserOut, UserLogin
from app.routes import users
from app.routes import posts
from app.routes import amigos
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500","http://localhost:5500","http://127.0.0.1:8000/register"],  # o ["http://127.0.0.1:5500"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)   

# Cargar rutas
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(amigos.router)

# Para revisar el SWAGGER: http://127.0.0.1:8000/docs