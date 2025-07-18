from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(mongo_uri)
db = client["nypd"]
collection = db["crimes"]

@app.route("/crimes", methods=["GET"])
def get_crimes():
    limit = int(request.args.get("limit", 500))
    borough = request.args.get("borough", None)

    query = {"latitude": {"$exists": True}, "longitude": {"$exists": True}}
    if borough:
        query["boro_nm"] = borough.upper()

    results = collection.find(query, {"_id": 0}).limit(limit)
    return jsonify(list(results))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
