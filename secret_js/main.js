"use strict";

let tableMan = {
    tableWrapper: document.getElementById("table_wrapper"),
    addTr: function(table) {
        let tableRow = document.createElement("tr")
        table.appendChild(tableRow)
        return tableRow
    },
    addTh: function(header, parentNode, twoColomns = false) {
        let tableHeader = document.createElement("th")
        if (twoColomns) {
            tableHeader.setAttribute("colspan", "2")
        }
        tableHeader.innerHTML = header
        parentNode.appendChild(tableHeader)
    },
    addTd: function(header, parentNode, edit = false, twoColomns = false) {
        let tableData = document.createElement("td")
        if (twoColomns) {
            tableData.setAttribute("colspan", "2")
        }
        tableData.innerHTML = header
        parentNode.appendChild(tableData)
        
        if (edit) {
            tableData.addEventListener("click", editField);
        }
    }
}

function addStudentBig(index) {
    let tableWrapper = document.getElementById("table_wrapper")
    let table = document.createElement("table")
    
    let tableRow = tableMan.addTr(table)
    tableMan.addTh("Name", tableRow)
    tableMan.addTh("Telefonnummer", tableRow)
    tableMan.addTh("E-Mail", tableRow)

    let tableRow1 = tableMan.addTr(table)
    tableMan.addTd(st.students[index].name, tableRow1, true)
    tableMan.addTd(st.students[index].number, tableRow1, true)
    tableMan.addTd(st.students[index].email, tableRow1, true)

    let tableRow2 = tableMan.addTr(table)
    tableMan.addTh("Anwesend", tableRow2)
    tableMan.addTh("Adresse", tableRow2)
    tableMan.addTh("Stundenzahl", tableRow2)

    let presentDate = st.students[index].present[0]
    if (presentDate == undefined) {
        presentDate = ""
    } else {
        presentDate = st.students[index].present[0].date
    }
    let tableRow3 = tableMan.addTr(table)
    tableMan.addTd(presentDate, tableRow3, true)
    tableMan.addTd(st.students[index].address, tableRow3, true)
    tableMan.addTd(st.students[index].hourNum, tableRow3, true)

    let tableRow4 = tableMan.addTr(table)
    tableMan.addTh("Vertragsart", tableRow4)
    tableMan.addTh("Stundenkosten", tableRow4)
    tableMan.addTh("Fond", tableRow4)

    let tableRow5 = tableMan.addTr(table)
    tableMan.addTd(st.students[index].contractType, tableRow5, true)
    tableMan.addTd(st.students[index].hourCost, tableRow5, true)
    tableMan.addTd(st.students[index].fond, tableRow5, true)
    
    let tableRow6 = tableMan.addTr(table)
    tableMan.addTh("Überweisungsdatum", tableRow6)
    tableMan.addTh("Stundenlänge", tableRow6)
    tableMan.addTh("Rechnungsnummer", tableRow6)

    let transferDate = st.students[index].transferDate
    if (transferDate != "") {
        transferDate = Student.reverseDate(st.students[index].transferDate)
    }
    let tableRow7 = tableMan.addTr(table)
    tableMan.addTd(transferDate, tableRow7, true)
    tableMan.addTd(st.students[index].hourLength, tableRow7, true)
    tableMan.addTd(st.students[index].billNumber, tableRow7, true)

    let tableRow9 = tableMan.addTr(table)
    tableMan.addTh("Anwesenheitshinweis", tableRow9)
    tableMan.addTh("Hinweis", tableRow9, true)

    if (st.students[index].present[0] != undefined) {
        st.students[index].presentNote = st.students[index].present[0].note
        st.setData()
    }
    let tableRow8 = tableMan.addTr(table)
    tableMan.addTd(st.students[index].presentNote, tableRow8, true)
    tableMan.addTd(st.students[index].note, tableRow8, true, true)

    return table
}

