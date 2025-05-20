from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Engedélyezzük a CORS-t, hogy a frontend elérhesse az API-t

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

    if not email or not password:
        return jsonify({"message": "Hiányzó email vagy jelszó"}), 400

    user = fake_user_db.get(email)
    if user and user["password"] == password:
        # Itt lehet pl. JWT token generálás, session kezelése stb.
        return jsonify({"message": "Sikeres bejelentkezés", "user": user["name"]})

    return jsonify({"message": "Hibás email vagy jelszó"}), 401

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
