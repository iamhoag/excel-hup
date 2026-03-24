const rows = 10;
const cols = 5;
const table = document.getElementById("sheet");

let data = {};

// ===== TẠO BẢNG =====
function createTable(r, c) {
    table.innerHTML = "";
    data = {}; // reset dữ liệu

    // header A B C
    let header = document.createElement("tr");
    header.appendChild(document.createElement("th"));

    for (let j = 0; j < c; j++) {
        let th = document.createElement("th");
        th.innerText = String.fromCharCode(65 + j);
        header.appendChild(th);
    }
    table.appendChild(header);

    // body
    for (let i = 0; i < r; i++) {
        let tr = document.createElement("tr");

        let th = document.createElement("th");
        th.innerText = i + 1;
        tr.appendChild(th);

        for (let j = 0; j < c; j++) {
            let td = document.createElement("td");
            let input = document.createElement("input");

            let cell = String.fromCharCode(65 + j) + (i + 1);

            // highlight cả ô
            input.addEventListener("focus", () => {
                td.style.background = "#cce5ff";
            });

            input.addEventListener("blur", () => {
                td.style.background = "white";

                let val = input.value.trim();
                data[cell] = val;

                // xử lý công thức
                if (val.startsWith("=")) {
                    try {
                        let expr = val.substring(1);

                        expr = expr.replace(/[A-Z][0-9]+/g, (match) => {
                            return data[match] || 0;
                        });

                        input.value = eval(expr);
                    } catch {
                        input.value = "ERR";
                    }
                }
            });

            td.appendChild(input);
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}

// ===== LOAD CSV =====
document.getElementById("fileInput").addEventListener("change", function(e) {
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
                let index = i * c + j; // dùng c mới, không dùng cols cũ
                if (inputs[index]) {
                    inputs[index].value = cell.trim();
                }
            });
        });
    };

    reader.readAsText(file);
});

// ===== KHỞI TẠO =====
createTable(rows, cols);

function downloadTemplate() {
    const data = [
        ["STT", "Tên SV", "MSV"],
        ["1", "", ""],
        ["2", "", ""],
        ["3", "", ""],
        ["4", "", ""],
        ["5", "", ""],
    ];

    // chuyển thành CSV
    let csvContent = data.map(row => row.join(",")).join("\n");

    // tạo file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // tạo link download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "danh_sach_sinh_vien.csv");
    link.click();
}