function drawPreviews() {
    let localStudents = st.students
    if (reSearchOn()) {
        localStudents = studentsSearch
    }
    let tableWrapper = document.getElementById("table_wrapper")
    document.getElementById("edit_wrapper").innerHTML = ""
    document.getElementById("present_wrapper").innerHTML = ""
    tableWrapper.innerHTML = ""

    localStudents.forEach( (student) => {
        tableWrapper.appendChild(drawPreview(student))
   })
}

function drawPreview(student) {
        let table = document.createElement("table")
 
        let tableRow = tableMan.addTr(table)
        tableMan.addTh("Name", tableRow)
        tableMan.addTh("Telefonnummer", tableRow)
        tableMan.addTh("E-Mail", tableRow)

        let tableRow1 = tableMan.addTr(table)
        tableMan.addTd(student.name, tableRow1)
        tableMan.addTd(student.number, tableRow1)
        tableMan.addTd(student.email, tableRow1)

        addShowMore(table)

        return table
}

function addStudent() {
    st.students.push(new Student())
    st.setData()
    drawPreviews()
}

function addShowMore(table) {
    let tableRow = tableMan.addTr(table)
    tableRow.setAttribute("class", "show_more") 
    let tableData = document.createElement("th")
    tableData.innerHTML = "Mehr zeigen"
    tableData.setAttribute("colspan", "3")
    tableRow.appendChild(tableData)

    tableRow.addEventListener("click", showMore);
}

function showMore(e) {
    e.preventDefault();
    document.getElementById("edit_wrapper").innerHTML = ""
    document.getElementById("present_wrapper").innerHTML = ""
    
    let tableWrapper = document.getElementById("table_wrapper")
    let index = 0
    let parentNode = e.currentTarget.parentNode
    tableWrapper.childNodes.forEach( (element, index1) => {
        if (element == parentNode) {
            index = index1
        } else {
            if (element.childElementCount > 3) {
                let newNode = drawPreview(st.students[index1])
                tableWrapper.replaceChild(newNode, element) 
            }
        }
    })
    if (reSearchOn()) {
        index = st.studentsSearch[index].correspondingIndex
    }
    let newNode = addStudentBig(index)
    newNode.classList.add("statsBackground")
    tableWrapper.replaceChild(newNode, parentNode) 
}

function addAddButton() {
    let wrapper = document.getElementById("button_wrapper")
    let button = document.createElement("button")
    button.setAttribute("type", "button")
    button.innerHTML = "Schüler hinzufügen"
    wrapper.appendChild(button) 

    button.addEventListener("click", addStudent);
}

function removeRedReIndex(target) {
    let index = 0
    let count = 0
    target.parentNode.parentNode.childNodes.forEach( (element) => {
        element.childNodes.forEach( (element, index1) => {
            if (element.classList.contains("clickedForEdit")) {
                element.classList.remove("clickedForEdit") 
            }
            if (element == target) {
                index = count * 3 + index1
                if (index > 13) {
                    index--
                }
            }
        })
        if (element.firstChild.nodeName == "TD") {
            count++
        }
    })
    return index
}

function drawTextArea(text) {
    let wrapper = document.getElementById("edit_wrapper")
    wrapper.innerHTML = ""
    let textArea = document.createElement("textarea")
    textArea.innerHTML = text 
    wrapper.appendChild(textArea) 
    textArea.addEventListener("input", updateText)
}

function updateText(e) {
    st.students[changeTextData.studentIndex].
        changeWidthIndex(changeTextData.whichField, 
            e.currentTarget.value)
    st.setData()
    changeTextData.target.innerHTML = e.currentTarget.value 
}

