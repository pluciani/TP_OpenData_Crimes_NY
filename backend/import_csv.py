import csv
from pymongo import MongoClient
import os

client = MongoClient("mongodb://localhost:27017")
db = client["nypd"]
collection = db["crimes"]

collection.delete_many({})

BASE_DIR = os.path.dirname(__file__)
csv_path = os.path.join(BASE_DIR, "ressources", "NYPD_Complaint_Data_Current__Year_To_Date__20250718.csv")

with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    batch = []
    for row in reader:
        try:
            lat = float(row["Latitude"])
            lon = float(row["Longitude"])
            row["Latitude"] = lat
            row["Longitude"] = lon
            batch.append(row)
        except:
            continue

    if batch:
        collection.insert_many(batch)

print("Import terminé avec", len(batch), "enregistrements.")
