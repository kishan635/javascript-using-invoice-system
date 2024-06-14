// Function to populate the invoice details
function populateInvoice() {
    // No need to update the text content, as input values will be used
    // Populate invoice items
    const itemsTable = document.getElementById("invoice-items");
    itemsTable.innerHTML = "";
    let totalAmount = 0;

    // Sample data for the invoice
    const invoiceData = {
        items: [
            { description: "Item 1", quantity: 2, unitPrice: 10.00 },
            { description: "Item 2", quantity: 1, unitPrice: 20.00 },
            // Add more items as needed
        ]
    };

    invoiceData.items.forEach(item => {
        const total = item.quantity * item.unitPrice;
        totalAmount += total;

        const row = `<tr>
              <td><input type="text" class="description cmn-input" value="${item.description}"></td>
              <td><input type="number" class="quantity cmn-input" value="${item.quantity}"></td>
              <td><input type="number" class="unit-price cmn-input" value="${item.unitPrice.toFixed(2)}"></td>
              <td><input type="text" class="total cmn-input" value="${total.toFixed(2)}" readonly></td>
              <td class="btn-p"><button class="btn-rmv" onclick="removeRow(this)">Remove</button></td>
            </tr>`;
        itemsTable.innerHTML += row;
    });

    // Update total amount
    document.getElementById("total-amount").value = totalAmount.toFixed(2);
}

// Function to calculate total on input change
function calculateTotal() {
    document.querySelector("tbody").addEventListener("input", function (event) {
        const target = event.target;
        if (target.classList.contains("quantity") || target.classList.contains("unit-price")) {
            const row = target.closest("tr");
            const quantity = parseFloat(row.querySelector(".quantity").value) || 0;
            const unitPrice = parseFloat(row.querySelector(".unit-price").value) || 0;
            const total = quantity * unitPrice;

            row.querySelector(".total").value = total.toFixed(2);

            // Recalculate total amount
            let newTotalAmount = 0;
            document.querySelectorAll(".total").forEach(function (el) {
                newTotalAmount += parseFloat(el.value) || 0;
            });

            document.getElementById("total-amount").value = newTotalAmount.toFixed(2);
        }
    });
}

// Function to add a new row to the table
function addRow() {
    const newRow = `<tr>
                <td><input type="text" class="description"></td>
                <td><input type="number" class="quantity"></td>
                <td><input type="number" class="unit-price"></td>
                <td><input type="text" class="total" readonly></td>
                <td class="btn-p"><button class="btn-rmv" onclick="removeRow(this)">Remove</button></td>
              </tr>`;
    //   document.getElementById("invoice-items").innerHTML +=
    document.getElementById("invoice-items").innerHTML += newRow;
}

// Function to remove a row from the table
function removeRow(button) {
    const row = button.closest("tr");
    row.remove();
    recalculateTotal();
}

// Function to recalculate total after removing a row
function recalculateTotal() {
    let newTotalAmount = 0;
    document.querySelectorAll(".total").forEach(function (el) {
        newTotalAmount += parseFloat(el.value) || 0;
    });

    document.getElementById("total-amount").value = newTotalAmount.toFixed(2);
}

// Function to generate and download PDF
function generatePDF() {
    // Hide the button before generating PDF
    document.querySelector("button").style.display = "none";

    const allInputElem = document.querySelectorAll("input")
    for (var index = 0; index < allInputElem.length; index++) {
        allInputElem[index].style.border = 'none';
        allInputElem[index].style.pointerEvents = 'none';
        allInputElem[index].style.padding = '10px 0';
    }

    document.querySelector(".btn-add").style.display = 'none';
    document.querySelector("#client-image").style.display = 'none';

    const allElem = document.querySelectorAll(".btn-p")
    for (var index = 0; index < allElem.length; index++) {
        allElem[index].style.display = 'none';
    }

    const element = document.getElementById("invoice");

    // Set the page size to 'a4' and include 'html2pdf' configuration
    const pdfConfig = {
        margin: 10,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf(element, pdfConfig);

    // Show the button again after PDF generation
    document.querySelector("button").style.display = "block";
}
function previewImage(input) {
    const preview = document.getElementById('client-preview');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };

        reader.readAsDataURL(file);
    } else {
        // If no file is selected, show a placeholder image
        preview.src = 'https://via.placeholder.com/200x200';
        preview.classList.remove('hidden');
    }
}

function switchTab(tabId) {
    const previewTab = document.getElementById('preview-tab');
    const editTab = document.getElementById('edit-tab');

    if (tabId === 'preview-tab') {

        const allInputElem = document.querySelectorAll("input")
        for (var index = 0; index < allInputElem.length; index++) {
            allInputElem[index].style.border = 'none';
            allInputElem[index].style.pointerEvents = 'none';
            allInputElem[index].style.padding = '10px 0';
        }

        document.querySelector(".btn-add").style.display = 'none';
        document.querySelector("#client-image").style.display = 'none';

        const allElem = document.querySelectorAll(".btn-p")
        for (var index = 0; index < allElem.length; index++) {
            allElem[index].style.display = 'none';
        }

        previewTab.style.display = 'block';
        editTab.style.display = 'none';

    } else if (tabId === 'edit-tab') {

        const allInputElem = document.querySelectorAll("input")
        for (var index = 0; index < allInputElem.length; index++) {
            allInputElem[index].style.border = '1px solid #cccccc';
            allInputElem[index].style.pointerEvents = 'auto';
            allInputElem[index].style.padding = '10px';
        }
        document.querySelector(".btn-add").style.display = 'block';
        document.querySelector("#client-image").style.display = 'block';
        const allElem = document.querySelectorAll(".btn-p")
        for (var index = 0; index < allElem.length; index++) {
            allElem[index].style.display = 'block';
        }
        previewTab.style.display = 'none';
        editTab.style.display = 'block';
    }
}
// Call the functions to populate initial invoice details, calculate total, and set up event listeners
populateInvoice();
calculateTotal();