function drawHourCount() {
    let wrapper = document.getElementById("edit_wrapper")
    let button = document.createElement("button")
    button.setAttribute("type", "button")
    button.setAttribute("class", "hourCount")
    button.innerHTML = "Stunde dazu"
    wrapper.appendChild(button) 

    let button1 = document.createElement("button")
    button1.setAttribute("type", "button")
    button1.setAttribute("class", "hourCount")
    button.innerHTML = "Stunde dazu"
    button1.innerHTML = "Stunde weniger"
    wrapper.appendChild(button1) 

    button.addEventListener("click", oneMore);
    button1.addEventListener("click", oneLess);
}

function oneMore(e) {
    let whichField = changeTextData.whichField
    let studentIndex = changeTextData.studentIndex
    let newValue = st.students[studentIndex].reWidthIndex(whichField) + 1
    st.students[studentIndex].changeWidthIndex(whichField, newValue)
    st.setData()
    changeTextData.target.innerHTML = newValue 
}

function oneLess(e) {
    if (confirm("Mami möchtes du wirklich eine Stundenzahl weniger ?")) {
        let whichField = changeTextData.whichField
        let studentIndex = changeTextData.studentIndex
        let newValue = st.students[studentIndex].reWidthIndex(whichField) - 1
        st.students[studentIndex].changeWidthIndex(whichField, newValue)
        st.setData()
        changeTextData.target.innerHTML = newValue 
    } 
}


function editField(e) {
    let index = removeRedReIndex(e.currentTarget) 
    e.currentTarget.classList.add("clickedForEdit")
    document.getElementById("edit_wrapper").innerHTML = ""
    document.getElementById("present_wrapper").innerHTML = ""

    let tableIndex = 0
    let parentNode = e.currentTarget.parentNode.parentNode
    let tableWrapper = document.getElementById("table_wrapper")
    tableWrapper.childNodes.forEach( (element, index1) => {
        if (element == parentNode) {
            tableIndex = index1
        } 
    })
    if (reSearchOn()) {
        tableIndex = studentsSearch[tableIndex].correspondingIndex
    }
    changeTextData.studentIndex = tableIndex

    changeTextData.whichField = index
    changeTextData.target = e.currentTarget

    switch (index) {
        case 0:
        case 1:
        case 2:
        case 4:
        case 11:
        case 12:
        case 13:
            drawTextArea(st.students[tableIndex].reWidthIndex(index))
            break
        case 5:
            drawHourCount()
            break
        case 6:
            drawCotractCheckBox()
            break
        case 7:
            drawHourCostCheckBox()
            break
        case 8:
            drawFondCheckBox()
            break
        case 3:
            drawDateSelector()
            showPresents()
            break
        case 9:
            drawTranferDateSelector()
            break
        case 10:
            drawHourlength()
            break
    }
}

function drawHourlength() {
    let wrapper = document.getElementById("edit_wrapper")
    let form = document.createElement("form")

    addRadioButton("45 Minuten", form)
    addRadioButton("60 Minuten", form)
    addRadioButton("90 Minuten", form)
    addRadioButton("Nichts", form)
    wrapper.appendChild(form) 
}

function drawTranferDateSelector() {
    let input = document.createElement("input")
    input.setAttribute("type", "date")
    input.setAttribute("id", "date")

    let currentDateValue = st.students[changeTextData.studentIndex].
        transferDate
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    if (currentDateValue == "") {
        currentDateValue = new Date().toDateInputValue()
    }
    input.value = currentDateValue

    let wrapper = document.getElementById("edit_wrapper")
    wrapper.appendChild(input)
    input.addEventListener("input", handleTranferDate);
    input.addEventListener("click", handleTranferDate);
    
    let button = document.createElement("button")
    button.setAttribute("type", "button")
    button.setAttribute("id", "delTransferDate")
    button.innerHTML = "Datum leer machen"
    wrapper.appendChild(button)

    button.addEventListener("click", handleDelTransferDate);
}

function handleDelTransferDate(e) {
    st.students[changeTextData.studentIndex].transferDate = ""
    st.setData()
    changeTextData.target.innerHTML = ""
}

