#!/usr/bin/python3

from fpdf import FPDF
import json
import sys
from datetime import datetime
from datetime import date

#get data
f = open("/home/manuel/server_data/data.txt", "r")
data = json.load(f)

def field(index1, index2):
    for index, v in enumerate(data[index1]):
        if index == index2:
            return [v, data[index1][v]]

pdf_w = 210 - 7
pdf_h = 297 - 7

class PDF(FPDF):
    overallWidth = 7.0
    overallHeigth = 7.0
    fieldHeight = 7
    def getWidth(self, text1, text2):
        width1 = self.get_string_width(text1) 
        width2 = self.get_string_width(text2) 

        if width1 > width2:
            return width1 + 3
        else:
            return width2 + 3

    def holeWidth(self):
        if self.overallWidth != 7.0: 
            return

        rightUnder = 0
        while rightUnder + self.fieldHeight < 110:
            rightUnder += self.fieldHeight

        heigth = self.overallHeigth 
        width = self.overallWidth 
        fHeight = self.fieldHeight
        if heigth == rightUnder or heigth == rightUnder - fHeight:
            self.overallWidth += 7

        rightUnderB = 0
        while rightUnderB + self.fieldHeight < 200:
            rightUnderB += self.fieldHeight

        if heigth == rightUnderB - fHeight or \
                heigth == rightUnderB - fHeight * 2:
            self.overallWidth += 7

    def drawDate(self):
        today = date.today().strftime("%d-%m-%Y")
        self.set_xy(7, 7)
        self.set_font("NewFont", "", 12)
        self.cell(w=pdf_w - 7, h=self.fieldHeight, border=1, 
            align="C", txt=today)
        self.overallHeigth += self.fieldHeight

    def present(self, index, index1):
        date = str(data[index]["present"][index1]["date"])
        hourCost = str(data[index]["present"][index1]["hourCost"])
        hourLength = str(data[index]["present"][index1]["hourLength"])
        note = str(data[index]["present"][index1]["note"])

        extraData = "(" + hourCost[0:4] + "," + hourLength[0:4] + ")"
        self.set_font("NewFont", "", 12)
        width1= self.getWidth(date + extraData, note)
        width2 = self.getWidth(date, note + extraData)
        width = 0
        if width1 > width2:
            width = width2
            note = note + extraData
        else:
            width = width1 
            date = date + extraData

        if self.overallWidth + width > pdf_w:
            self.overallHeigth += self.fieldHeight * 2 
            self.overallWidth = 7.0

        self.holeWidth()
        self.set_xy(self.overallWidth, self.overallHeigth)
        self.cell(w=width, h=self.fieldHeight, 
            border=1, align="", txt=date)

        self.set_xy(self.overallWidth, 
            self.overallHeigth + self.fieldHeight)
        self.cell(w=width, h=self.fieldHeight, border=1, align="", txt=note)
        
        self.overallWidth += width

    def presents(self, index):
        for index1 in range(len(data[index]["present"])):
            self.present(index, index1)

    def text(self, index, index2):
        header = str(field(index, index2)[0])
        textD = str(field(index, index2)[1])

        self.set_font("NewFont", "", 12)
        width = self.getWidth(header, textD)

        if self.overallWidth + width > pdf_w:
            self.overallHeigth += self.fieldHeight * 2
            self.overallWidth = 7.0

        self.holeWidth()
        self.set_xy(self.overallWidth, self.overallHeigth)
        self.cell(w=width, h=self.fieldHeight, 
            border=1, align="", txt=header)

        self.set_xy(self.overallWidth, self.overallHeigth + self.fieldHeight)
        self.cell(w=width, h=self.fieldHeight, border=1, align="", txt=textD)
        
        self.overallWidth += width

    def studentHeigth(self, index):
        overallWidth = 0
        overallHeigth = self.overallHeigth
        for index1 in range(len(data[index])):
            if index1 == 3 or index1 > 13 or index1 == 12:
                continue
            header = str(field(index, index1)[0])
            textD = str(field(index, index1)[1])
            width = self.getWidth(header, textD)

            if overallWidth + width > pdf_w:
                overallWidth = 7.0
                overallHeigth += self.fieldHeight * 2
            overallWidth += width

        #present heigth
        for index1 in range(len(data[index]["present"])):
            date = str(data[index]["present"][index1]["date"])
            hourCost = str(data[index]["present"][index1]["hourCost"])
            hourLength = str(data[index]["present"][index1]["hourLength"])
            note = str(data[index]["present"][index1]["note"])

            extraData = "(" + hourCost[0:4] + "," + hourLength[0:4] + ")"
            width1= self.getWidth(date + extraData, note)
            width2 = self.getWidth(date, note + extraData)
            width = 0
            if width1 > width2:
                width = width2
            else:
                width = width1 

            if self.overallWidth + width > pdf_w:
                self.overallHeigth += self.fieldHeight * 2 
                self.overallWidth = 7.0

            overallWidth += width
 
        return overallHeigth + self.fieldHeight * 2
    def newStudent(self, index):
        self.overallWidth = 7
        self.overallHeigth += self.fieldHeight * 3

        if self.studentHeigth(index + 1) > pdf_h:
            self.overallHeigth = 7
            self.add_page()
            self.drawDate()
            return

        self.line(7, self.overallHeigth - self.fieldHeight / 2, 
            pdf_w, self.overallHeigth  - self.fieldHeight / 2)

pdf = PDF()

pdf.add_page()
pdf.set_auto_page_break(False)
font_path = "/home/manuel/python/arial-unicode-ms.ttf"
pdf.add_font("NewFont", '', font_path, uni=True)

def doStudent(index):
    for index1 in range(len(data[index])):
        if index1 == 3 or index1 > 13 or index1 == 12:
            continue
        pdf.text(index, index1)

pdf.drawDate()
for index in range(len(data)):
    doStudent(index)
    pdf.presents(index)
    if index + 1 != len(data):
        pdf.newStudent(index)

file_path = "/home/manuel/server_data/daten.pdf"
pdf.output(file_path, "f")
