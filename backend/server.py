from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, decode_token, jwt_required, get_jwt_identity, verify_jwt_in_request, get_jwt
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.exc import NoResultFound

import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import requests

import jwt 





load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../frontend/', '.env'))


app = Flask(__name__)
CORS(app)  
mail = Mail(app)



app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False  
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")  
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD") 

app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_TOKEN_LOCATION"] = ["cookies", "headers"]
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Change this in your code!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)



# user db
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    password = db.Column(db.String(300))
    is_active = db.Column(db.Boolean, default=False)
    
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


def generate_confirmation_token(user_id):
    access_token = create_access_token(identity=user_id, expires_delta=timedelta(hours=1))
    return access_token


def send_confirmation_email(user_email, token):
    confirm_url = f"http://localhost:3000/confirm/{token}"  # vagy frontend url
    msg = Message("Email megerősítés", recipients=[user_email])
    msg.body = f"Kérlek kattints ide a fiók megerősítéséhez: {confirm_url}"
    mail.send(msg)

def get_user_by_id(user_id):
    return User.query.get(user_id)






@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)  
    email = data.get('email')
    password = data.get('password')

    return jsonify({"pass": password, "email": email})



################################################################################



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
        gender=gender,
        is_active=False 
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

    token = generate_confirmation_token(new_user.id)
    send_confirmation_email(new_user.email, token)


    return jsonify({'message': 'Registration successful', 'user_id': new_user.id}), 201



################################################################################



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
        gender=None,
        is_active=True  # Google-felhasználók automatikusan aktívak
    )

    db.session.add(new_user)
    db.session.commit()

    jwt_token = create_access_token(identity=new_user.id)

    return jsonify({
    'message': 'Sikeres bejelentkezés Google-fiókkal',
    'user': {
        'id': new_user.id,
        'name': new_user.name,
        'email': new_user.email,
    },
    'token': jwt_token,
    'redirect': '/profile'
    }), 201



################################################################################



@app.route('/api/login/google', methods=['POST'])
def login_google():
    data = request.get_json()
    access_token = data.get('access_token')

    if not access_token:
        return jsonify({'error': 'Hiányzik az access token'}), 400

    # Lekérdezzük a Google-felhasználói adatokat
    google_userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {'Authorization': f'Bearer {access_token}'}
    google_response = requests.get(google_userinfo_url, headers=headers)

    if google_response.status_code != 200:
        return jsonify({'error': 'Hibás vagy lejárt access token'}), 400

    google_data = google_response.json()
    email = google_data.get('email')

    if not email:
        return jsonify({'error': 'A Google nem adott vissza e-mail címet'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'Nincs ilyen Google-fiók regisztrálva'}), 404

    jwt_token = create_access_token(identity=str(user.id))

    return jsonify({
    'message': 'Sikeres bejelentkezés Google-fiókkal',
    'user': {
        'id': user.id,
        'name': user.name,
        'email': user.email,
    },
    'token': jwt_token,
    'redirect': '/profile'
}), 200



################################################################################



@app.route("/api/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    print("Jelenlegi felhasználó ID:", user_id)
    user = get_user_by_id(user_id)  
    if user:
        return jsonify({
            "id": user.id,
            "email": user.email,
            "name": user.name,
        })
    return jsonify({"error": "User not found"}), 404



################################################################################



@app.route('/api/confirm/<token>', methods=['GET'])
def confirm_email(token):
    try:
        decoded = decode_token(token)
        user_id = decoded['sub']
    except Exception as e:
        print("Token decode error:", e)
        return jsonify({"error": "Érvénytelen vagy lejárt token"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Felhasználó nem található"}), 404

    if user.is_active:
        return jsonify({"message": "Ez a fiók már aktiválva van."}), 200

    user.is_active = True
    db.session.commit()
    return jsonify({"message": "Sikeres fiókaktiválás!"}), 200



################################################################################



if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
