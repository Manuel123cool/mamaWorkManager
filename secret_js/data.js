let studentSearch = []
let st = {
    allStudents: [],
    updateStudents: function() {
        let sortedArray = sortStudents(this.allStudents)
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                var responseText = xmlhttp0.responseText;
                const regex1 = new RegExp("Not right Token", "ig")
                if (regex1.test(responseText)) {
                    window.open("http://localhost/login.html", "_self");
                }
                const regex = new RegExp("Could not set Data", "ig")
                if (regex.test(responseText)) {
                    window.open("http://localhost/php/error.php?error=true", "_self");
                }
            }
        });
        xmlhttp0.open('POST', "php/set.php", true);
        xmlhttp0.setRequestHeader("Content-type", 
            "application/x-www-form-urlencoded");
        xmlhttp0.send("data=" + JSON.stringify(sortedArray));
    },
    setData: function() {
        this.updateStudents()
    },
    set students(data) {
        this.allStudents = data
    },
    get students() {
        return this.allStudents
    }
}

function sortStudents(array) {
    let sortedNameArray = Array()
    for (let i = 0; i < array.length; i++) {
        sortedNameArray.push(array[i].name + "{" + i + "}")
    }
    sortedNameArray.sort()
    
    let newArray = Array()
    for (let i = 0; i < sortedNameArray.length; i++) {
        const findIndexReg = new RegExp("{[0-9]+}")
        let indexWrapper = findIndexReg.exec(sortedNameArray[i]) 
        const removeWrapperReg = new RegExp("({|})", "g")
        let index = Number(indexWrapper[0].replace(removeWrapperReg, ""))
        newArray.push(array[index]) 
    }
    return newArray
}

class Present {
    constructor(date, hourLength, hourCost, note) {
        this.date = date
        this.hourLength = hourLength
        this.hourCost = hourCost
        this.note = note
    }
}

class Student {
    constructor() {
        this.name = ""
        this.number = ""
        this.email = ""
        this.present = []
        this.address = ""
        this.hourNum = 0
        this.contractType = ""
        this.hourCost = ""
        this.fond = ""
        this.transferDate = ""
        this.hourLength = ""
        this.billNumber = ""
        this.presentNote = ""
        this.note = ""
        this.correspondingIndex = -1
        this.tmpCorrespondingIndex = 0
    }

    changeWidthIndex(index, data) {
        switch (index) {
            case 0:
                this.name = data 
                break
            case 1:
                this.number = data 
                break
            case 2:
                this.email = data 
                break
            case 3:
                this.present = data 
                break
            case 4:
                this.address = data 
                break
            case 5:
                this.hourNum = data 
                break
            case 6:
                this.contractType = data 
                break
            case 7:
                this.hourCost = data 
                break
            case 8:
                this.fond = data 
                break
            case 9:
                this.transferDate = data 
                break
            case 10:
                this.hourLength = data 
                break
            case 11:
                this.billNumber = data 
                break
            case 12:
                this.presentNote = data 
                break
            case 13:
                this.note = data 
                break
        } 
    }

   reWidthIndex(index) {
        switch (index) {
            case 0:
                return this.name 
            case 1:
                return this.number 
            case 2:
                return this.email 
            case 3:
                return this.present 
            case 4:
                return this.address 
            case 5:
                return this.hourNum 
            case 6:
                return this.contractType 
            case 7:
                return this.hourCost 
            case 8:
                return this.fond 
            case 9:
                return this.transferDate 
            case 10:
                return this.hourLength 
            case 11:
                return this.billNumber
            case 12:
                return this.presentNote
            case 13:
                return this.note 
        } 
    }

    static dateInDays(date) {
        let days = Number(date.substring(0, 2)) 
        let months = Number(date.substring(3, 5))
        let years = Number(date.substring(6, 11))
    
        return (years - 2000) * 365 + months * 30.4167 + days
    }

    static reverseDate(date) {
        let years = date.substring(0, 4)
        let months = date.substring(5, 7)
        let days = date.substring(8, 11)

        let newDate = days + "-" + months + "-" + years
        return newDate
    }

    bubbleSort(array) {
        let n = array.length
        let swapped = false;
        do {
            swapped = false;
            for (let i = 0; i < n - 1; ++i) {
                if (Student.dateInDays(array[i].date) > 
                        Student.dateInDays(array[i + 1].date)) {
                    let tempArray = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = tempArray;
                    swapped = true;
                }
            }
        } while (swapped);
        return array;
    }
    addPresentDate(date, hourLength, hourCost, note) {
        const regex = new RegExp("^20[0-9]{2}-[0-1][0-9]-[0-3][0-9]$")
        let months = Number(date.substring(5, 7))
        let days = Number(date.substring(8, 11))
        const smallEnough = months > 12 || days > 31
        const bigEnough = months == 0  || days == 0
        const notDate = !regex.test(date)  
        if (notDate || smallEnough || bigEnough) {
            alert("Datum gibt es nicht")
            return false
        } else {
            const reDate = Student.reverseDate(date)
            const present = new Present(reDate, hourLength, hourCost, note)
            this.present.push(present)
            this.present = this.bubbleSort(this.present)
            this.present.reverse()
            return true
        }
    }
}

let changeTextData = {
    studentIndex: null,
    whichField: null, 
    target: null
}

