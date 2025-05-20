from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

app = Flask(__name__)
CORS(app)  # Engedélyezzük a CORS-t, hogy a frontend elérhesse az API-t


DATABASE_URL = "postgresql+psycopg2://postgres:1948@localhost:5432/talppont"

engine = create_engine(DATABASE_URL, echo=False)  # echo=True: SQL lekérdezéseket is kiírja konzolra

Base = declarative_base()

# 2. Definiálj egy modellt
class TestTable(Base):
    __tablename__ = 'test_table'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    description = Column(String(200))

# 3. Táblák létrehozása az adatbázisban (ha még nem léteznek)
Base.metadata.create_all(engine)

# 4. Session létrehozása (kapcsolat az adatbázishoz)
Session = sessionmaker(bind=engine)
session = Session()

# 5. Új rekord hozzáadása
# new_row = TestTable(name="Teszt", description="Ez egy próba sor.")
# session.add(new_row)
# session.commit()

# 6. Lekérdezés
all_rows = session.query(TestTable).all()
for row in all_rows:
    print(f"ID: {row.id}, Name: {row.name}, Description: {row.description}")




# Egyszerű példa felhasználóval
fake_user_db = {
    "test@example.com": {
        "password": "titkos123",  # persze valós alkalmazásban jelszó hash kell!
        "name": "Teszt Felhasználó"
    }
}

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)  # Debugging: kiírja a bejövő adatokat
    email = data.get('email')
    password = data.get('password')

    return jsonify({"pass": password, "email": email})

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
