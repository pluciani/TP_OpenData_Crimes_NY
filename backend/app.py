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
    limit = int(request.args.get("limit", 1000))
    borough = request.args.get("borough", None)

    query = {"Latitude": {"$exists": True}, "Longitude": {"$exists": True}}
    if borough:
        query["boro_nm"] = borough.upper()

    results = collection.find(query, {"_id": 0}).limit(limit)
    return jsonify(list(results))


@app.route("/crime-grid")
def crime_grid():
    pipeline = [
        {
            "$project": {
                "lat_bin": {"$round": [{"$toDouble": "$Latitude"}, 2]},
                "lon_bin": {"$round": [{"$toDouble": "$Longitude"}, 2]}
            }
        },
        {
            "$group": {
                "_id": {"lat": "$lat_bin", "lon": "$lon_bin"},
                "count": {"$sum": 1}
            }
        }
    ]
    results = list(collection.aggregate(pipeline))
    return jsonify(results)


@app.route("/crime-heat")
def crime_heat():
    crime_type = request.args.get("type")
    query = {
        "Latitude": {"$ne": ""},
        "Longitude": {"$ne": ""}
    }

    if crime_type:
        query["OFNS_DESC"] = crime_type

    cursor = collection.find(query, {
        "_id": 0,
        "Latitude": 1,
        "Longitude": 1
    })

    points = []
    for doc in cursor:
        try:
            lat = float(doc["Latitude"])
            lon = float(doc["Longitude"])
            points.append([lat, lon, 1])
        except:
            continue
    return jsonify(points)


@app.route("/crime-types")
def crime_types():
    types = collection.distinct("OFNS_DESC")
    return jsonify(sorted(filter(None, types)))

if __name__ == "__main__":
    app.run(debug=True, port=5000)

