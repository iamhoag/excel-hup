const rows = 10;
const cols = 5;
const table = document.getElementById("sheet");

for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");

    for (let j = 0; j < cols; j++) {
        let td = document.createElement("td");
        let input = document.createElement("input");

        input.addEventListener("input", () => {
            console.log(`Ô (${i}, ${j}) = ` + input.value);
        });

        td.appendChild(input);
        tr.appendChild(td);
    }

    table.appendChild(tr);
}
