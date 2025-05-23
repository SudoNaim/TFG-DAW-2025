from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.config import engine, Base, get_db
from app.models import user
from app.schemas import UserCreate, UserOut

Base.metadata.create_all(bind=engine)

app = FastAPI()

print("hola mundo")