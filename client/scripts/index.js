// Event handlers

document.addEventListener('DOMContentLoaded', () => {
    loadTableRows();
});

// add btn 
const addBtn = document.querySelector("#add-note-btn");

addBtn.addEventListener("click", () => {
    const noteInput = document.querySelector("#note-input");
    const noteValue = noteInput.value;
    noteInput.value = "";

    fetch("http://localhost:5000/notes", {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            'description': noteValue
        })
    })
    .then(res => res.json())
    .then(data => insertRowIntoTable(data));
});

//edit button
const editBtn = document.querySelector("#edit-row-btn");
let editSection = document.querySelector("#edit-row");
let editTextField = document.querySelector("#edit-name-input");

editBtn.addEventListener("click", () => {
    const noteId = editBtn.value;

    fetch(`http://localhost:5000/notes/${noteId}`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            'description': editTextField.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success){
            // clear value of btn
            editBtn.value = "";
            // clear value of field
            editTextField.value = "";
            // hide edit field
            editSection.hidden = true;
            // after successful Edit, redraw table
            loadTableRows();
        }
    });
});

document.querySelector('table tbody').addEventListener('click', (event) => {
    if (event.target.className === "delete-row-btn") {
        
        // get index of row that contains the target button
        const noteId = event.target.getAttribute('data-id');
        const table = document.querySelector('table tbody');
        const targetRowIndex = (event.target.closest("tr").rowIndex - 1);

        fetch(`http://localhost:5000/notes/${noteId}`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            if (data.success){
                // after successful deletion, remove row from front end table
                table.deleteRow(targetRowIndex);
            }
        });
    }
    if (event.target.className === "edit-row-btn") {

        // get index of row that contains the target button
        const noteId = event.target.getAttribute('data-id');
        const table = document.querySelector('table tbody');
        const targetRowIndex = (event.target.closest("tr").rowIndex - 1);

        let targetDescription = table.rows[targetRowIndex].cells[1].innerHTML;
        
        // populate the edit text field with content of corresponding note

        editTextField.value = targetDescription;
        editSection.hidden = false;
        editBtn.value = noteId;
    }
})

// Helper Functions
function loadTableRows(){
    fetch('http://localhost:5000/notes').then(
        res => res.json()
    ).then(
        data => loadHTMLTable(data)
    );
    loadHTMLTable([]);
}


function addTableRows(data) {
    var tableHtml = "";

    tableHtml += "<tr>";
    tableHtml += `<td>${data.notes_id}</td>`;
    tableHtml += `<td>${data.description}</td>`;
    tableHtml += `<td>${new Date(data.date_added).toLocaleString()}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.notes_id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.notes_id}>Edit</button></td>`;
    tableHtml += "</tr>";

    return(tableHtml);
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const noTableData = document.querySelector(".no-data");

    let tableHtml = "";

    tableHtml += addTableRows(data, tableHtml);

    if (noTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
} 

function loadHTMLTable (data) {
   const table = document.querySelector('table tbody');

    if(data.length === 0) {
        table.innerHTML = "<tr><td class 'no-data' colspan='5'>No Data</td></tr>"
        return;
    }
    let tableHtml = "";

    data.forEach((data) => tableHtml += addTableRows(data));

    table.innerHTML = tableHtml;
}