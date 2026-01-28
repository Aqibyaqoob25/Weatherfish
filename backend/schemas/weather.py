from pydantic import BaseModel
from typing import List

class GenerateDocumentsRequest(BaseModel):
    cities: List[str] = []
    zipcodes: List[str] = []
    person: str = ""
    hobbies: List[str] = []
    language: str = "de"