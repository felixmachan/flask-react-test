from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app)

# Route for seeing a data
@app.route('/api/hello')
def get_time():

    # Returning an api for showing in  reactjs
    return jsonify(message="Hello from Flask!", time=x.strftime("%Y-%m-%d %H:%M:%S"))

    
# Running app
if __name__ == '__main__':
    app.run(debug=True)