function showMoreFromPresent(e) {
    let returnVar = false
    if (e.currentTarget.childElementCount > 1) {
        returnVar = true
    }
    const wrapper = document.getElementById("present_wrapper")
    wrapper.childNodes.forEach( elem => {
        elem.classList.remove("presentClickColor")
        elem.classList.add("presentClickColorNot")
        if (elem.childElementCount > 1) {
            elem.childNodes[1].remove()
            elem.childNodes[1].remove()
            elem.childNodes[1].remove()
            return
        }
    })
    
    if (returnVar) {
        return
    }

    e.currentTarget.classList.add("presentClickColor")
    e.currentTarget.classList.remove("presentClickColorNot")
    let index = 0
    st.students[changeTextData.studentIndex].present.forEach( 
            (elem, index1) => { 
        if (elem.date == e.currentTarget.childNodes[0].innerHTML) {
            index = index1
        }
    })
    const presentArray = st.students[changeTextData.studentIndex].present
    let hourLength = document.createElement("p")
    hourLength.innerHTML = "Stundenlänge: " + presentArray[index].hourLength
    let hourCost = document.createElement("p")
    hourCost.innerHTML = "Stundenkosten: " + presentArray[index].hourCost
    let note = document.createElement("p")
    note.innerHTML = "Hinweis: " + presentArray[index].note

    e.currentTarget.appendChild(hourCost)
    e.currentTarget.appendChild(hourLength)
    e.currentTarget.appendChild(note)
}

function showPresents() {
    let div = document.getElementById("present_wrapper")
    div.innerHTML = ""

    let index = changeTextData.studentIndex
    st.students[index].present.forEach( (elem) => {
        let divDate = document.createElement("div")
        let par = document.createElement("p")
        par.innerHTML = elem.date
        divDate.appendChild(par)
        divDate.classList.add("presentClickColorNot") 
        div.appendChild(divDate)

        divDate.addEventListener("click", showMoreFromPresent);
    })
}

function handleTranferDate(e) {
    let value = e.currentTarget.value
    st.students[changeTextData.studentIndex].transferDate = value
    st.setData()
    changeTextData.target.innerHTML = Student.reverseDate(value)
}

function drawDateSelector() {
    let input = document.createElement("input")
    input.setAttribute("type", "date")
    input.setAttribute("id", "date")
    
    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    input.value = new Date().toDateInputValue()
    let wrapper = document.getElementById("edit_wrapper")
    wrapper.appendChild(input)

    let button = document.createElement("button")
    button.setAttribute("type", "button")
    button.setAttribute("id", "addDate")
    button.innerHTML = "Neue Anwesenheit hinzufügen"
    wrapper.appendChild(button) 

    button.addEventListener("click", handleNewDate);

    let button1 = document.createElement("button")
    button1.setAttribute("type", "button")
    button1.setAttribute("id", "deleteDate")
    button1.innerHTML = "Anwesenheit löschen"
    wrapper.appendChild(button1) 

    button1.addEventListener("click", addDeleteTool);
}

function addDeleteTool(e) {
    let wrapper = document.getElementById("edit_wrapper")

    if (wrapper.childElementCount < 4) {
        let input = document.createElement("input")
        input.setAttribute("type", "test")
        input.setAttribute("id", "deleteDateInput")
        wrapper.appendChild(input)
    } else {
        let date = document.getElementById("deleteDateInput").value
        if (confirm("Mami wills du wirklich das Datum: " + date + 
            " aus den Anwesenheiten löschen ?")) {
            let deleteIndex = -1
            st.students[changeTextData.studentIndex].
                present.forEach( (elem, index) => {
                    if (date == elem.date) {
                        deleteIndex = index 
                    }
            })
            if (deleteIndex == -1) {
                alert("Mami, das Datum gibts nicht")
            } else {
                st.students[changeTextData.studentIndex].
                    present.splice(deleteIndex, 1)
                st.setData()
                showPresents()

                let index = changeTextData.studentIndex
                let forDataField = st.students[index].present[0]
                if (forDataField == undefined) {
                    forDataField = ""
                } else {
                    forDataField = st.students[index].present[0].date
                }
                changeTextData.target.innerHTML = forDataField
            }
            document.getElementById("deleteDateInput").remove()
        }
    }
}

