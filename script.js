const table = document.getElementById("sheet");
const fileInput = document.getElementById("fileInput");
const downloadBtn = document.getElementById("downloadBtn");

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
            let td = document.createElement("td");
            let input = document.createElement("input");

            let cell = String.fromCharCode(65 + j) + (i + 1);

            input.addEventListener("focus", () => {
                td.style.background = "#cce5ff";
            });

            input.addEventListener("blur", () => {
                td.style.background = "white";

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
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}

// ===== LOAD FILE CSV =====
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
    const template = [
        ["STT", "Tên SV", "MSV"],
    ];

    for (let i = 1; i <= 20; i++) {
        template.push([i, "", ""]);
    }

    let csv = template.map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "danh_sach_sinh_vien.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// ===== KHỞI TẠO =====
createTable(10, 5);
