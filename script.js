const table = document.getElementById("sheet");
const fileInput = document.getElementById("fileInput");
const downloadBtn = document.getElementById("downloadBtn");
const addBtn = document.getElementById("addBtn");

let data = {};

// ===== TẠO BẢNG =====
function createTable(rows, headers = ["STT", "Tên SV", "MSV"]) {
    table.innerHTML = "";
    data = {};

    // HEADER
    let headerRow = document.createElement("tr");

    headers.forEach(h => {
        let th = document.createElement("th");
        th.innerText = h;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // BODY
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");

        // STT
        let tdSTT = document.createElement("td");
        tdSTT.innerText = i + 1;
        tr.appendChild(tdSTT);

        // Tên + MSV
        for (let j = 0; j < headers.length - 1; j++) {
            tr.appendChild(createCell(i, j));
        }

        table.appendChild(tr);
    }
}

// ===== TẠO CELL =====
function createCell(i, j, value = "") {
    let td = document.createElement("td");
    let input = document.createElement("input");

    input.value = value;

    input.addEventListener("focus", () => {
        td.style.background = "#74b9ff";
    });

    input.addEventListener("blur", () => {
        td.style.background = "";
    });

    td.appendChild(input);
    return td;
}

// ===== LOAD CSV =====
fileInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        const text = event.target.result.trim();
        let rowsData = text.split("\n").map(r => r.split(","));

        const headers = rowsData[0]; // lấy header
        rowsData.shift(); // bỏ header

        createTable(0, headers);

        rowsData.forEach(row => {
            let tr = document.createElement("tr");

            row.forEach((cell, index) => {
                let td = document.createElement("td");

                if (index === 0) {
                    td.innerText = cell;
                } else {
                    let input = document.createElement("input");
                    input.value = cell;
                    td.appendChild(input);
                }

                tr.appendChild(td);
            });

            table.appendChild(tr);
        });
    };

    reader.readAsText(file);
});

// ===== DOWNLOAD TEMPLATE =====
downloadBtn.addEventListener("click", function () {

    const template = [["STT", "Tên SV", "MSV"]];

    for (let i = 1; i <= 20; i++) {
        template.push([i, "Nguyễn Văn A", "SV" + (10000 + i)]);
    }

    let csv = template.map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "danh_sach_sinh_vien.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// ===== ADD =====
addBtn.addEventListener("click", function () {

    const name = document.getElementById("nameInput").value.trim();
    const msv = document.getElementById("msvInput").value.trim();

    if (!name || !msv) {
        alert("Nhập thiếu 😑");
        return;
    }

    const rowIndex = table.rows.length;

    let tr = document.createElement("tr");

    // STT
    let tdSTT = document.createElement("td");
    tdSTT.innerText = rowIndex;
    tr.appendChild(tdSTT);

    // Tên
    tr.appendChild(createCell(rowIndex, 0, name));

    // MSV
    tr.appendChild(createCell(rowIndex, 1, msv));

    table.appendChild(tr);

    // clear
    document.getElementById("nameInput").value = "";
    document.getElementById("msvInput").value = "";
});

// ===== INIT =====
createTable(5);
