import os 
from dotenv import load_dotenv 
# Con dotenv sacamos las variables de entorno definidas en .env
from sqlalchemy import create_engine 
# Con create_engine creamos la conexión que necesita sqlalchemy con la base de datos
from sqlalchemy.orm import sessionmaker, declarative_base 
# Con sessionmaker se nos permite realizar queries y con declarative_base definimos clases que representan tablas de la base de datos

load_dotenv()
# Método para cargar todas las variables de entorno definidas en .env

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# Con el método getenv() cargamos los valores del .env en este archivo de configuración para posteriormente conectarse a la base de datos

engine = create_engine(DATABASE_URL)
# Con el engine creamos la conexión pasando la URL que hemos concatenado anteriormente

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Con SessionLocal creamos la sesión para poder realizar queries y métodos CRUD a la base de datos
# autocommit=false significa que hay que confirmar los cambios manualmente
# autoflush=false significa que no envía automáticamente cambios pendientes hasta que se haga un db.commit()
# bind=engine indica que la sesión se conecta con el engine que hemos creado anteriormente

Base = declarative_base()
# Base es la clase base que se usará para representar las tablas de la base de datos


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

