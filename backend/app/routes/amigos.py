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

router = APIRouter(prefix="/amigos", tags=["amigos"])

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

@router.post("/{user_id}", status_code=201)
def añadir_amigo(user_id: int, payload: FriendAdd, db: Session = Depends(get_db)):
    # 1) Buscamos al usuario “dueño” del código
    amigo = db.query(User).filter(User.friend_code == payload.friend_code).first()
    if not amigo:
        raise HTTPException(404, "Código de amigo no válido")

    # 2) Comprobamos que no sea el mismo
    if amigo.id == user_id:
        raise HTTPException(400, "No te puedes añadir a ti mismo")

    # 3) insertamos la relación en ambas direcciones
    # — de user_id hacia amigo.id
    db.execute(
        amigos_table.insert().values(
            user_id=user_id,
            friend_id=amigo.id
        )
    )
    # — y de amigo.id hacia user_id
    db.execute(
        amigos_table.insert().values(
            user_id=amigo.id,
            friend_id=user_id
        )
    )
    db.commit()

    return {"message": f"{amigo.username} añadido a tu lista de amigos"}

@router.get("/{user_id}", response_model=List[FriendOut])
def obtener_amigos(user_id: int, db: Session = Depends(get_db)):
    # 1️⃣ Busca al usuario padre
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 2️⃣ A través de la relación muchos-a-muchos .friends
    amigos = usuario.friends  # requiere que en User tengas: friends = relationship(...)

    # 3️⃣ Serializa con el esquema
    resultado: List[FriendOut] = []
    for amigo in amigos:
        resultado.append(
            FriendOut(
                idUsuario    = amigo.id,
                nombreUsuario= amigo.username,
                codigoUnico  = amigo.friend_code,
                # Puedes generar un avatar placeholder a partir del nombre:
                avatarUrl    = f"https://placehold.co/50x50/888/FFF?text={amigo.username[:2].upper()}"
            )
        )
    return resultado

@router.delete("/{user_id}/{friend_id}")
def eliminar_amigo(
    user_id: int,
    friend_id: int,
    db: Session = Depends(get_db)
):
    # 1) Compruebo que ambos usuarios existen
    u1 = db.query(User).filter(User.id == user_id).first()
    u2 = db.query(User).filter(User.id == friend_id).first()
    if not u1 or not u2:
        raise HTTPException(404, "Usuario o amigo no encontrado")

    # 2) Borro ambas direcciones en la tabla de muchos a muchos
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
        # ninguna fila borrada → no eran amigos
        raise HTTPException(404, "No existía esa relación de amistad")

    return {"message": "Amistad eliminada correctamente"}