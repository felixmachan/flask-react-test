from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import Column, Integer, String, Date
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv


load_dotenv() 
POSTGRES_PW = os.getenv("PSQL_PW")

app = Flask(__name__)
CORS(app)  


app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://postgres:{POSTGRES_PW}@localhost:5432/talppont"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SQLAlchemy példány inicializálása
db = SQLAlchemy(app)

# Modell definíció
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    hashed_password = db.Column(db.String(300))

# Táblák létrehozása (egyszeri futás után eltávolíthatod vagy átrakhatod máshova)
with app.app_context():
    db.create_all()



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
    print(data)  
    email = data.get('email')
    password = data.get('password')

    return jsonify({"pass": password, "email": email})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    date_of_birth = data.get('date_of_birth')
    complaints = data.get('complaints')

    with app.app_context():
        user_emails = db.session.execute(db.select(User)["email"]).scalars().all()
        if email in user_emails:
            return jsonify({"error": "Email already exists"}), 400
        new_user = User(
            email=email,
            name=f"{first_name} {last_name}",
            password=password)

    return jsonify({"first_name": first_name, "last_name": last_name, "email": email, "password": password})

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
