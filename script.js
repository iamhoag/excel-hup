const rows = 10;
const cols = 5;
const table = document.getElementById("sheet");

let data = {};

// ===== TẠO BẢNG =====
function createTable(r, c) {
    table.innerHTML = "";

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

            input.addEventListener("focus", () => {
                input.style.background = "#cce5ff";
            });

            input.addEventListener("blur", () => {
                input.style.background = "transparent";

                let val = input.value;
                data[cell] = val;

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
        const text = event.target.result;
        const rowsData = text.split("\n").map(r => r.split(","));

        createTable(rowsData.length, rowsData[0].length);

const inputs = table.querySelectorAll("input");

rowsData.forEach((row, i) => {
    row.forEach((cell, j) => {
        let index = i * rowsData[0].length + j;
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
