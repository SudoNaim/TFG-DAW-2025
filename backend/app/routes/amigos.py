# app/routes/amigos.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import get_db
from sqlalchemy import delete, and_
from app.models.user import User
from app.models.post import Post
from app.schemas.post import PostOut
from app.schemas.friend import FriendAdd 
from app.models.friendship import amigos_table 
from app.schemas.friend import FriendOut
from typing import List

# Ruta estándar para la creación de endpoints referidos a las amistades entre usuarios
router = APIRouter(prefix="/amigos", tags=["amigos"])

# Endpoint que recibe el perfil de amigo por ID a través de Path
@router.get("/perfil/{amigo_id}", response_model=dict)
def obtener_perfil_amigo(amigo_id: int, db: Session = Depends(get_db)):
    amigo = db.query(User).filter(User.id == amigo_id).first()
    if not amigo:
        raise HTTPException(status_code=404, detail="Amigo no encontrado")

    publicaciones = db.query(Post).filter(Post.user_id == amigo.id).all()
    return {
        "nombre": amigo.username,
        "avatarUrl": f"https://placehold.co/100x100/FFC107/000000?text={amigo.username[:2].upper()}",
        "publicaciones": [PostOut.from_orm(p) for p in publicaciones]
    }

# Endpoint para realizar la conexión al añadir un amigo a tu lista de amigos
@router.post("/{user_id}", status_code=201)
def añadir_amigo(user_id: int, payload: FriendAdd, db: Session = Depends(get_db)):
    # a través del código creado aleatoriamente con el registro de un usuario, buscamos y conectamos a los usuarios
    amigo = db.query(User).filter(User.friend_code == payload.friend_code).first()
    if not amigo:
        raise HTTPException(404, "Código de amigo no válido")
    if amigo.id == user_id:
        raise HTTPException(400, "No te puedes añadir a ti mismo")

    # se insertan los datos en ambas direcciones, tanto de user_id hacia amigo_id, y viceversa
    db.execute(
        amigos_table.insert().values(
            user_id=user_id,
            friend_id=amigo.id
        )
    )
    db.execute(
        amigos_table.insert().values(
            user_id=amigo.id,
            friend_id=user_id
        )
    )
    db.commit()

    return {"message": f"{amigo.username} añadido a tu lista de amigos"}

# Endpoint para recibir la lista de todos tus amigos, usa una estructura parecida al endpoint anterior
@router.get("/{user_id}", response_model=List[FriendOut])
def obtener_amigos(user_id: int, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    amigos = usuario.friends  # aquí es donde se especifica que la tabla de usuarios necesita la relación con friendships

    # devolvemos las entradas a través del esquema de Pydantic
    resultado: List[FriendOut] = []
    for amigo in amigos:
        resultado.append(
            FriendOut(
                idUsuario    = amigo.id,
                nombreUsuario= amigo.username,
                codigoUnico  = amigo.friend_code,
                avatarUrl    = f"https://placehold.co/50x50/888/FFF?text={amigo.username[:2].upper()}"
            )
        )
    return resultado

# Endpoint requerido para la eliminación de amigos
@router.delete("/{user_id}/{friend_id}")
def eliminar_amigo(
    user_id: int,
    friend_id: int,
    db: Session = Depends(get_db)
):
    # se comienza probando que ambos usuarios existen y que realmente están asociados como amigos
    u1 = db.query(User).filter(User.id == user_id).first()
    u2 = db.query(User).filter(User.id == friend_id).first()
    if not u1 or not u2:
        raise HTTPException(404, "Usuario o amigo no encontrado")

    # aquí realizamos una secuencia delete en ambas tablas para la correcta eliminación de la relación
    stmt1 = delete(amigos_table).where(
        and_(amigos_table.c.user_id == user_id,
             amigos_table.c.friend_id == friend_id)
    )
    stmt2 = delete(amigos_table).where(
        and_(amigos_table.c.user_id == friend_id,
             amigos_table.c.friend_id == user_id)
    )
    res1 = db.execute(stmt1)
    res2 = db.execute(stmt2)
    db.commit()

    if res1.rowcount == 0 and res2.rowcount == 0:
        raise HTTPException(404, "No existía esa relación de amistad")

    return {"message": "Amistad eliminada correctamente"}