function handleNewDate(e) {
    let wrapper = document.getElementById("edit_wrapper")
    if (wrapper.childElementCount > 3) {
        document.getElementById("deleteDateInput").remove()
    }
    const newValue = 
        Student.reverseDate(document.getElementById("date").value)
    const index = changeTextData.studentIndex
    const hourLength = st.students[index].hourLength
    const hourCost = st.students[index].hourCost
    const note = st.students[index].presentNote
    st.students[index].addPresentDate(newValue, hourLength, hourCost, note) 
    if (!st.students[index].addPresentDate(newValue, hourLength,
            hourCost, note)) {
        return
    }  
    st.students[index].presentNote = st.students[index].present[0].note
    st.setData()
    changeTextData.target.innerHTML = st.students[index].present[0].date
    showPresents()
}

function addRadioButton(name, form) {
    let div = document.createElement("div")
    let input = document.createElement("input")
    let label = document.createElement("label")

    input.setAttribute("type", "radio")
    input.setAttribute("name", "combined")
    input.setAttribute("id", name)
    input.setAttribute("value", name)
    div.setAttribute("class", "label")

    label.innerHTML = name

    div.appendChild(input) 
    div.appendChild(label) 

    form.appendChild(div)

    input.addEventListener("click", handleCheckBox);
}

function drawCotractCheckBox() {
    let wrapper = document.getElementById("edit_wrapper")
    let form = document.createElement("form")

    addRadioButton("HV 9x45 Min/Mon U", form)
    addRadioButton("HV 18x45 Min/Mon U", form)
    addRadioButton("HV 9x60 Min/Mon U", form)
    addRadioButton("HV 18x60 Min/Mon U", form)
    addRadioButton("HV 9x45 Min/Mon S", form)
    addRadioButton("HV 18x45 Min/Mon S", form)
    addRadioButton("HV 9x60 Min/Mon S", form)
    addRadioButton("HV 18x60 Min/Mon S", form)
    addRadioButton("Einzelstunde Überweisung", form)
    addRadioButton("Einzelstunde Bar", form)
    addRadioButton("Nichts", form)

    wrapper.appendChild(form) 
}

function drawFondCheckBox() {
    let wrapper = document.getElementById("edit_wrapper")
    let form = document.createElement("form")
    
    addRadioButton("Ja", form)
    addRadioButton("Nein", form)
    addRadioButton("Nichts", form)
    wrapper.appendChild(form) 

}

function drawHourCostCheckBox() {
    let wrapper = document.getElementById("edit_wrapper")
    let form = document.createElement("form")
    
    addRadioButton("45 Min Unterricht", form)
    addRadioButton(" Min Salutogenese", form)
    addRadioButton("60 Min Unterricht", form)
    addRadioButton("60 Min Salutogenese", form)
    addRadioButton("60 Min Supervision", form)
    addRadioButton("Siehe Hinweise", form)
    addRadioButton("Nichts", form)
    wrapper.appendChild(form) 
}

function handleCheckBox(e) {
    st.students[changeTextData.studentIndex].
        changeWidthIndex(changeTextData.whichField, 
            e.currentTarget.value)
    st.setData()
    changeTextData.target.innerHTML = e.currentTarget.value 
}

function addMakeSmallButton() {
    let wrapper = document.getElementById("button_wrapper")
    let button = document.createElement("button")
    button.setAttribute("type", "button")
    button.innerHTML = "Klein machen"
    wrapper.appendChild(button) 

    button.addEventListener("click", makeSmall);
}

