from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from app.models.user import User
from app.models.post import Post      
from app.schemas.user import UserCreate, UserOut, UserLogin, BioUpdate, PasswordUpdate, EmailUpdate
from passlib.context import CryptContext
import random, string

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import traceback

# Endpoint para conectar el registro
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # logs para testeo
    print("🟢 Recibida solicitud de registro")

    # validación de existencia y creación de los dígitos para el código de amigo
    try:
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email ya registrado")

        hashed_password = pwd_context.hash(user.password)
        alfabeto = string.ascii_uppercase + string.digits
        while True:
            # método para generar el dígito random
            code = "#" + "".join(random.choices(alfabeto, k=6))
            if not db.query(User).filter(User.friend_code == code).first():
                break


        new_user = User(username=user.username, email=user.email, password_hash=hashed_password, friend_code=code)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print("✅ Usuario creado:", new_user)
        return new_user

    except Exception as e:
        print("🔥 ERROR DETECTADO:")
        traceback.print_exc()  # en caso de error, con esto imprimimos todo el proceso fallido
        raise HTTPException(status_code=500, detail="Error en el servidor")

# Endpoint para conectar con el login
@router.post("/login")
# validación con la contraseña hasheada
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not pwd_context.verify(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {"message": "Login exitoso", "user_id": user.id}

# Endpoint para visualizar el perfil de un usuario
@router.get("/perfil/{user_id}")
def obtener_perfil(user_id: int, db: Session = Depends(get_db)):
    print("✅ ENTRANDO A /perfil")

    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    publicaciones = db.query(Post).filter(Post.user_id == user_id).all()

    # este es el esquema de pydantic que se devuelve, también con una serie de diccionarios que sirven como publicaciones individuales, cada una con sus datos correspondientes
    return {
        "idUsuario":     usuario.id,
        "nombreUsuario": usuario.username,
        "avatarUrl":     "https://placehold.co/100x100/ff9800/333?text=Yo",
        "bio":           usuario.bio,
        "friend_code":   usuario.friend_code,
        "publicaciones": [
            {
                "id":         p.id,
                "urlImagen":  p.imagen_url,
                "titulo":     p.titulo,
                "valoracion": f"{p.valoracion}/10",
                "categoria":  p.categoria,
                "resena":     p.resena
            }
            for p in publicaciones
        ]
    }

# Endpoint para actualizar biografía
@router.put("/perfil/{user_id}/bio", response_model=UserOut)
def actualizar_bio(user_id: int, bio_data: BioUpdate, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # actualizamos y guardamos la nueva biografía
    usuario.bio = bio_data.bio
    db.commit()
    db.refresh(usuario)
    return usuario

# Endpoint para cambiar la contraseña del usuario
@router.put("/perfil/{user_id}/password")
def cambiar_contrasena(user_id: int, pwd_data: PasswordUpdate, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # Verificamos que la contraseña actual coincida
    if not pwd_context.verify(pwd_data.current_password, usuario.password_hash):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")
    # Hasheamos y guardamos la nueva
    usuario.password_hash = pwd_context.hash(pwd_data.new_password)
    db.commit()
    return {"message": "Contraseña actualizada correctamente"}

# Endpoint para cambiar el correo electrónico del usuario
@router.put("/perfil/{user_id}/email")
def cambiar_correo(user_id: int, data: EmailUpdate, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # verificamos que el nuevo email no esté ya registrado
    existe = db.query(User).filter(User.email == data.email).first()
    if existe and existe.id != user_id:
        raise HTTPException(status_code=400, detail="El correo ya está en uso")

    usuario.email = data.email
    db.commit()
    return {"message": "Correo electrónico actualizado correctamente"}