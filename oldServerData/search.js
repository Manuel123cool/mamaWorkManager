function createSearchField() {
    let wrapper = document.getElementById("search_wrapper")
    var label = document.createElement("label");
    label.setAttribute("for", "search");
    label.innerHTML = "Suchen:";
    wrapper.appendChild(label);  

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "search_field");
    input.setAttribute("name", "search");
    wrapper.appendChild(input);            

    input.addEventListener("input", addSearch);
}

function reSearchOn() {
    let search = document.getElementById("search_field")
    if (search.value == "") {
        return false 
    } else {
        return true
    }
}


function addSearch(e) {
    const searchFor = document.getElementById("search_field").value
    studentsSearch = []
    st.students.forEach( (elem, index) => {
        const regex = new RegExp(searchFor, "ig")
        elem.correspondingIndex = index
        if (regex.test(elem.name)) {
            studentsSearch.push(elem)
        } else if (regex.test(elem.number)) {
            studentsSearch.push(elem)
        } else if (regex.test(elem.email)) {
            studentsSearch.push(elem)
        }
    })
}

document.addEventListener("DOMContentLoaded", createSearchField);