function makeSmall(e) {
    document.getElementById("edit_wrapper").innerHTML = ""
    document.getElementById("present_wrapper").innerHTML = ""
    drawPreviews()
}

function init() {
    addAddButton()
    addMakeSmallButton()
    drawPreviews()
}

document.addEventListener("DOMContentLoaded", init)

function addRadioButton(name, form) {
    let div = document.createElement("div")
    let input = document.createElement("input")
    let label = document.createElement("label")

    input.setAttribute("type", "radio")
    input.setAttribute("name", "combined")
    input.setAttribute("id", name)
    input.setAttribute("value", name)
    div.setAttribute("class", "label")

    label.innerHTML = name

    div.appendChild(input) 
    div.appendChild(label) 

    form.appendChild(div)

    input.addEventListener("click", handleCheckBox);
}

function handleCheckBox(e) {
    let newValue = e.currentTarget.value
    if (newValue == "Nichts") {
        newValue = ""
    }

    st.students[changeTextData.studentIndex].
        changeWidthIndex(changeTextData.whichField, newValue)
    st.setData()
    changeTextData.target.innerHTML = newValue 
}

function addMakeSmallButton() {
    let wrapper = document.getElementById("button_wrapper")
    let button = document.createElement("button")
    button.setAttribute("type", "button")
    button.innerHTML = "Klein machen"
    wrapper.appendChild(button) 

    button.addEventListener("click", makeSmall);
}

function addDownloadButton() {
    let wrapper = document.getElementById("button_wrapper")
    let button = document.createElement("button")
    button.setAttribute("type", "button")
    button.innerHTML = "Download PDF"
    wrapper.appendChild(button) 

    button.addEventListener("click", downloadPDF);
}

function downloadPDF(e) {
    window.open("http://localhost/php/sendpdf.php?data=true", "_self");
}

function makeSmall(e) {
    document.getElementById("edit_wrapper").innerHTML = ""
    drawPreviews()
}

function addSearchEvent() {
    let search = document.getElementById("search_field")
    search.addEventListener("input", drawPreviews);
}

function JSONTOJs() {
    let tmpArray = []
    st.students.forEach( (elem, index) => {
        tmpArray.push(new Student()) 
        let index1 = 0
        for (let [key, elem1] of Object.entries(elem)) {
            if (index1 == 3) {
                for (let [key, elem2] of 
                        Object.entries(st.students[index])) {

                    Object.size = function(obj) {
                      var size = 0,
                        key;
                      for (key in obj) {
                        if (obj.hasOwnProperty(key)) size++;
                      }
                      return size;
                    };
                    if (elem2.size > 0) {
                        tmpArray[index].addPresentDate(elem2.date, 

                                elem2.hourLength, elem2.hourCost,
                                    elem2.note)
                    } else {
                        tmpArray[index].present.push(new Present)
                    }
                }
            }
            tmpArray[index].changeWidthIndex(index1, elem1) 
            index1++
        }
    })
    st.students = tmpArray;
}

function init() {
    let xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            let responseText = xmlhttp0.responseText;
            
            const regex1 = new RegExp("Not right Token", "ig")
            if (regex1.test(responseText)) {
                window.open("http://localhost/login.html", "_self");
            }
            const regex = new RegExp("Could not get Data", "ig")
            if (regex.test(responseText)) {
                window.open("http://localhost/php/error.php?error=true", "_self");
            }
       
            String.prototype.isEmpty = function() {
                return (this.length === 0 || !this.trim());
            }
            if (!responseText.isEmpty()) {
                st.students = JSON.parse(responseText)
                JSONTOJs()
            }
            addAddButton()
            addMakeSmallButton()
            addDownloadButton()

            drawPreviews()
            addSearchEvent()
        }
    });
    xmlhttp0.open('GET', "php/get.php?data=true", true);
    xmlhttp0.send();  
}

document.addEventListener("DOMContentLoaded", init)
