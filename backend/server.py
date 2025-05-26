from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import Column, Integer, String, Date
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import requests



load_dotenv() 
POSTGRES_PW = os.getenv("PSQL_PW")

app = Flask(__name__)
CORS(app)  


app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://postgres:1948@localhost:5432/talppont"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SQLAlchemy példány inicializálása
db = SQLAlchemy(app)

# user db
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    password = db.Column(db.String(300))
    
    bookings = db.relationship('Booking', back_populates='user', cascade="all, delete-orphan")
    complaints = db.relationship('Complaint', secondary='user_complaints', back_populates='users')


# complaint db
class Complaint(db.Model):
    __tablename__ = 'complaints'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False, unique=True)

    users = db.relationship('User', secondary='user_complaints', back_populates='complaints')

# user_complaints association table
class UserComplaint(db.Model):
    __tablename__ = 'user_complaints'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaints.id'), primary_key=True)

# bookings
class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    booking_datetime = db.Column(db.DateTime, nullable=False)

    user = db.relationship('User', back_populates='bookings')



with app.app_context():
    db.create_all()


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
    print("Regisztrációs kérés adatai:", data)
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    date_of_birth = datetime.strptime(data["date_of_birth"], "%Y-%m-%d").date()
    gender = data.get('gender')
    complaints = data.get('complaints', [])

    # Ellenőrzés, hogy az email már foglalt-e
    user_emails = db.session.execute(db.select(User.email)).scalars().all()
    if email in user_emails:
        return jsonify({"error": "Már regisztráltak ezzel az e-mail címmel felhasználói fiókot!"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
    new_user = User(
        email=email,
        name=f"{first_name} {last_name}",
        password=hashed_password,
        date_of_birth=date_of_birth,
        gender=gender
    )
    db.session.add(new_user)
    db.session.flush()  # flush-oljuk, hogy megkapjuk az új user id-jét

    # Panaszok kezelése:
    for complaint_text in complaints:
        complaint = Complaint.query.filter_by(description=complaint_text).first()
        if not complaint:
            complaint = Complaint(description=complaint_text)
            db.session.add(complaint)
            db.session.flush()  # itt is flush, hogy meglegyen az id
        # Kapcsolat user és panasz között
        user_complaint = UserComplaint(user_id=new_user.id, complaint_id=complaint.id)
        db.session.add(user_complaint)

    db.session.commit()  # egyszer commitoljuk az egész tranzakciót

    return jsonify({'message': 'Registration successful', 'user_id': new_user.id}), 201

import requests  # szükséges a Google API híváshoz

@app.route('/api/register/google', methods=['POST'])
def register_google():
    data = request.get_json()
    access_token = data.get('access_token')

    if not access_token:
        return jsonify({'error': 'Hiányzik az access token'}), 400

    # Lekérdezzük a Google-től a felhasználói adatokat
    google_userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {'Authorization': f'Bearer {access_token}'}
    google_response = requests.get(google_userinfo_url, headers=headers)

    if google_response.status_code != 200:
        return jsonify({'error': 'Hibás vagy lejárt access token'}), 400

    google_data = google_response.json()
    print("Google-felhasználó:", google_data)

    email = google_data.get('email')
    name = google_data.get('name')

    if not email:
        return jsonify({'error': 'A Google nem adott vissza e-mail címet'}), 400

    # Ellenőrizzük, hogy létezik-e már ez az e-mail
    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({'message': 'Már létezik ilyen e-mail-lel regisztrált felhasználó', 'user_id': user.id}), 200

    # Új felhasználó létrehozása jelszó nélkül
    new_user = User(
        email=email,
        name=name,
        password=None,
        date_of_birth=None,
        gender=None
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Google-felhasználó sikeresen regisztrálva', 'user_id': new_user.id}), 201





if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
