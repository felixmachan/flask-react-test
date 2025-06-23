from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, decode_token, jwt_required, get_jwt_identity, verify_jwt_in_request, get_jwt 
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from flask import render_template

from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.exc import NoResultFound

import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, time
import requests

import jwt

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr
from email.message import EmailMessage

from itsdangerous import URLSafeTimedSerializer






load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../frontend/', '.env'))


app = Flask(__name__)
CORS(app, supports_credentials=True)

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

FRONTEND_URL = "http://localhost:5173/"



# user db
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50))
    lname = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    password = db.Column(db.String(300))
    is_active = db.Column(db.Boolean, default=False)
    is_google_user = db.Column(db.Boolean, default=False)
    
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
    status = db.Column(db.String(20), default="active")  # active / cancelled / completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='bookings')

class WorkingHours(db.Model):
    __tablename__ = 'working_hours'
    id = db.Column(db.Integer, primary_key=True)
    weekday = db.Column(db.Integer, nullable=False)  # 0 = hétfő, ..., 6 = vasárnap
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

class UnavailableSlot(db.Model):
    __tablename__ = 'unavailable_slots'
    id = db.Column(db.Integer, primary_key=True)
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.String(200))

class SpecialDay(db.Model):
    __tablename__ = 'special_days'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, unique=True)
    start_time = db.Column(db.Time, nullable=True)  # null = zárva
    end_time = db.Column(db.Time, nullable=True)



with app.app_context():
    db.create_all()


def generate_confirmation_token(user_id):
    access_token = create_access_token(identity=user_id, expires_delta=timedelta(hours=1))
    return access_token


def send_confirmation_email(user_email, user_name, token):
    confirm_url = f"http://localhost:5173/confirm/{token}"
    
    # Render HTML body Flask sablonból
    html = render_template("confirmation_email.html", name=user_name, confirmation_link=confirm_url)

    # Email objektum létrehozása
    msg = EmailMessage()
    msg["Subject"] = "✅ Talppont fiók aktiválás"
    msg["From"] = os.getenv("MAIL_USERNAME")
    msg["To"] = user_email

    # HTML tartalom beállítása (ez automatikusan UTF-8 kódolású lesz)
    msg.set_content("Ez az email HTML-t tartalmaz. Kérlek, használj HTML-kompatibilis email klienst.")
    msg.add_alternative(html, subtype="html")

    # SMTP beállítások
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv("MAIL_USERNAME")
    sender_password = os.getenv("MAIL_PASSWORD")

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"Sikeresen elküldve: {user_email}")
        return True
    except Exception as e:
        print(f"Email küldési hiba (EmailMessage): {e}")
        return False
    """ try:
        mail.send(msg)
    except Exception as e:
        print(f"Email küldési hiba: {e}")
    return jsonify({'error': 'Nem sikerült elküldeni az aktiváló emailt'}), 500"""

def get_user_by_id(user_id):
    return User.query.get(user_id) 






