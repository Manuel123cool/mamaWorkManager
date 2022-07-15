#!/usr/bin/python3

import sys
import time
from datetime import date
from datetime import datetime

nowTime = time.time()
today = date.today().strftime("%d-%m-%Y")
latestDateFile = open("/home/manuel/server_data/backup/date.txt", "r")
latestBackup = latestDateFile.read()

def newDateToFile():
    latestDateFile = open("/home/manuel/server_data/backup/date.txt", "w")
    latestDateFile.write(str(nowTime))

if len(sys.argv) > 1:
    newDateToFile()

if nowTime - 86400 < float(latestBackup): 
    sys.exit()    

currentStateFile = open("/home/manuel/server_data/data.txt", "r")
currentState = currentStateFile.read()

backupFile = open("/home/manuel/server_data/backup/" + 
    today + ".json", "w")

backupFile.write(currentState)
newDateToFile()
