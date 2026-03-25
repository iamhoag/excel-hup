const table = document.getElementById("sheet");
const fileInput = document.getElementById("fileInput");
const downloadBtn = document.getElementById("downloadBtn");
const addBtn = document.getElementById("addBtn");

let data = {};

// ===== TẠO BẢNG =====
function createTable(rows, cols) {
    table.innerHTML = "";
    data = {};

    // header
    let header = document.createElement("tr");
    header.appendChild(document.createElement("th"));

    for (let j = 0; j < cols; j++) {
        let th = document.createElement("th");
        th.innerText = String.fromCharCode(65 + j);
        header.appendChild(th);
    }
    table.appendChild(header);

    // body
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.innerText = i + 1;
        tr.appendChild(th);

        for (let j = 0; j < cols; j++) {
            tr.appendChild(createCell(i, j));
        }

        table.appendChild(tr);
    }
}

// ===== TẠO CELL (tái sử dụng) =====
function createCell(i, j, value = "") {
    let td = document.createElement("td");
    let input = document.createElement("input");

    let cell = String.fromCharCode(65 + j) + (i + 1);
    input.value = value;

    input.addEventListener("focus", () => {
        td.style.background = "#74b9ff";
    });

    input.addEventListener("blur", () => {
        td.style.background = "";

        let val = input.value.trim();
        data[cell] = val;

        if (val.startsWith("=")) {
            try {
                let expr = val.substring(1);
                expr = expr.replace(/[A-Z][0-9]+/g, m => data[m] || 0);
                input.value = eval(expr);
            } catch {
                input.value = "ERR";
            }
        }
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
        const rowsData = text.split("\n").map(r => r.split(","));

        const r = rowsData.length;
        const c = rowsData[0].length;

        createTable(r, c);

        const inputs = table.querySelectorAll("input");

        rowsData.forEach((row, i) => {
            row.forEach((cell, j) => {
                let index = i * c + j;
                if (inputs[index]) {
                    inputs[index].value = cell.trim();
                }
            });
        });
    };

    reader.readAsText(file);
});

// ===== DOWNLOAD TEMPLATE =====
downloadBtn.addEventListener("click", function () {

    const names = [
        "Nguyễn Văn A","Trần Thị B","Lê Văn C",
        "Phạm Văn D","Hoàng Văn E","Đỗ Thị F",
        "Vũ Văn G","Bùi Thị H","Ngô Văn I","Phan Thị K"
    ];

    const template = [["STT", "Tên SV", "MSV"]];

    for (let i = 1; i <= 20; i++) {
        let name = names[Math.floor(Math.random() * names.length)];
        let msv = "SV" + Math.floor(10000 + Math.random() * 90000);

        template.push([i, name, msv]);
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

// ===== ADD DÒNG MỚI =====
addBtn.addEventListener("click", function () {

    const name = document.getElementById("nameInput").value.trim();
    const msv = document.getElementById("msvInput").value.trim();

    if (!name || !msv) {
        alert("Nhập thiếu rồi 😑");
        return;
    }

    const rowIndex = table.rows.length; // chuẩn STT

    let tr = document.createElement("tr");

    // STT
    let th = document.createElement("th");
    th.innerText = rowIndex;
    tr.appendChild(th);

    const colCount = table.rows[0].children.length - 1;

    for (let j = 0; j < colCount; j++) {
        let value = "";

        if (j === 0) value = name;
        else if (j === 1) value = msv;

        tr.appendChild(createCell(rowIndex - 1, j, value));
    }

    table.appendChild(tr);

    // clear input
    document.getElementById("nameInput").value = "";
    document.getElementById("msvInput").value = "";
});

// ===== KHỞI TẠO =====
createTable(10, 3);
