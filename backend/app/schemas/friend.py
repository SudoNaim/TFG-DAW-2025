# app/schemas/friend.py
from pydantic import BaseModel

class FriendAdd(BaseModel):
    friend_code: str
