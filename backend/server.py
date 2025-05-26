from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import Column, Integer, String, Date
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import datetime


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
    hashed_password = db.Column(db.String(300))
    
    bookings = db.relationship('Booking', back_populates='user', cascade="all, delete-orphan")

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
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    date_of_birth = datetime.strptime(data["date_of_birth"], "%Y-%m-%d").date()
    gender = data.get('gender')
    complaints = data.get('complaints', [])


    with app.app_context():
        user_emails = db.session.execute(db.select(User)["email"]).scalars().all()
        if email in user_emails:
            return jsonify({"error": "Email already exists"}), 400
        hashed_password = generate_password_hash(password, method='sha256', salt_length=8)
        new_user = User(
            email=email,
            name=f"{first_name} {last_name}",
            password=hashed_password,
            date_of_birth=date_of_birth,
            gender=gender)
        db.session.add(new_user)
        db.session.commit()
        # Panaszok kezelése:
    for complaint_text in complaints:
        # Megnézzük, létezik-e már ilyen panasz (pl. azonos szöveg)
        complaint = Complaint.query.filter_by(text=complaint_text).first()
        if not complaint:
            # Ha nem létezik, létrehozzuk
            complaint = Complaint(text=complaint_text)
            db.session.add(complaint)
            db.session.commit()
    # Kapcsolat user és panasz között
        user_complaint = UserComplaint(user_id=new_user.id, complaint_id=complaint.id)
        db.session.add(user_complaint)
        db.session.commit()


        return jsonify({'message': 'Registration successful', 'user_id': new_user.id}), 201

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