@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Nincs ilyen felhasználó"}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Hibás jelszó"}), 401

    if not user.is_active:
        return jsonify({"error": "A fiók még nincs aktiválva. Kérlek ellenőrizd az emailedet."}), 403

    jwt_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': 'Sikeres bejelentkezés',
        'user': {
            'id': user.id,
            'fname': user.fname,
            'lname': user.lname,
            'email': user.email,
        },
        'token': jwt_token
    }), 200




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
        fname=first_name,
        lname=last_name,
        password=hashed_password,
        date_of_birth=date_of_birth,
        gender=gender,
        is_active=False,
        is_google_user=False  # Ez a mező jelzi, hogy nem Google-felhasználó 
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

    token = generate_confirmation_token(str(new_user.id))
    send_confirmation_email(new_user.email, f"{new_user.fname} {new_user.lname}", token)



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
    parts = name.split(" ", 1)  # Elválasztjuk az első és utolsó nevet
    fname = parts[0]
    if len(parts) > 1:
        lname = parts[1] 
    else:
        lname = ""


    if not email:
        return jsonify({'error': 'A Google nem adott vissza e-mail címet'}), 400

    # Ellenőrizzük, hogy létezik-e már ez az e-mail
    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({'message': 'Már létezik ilyen e-mail-lel regisztrált felhasználó', 'user_id': user.id}), 200

    # Új felhasználó létrehozása jelszó nélkül
    new_user = User(
        email=email,
        fname=fname,
        lname=lname,
        password=None,
        date_of_birth=None,
        gender=None,
        is_active=True,
        is_google_user=True  # Ez a mező jelzi, hogy nem Google-felhasználó 
    )

    db.session.add(new_user)
    db.session.commit()

    jwt_token = create_access_token(identity=str(new_user.id))

    return jsonify({
    'message': 'Sikeres bejelentkezés Google-fiókkal',
    'user': {
        'id': new_user.id,
        'name': f"{new_user.fname} {new_user.lname}",
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
        'fname': user.fname,
        'lname': user.lname,
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
            "fname": user.fname,
            "lname": user.lname,
            "gender": user.gender,
            "date_of_birth": user.date_of_birth.strftime("%Y-%m-%d") if user.date_of_birth else None,
            "complaints": [complaint.description for complaint in user.complaints],
        })
    return jsonify({"error": "User not found"}), 404



################################################################################



@app.route('/api/confirm/<token>', methods=['GET'])
def confirm_email(token):
    try:
        todecode = str(token)
        decoded = decode_token(todecode)
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

@app.route('/api/change-data', methods=['PUT'])
@jwt_required()
def change_data():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Felhasználó nem található"}), 404

    data = request.get_json()

    # Alap adatok frissítése
    user.fname = data.get('fname', user.fname)
    user.lname = data.get('lname', user.lname)

    dob_str = data.get('date_of_birth')
    if dob_str:
        try:
            user.date_of_birth = datetime.strptime(dob_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Hibás születési dátum formátum"}), 400

    # Jelszó frissítés, ha megadták és nem üres
    new_password = data.get('password', '')
    if new_password:
        user.password = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=8)

    # Panaszok kezelése (complaints)
    new_complaints = data.get('complaints', [])
    if isinstance(new_complaints, list):
        # Kitöröljük a régi kapcsolatokat
        user.complaints.clear()

        # Új panaszokat beszúrjuk / létrehozzuk, majd hozzárendeljük
        for complaint_desc in new_complaints:
            complaint = Complaint.query.filter_by(description=complaint_desc).first()
            if not complaint:
                complaint = Complaint(description=complaint_desc)
                db.session.add(complaint)
                db.session.flush()  # hogy legyen id-je
            user.complaints.append(complaint)
    else:
        return jsonify({"error": "Panaszok formátuma hibás"}), 400

    try:
        db.session.commit()
        return jsonify({"message": "Adatok sikeresen frissítve"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Mentési hiba", "details": str(e)}), 500


#################################################################################




SECRET_KEY = os.getenv("JWT_SECRET_KEY")
serializer = URLSafeTimedSerializer(SECRET_KEY)

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Hiányzik az email cím'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        # Biztonsági okból ne áruljuk el, hogy nem létezik az email, csak küldjünk visszajelzést
        return jsonify({'message': 'Ha létezik ilyen email, küldtünk egy visszaállító linket.'}), 200
    
    token = serializer.dumps(email, salt='password-reset-salt')
    reset_url = f"http://localhost:5173/reset-password/{token}"
    
    # Itt küldj emailt (használhatod a send_confirmation_email-t módosítva)
    html = render_template("reset_password_email.html", reset_url=reset_url, name=user.fname)
    
    msg = EmailMessage()
    msg["Subject"] = "TalpPont Jelszó visszaállítás"
    msg["From"] = os.getenv("MAIL_USERNAME")
    msg["To"] = email
    msg.set_content("Kérlek, használd a jelszó visszaállító linket.")
    msg.add_alternative(html, subtype="html")
    
    try:
        with smtplib.SMTP(app.config['MAIL_SERVER'], app.config['MAIL_PORT']) as server:
            server.ehlo()
            server.starttls()
            server.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))
            server.send_message(msg)
    except Exception as e:
        print(f"Email küldési hiba: {e}")
        return jsonify({"error": "Nem sikerült elküldeni az emailt."}), 500
    
    return jsonify({'message': 'Ha létezik ilyen email, küldtünk egy visszaállító linket.'}), 200



#############################################################################



@app.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if not new_password or not confirm_password:
        return jsonify({'error': 'Mindkét jelszó mező kitöltése kötelező.'}), 400
    if new_password != confirm_password:
        return jsonify({'error': 'A jelszavak nem egyeznek.'}), 400
    
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600)  # 1 óra érvényesség
    except Exception as e:
        return jsonify({'error': 'Érvénytelen vagy lejárt token.'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Felhasználó nem található.'}), 404
    
    user.password = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=8)
    db.session.commit()
    
    return jsonify({'message': 'A jelszó sikeresen megváltozott.'}), 200



######################################################################################





@app.route("/api/available-slots", methods=["GET"])
def get_available_slots():
    date_str = request.args.get("date")  # várjuk pl. 2025-07-12
    if not date_str:
        return jsonify({"error": "date paraméter hiányzik"}), 400

    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Hibás dátumformátum"}), 400

    weekday = date.weekday()  # 0 = hétfő

    # SpecialDay felülírja?
    special_day = SpecialDay.query.filter_by(date=date).first()
    if special_day:
        if not special_day.start_time or not special_day.end_time:
            return jsonify([])  # teljes nap zárva
        start_time = special_day.start_time
        end_time = special_day.end_time
    else:
        wh = WorkingHours.query.filter_by(weekday=weekday).first()
        if not wh:
            return jsonify([])  # nincs munkaidő aznap
        start_time = wh.start_time
        end_time = wh.end_time

    # Időpontgenerálás
    slot_length = 60  # percben
    slots = []
    current = datetime.combine(date, start_time)
    end = datetime.combine(date, end_time)

    # már foglalt időpontok
    existing_bookings = {b.booking_datetime for b in Booking.query.filter(
        Booking.booking_datetime >= current,
        Booking.booking_datetime < end,
        Booking.status == "active"
    ).all()}

    # tiltott időszakok
    blocks = UnavailableSlot.query.filter(
        UnavailableSlot.start_datetime <= end,
        UnavailableSlot.end_datetime >= current
    ).all()

    def is_blocked(dt):
        return any(block.start_datetime <= dt < block.end_datetime for block in blocks)

    while current + timedelta(minutes=slot_length) <= end:
        if current not in existing_bookings and not is_blocked(current):
            slots.append(current.strftime("%H:%M"))
        current += timedelta(minutes=slot_length)


    """ for wh in WorkingHours.query.all():
        print(wh.weekday, wh.start_time, wh.end_time) """
    print(slots)
    return jsonify(slots)

###########################################

if __name__ == '__main__':
        app.run(host="0.0.0.0", port=5000, debug=True)
