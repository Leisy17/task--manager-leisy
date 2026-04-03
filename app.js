const tbodyPending = document.getElementById("tbody-pending");
const pendingNumber = document.getElementById("number");
const doneNumber = document.getElementById("number-done");
var tableLen = 0;
var number = 0;
var finishedNumber = 0;

function abrirModal(id) {
    document.getElementById(id).style.display = "flex";
}

function cerrarModal(id) {
    document.querySelector(`#${id}`).style.display = "none";
}

function createCard(titulo, descripcion, line, footer) {
    const template = document.createElement("template");

    template.innerHTML = `
        <div class="card-container" style="display: flex; justify-content: center; width: 100;">
            <div class="card mb-16" id=>
                ${line}
                <div class="card-header">
                    <h1>${titulo}</h1>
                </div>
                <div class="card-body">
                    <p>${descripcion}</p>
                </div>
                <div class="card-footer">
                    ${footer}
                </div>
            </div>
        </div>
    `;

    return template.content.firstElementChild;
}

function actualizarPendientes(cambio) {
    number += cambio;
    if (number < 0) number = 0;

    const texto = number !== 1
        ? `${number} tareas pendientes`
        : `${number} tarea pendiente`;

    pendingNumber.innerHTML = texto;
}

function actualizarTareasHechas(cambio) {
    finishedNumber += cambio;

    if (finishedNumber < 0) finishedNumber = 0;

    const texto = finishedNumber !== 1
        ? `${finishedNumber} tareas`
        : `${finishedNumber} tarea`;

    doneNumber.innerHTML = texto;

    document.getElementById("delete-done-tasks").disabled = finishedNumber === 0;
}

function addNewTask() {
    const tarea = document.getElementById("tareaInput").value.trim();
    const descripcion = document.getElementById("descInput").value.trim();
    if (!tarea || !descripcion) return;

    const card = createCard(
        tarea, 
        descripcion,
        `<div class="line pending"></div>`,
        `<button class="btn-task primary" data-action="next-progress">Avanzar</button>`
            );

    const tr = document.createElement("tr");
    const tdPending = document.createElement("td");
    const tdProgress = document.createElement("td");
    const tdDone = document.createElement("td");

    tr.dataset.rowId = tableLen;

    tdPending.appendChild(card);

    tr.appendChild(tdPending);
    tr.appendChild(tdProgress);
    tr.appendChild(tdDone);

    tbodyPending.appendChild(tr);
    
    tableLen += 1;
    actualizarPendientes(1);
    cerrarModal('add-tasks');
    document.getElementById("tareaInput").value = "";
    document.getElementById("descInput").value = "";
}

const tbody = document.getElementById('table-body');

tbody.addEventListener('click', function (event) {
  const button = event.target.closest('button[data-action]');

  if (!button) return;

  const tr = button.closest('tr');
  const card = button.closest('.card-container');
  if (!tr || !card) return;

  const action = button.dataset.action;

  if (action === 'next-progress') {
    nextProgress(tr, card);
  }

  if (action === 'return-pending') {
    returnPending(tr, card);
  }

  if (action === 'finish') {
    finish(tr, card);
  }
});

function returnPending(tr, card) {
    const actualCol = tr.children[1];
    const nextCol = tr.children[0];
    if (!actualCol || !nextCol) return;
    const line = card.querySelector(".line");
    line.classList.remove("progress");
    line.classList.add("pending");
    const footer = card.querySelector(".card-footer");
    footer.innerHTML = `
        <button class="btn-task primary" data-action="next-progress">Avanzar</button>`;
    nextCol.appendChild(card);
    actualizarPendientes(1);
}

function nextProgress(tr, card) {
    const actualCol = tr.children[0];
    const nextCol = tr.children[1];
    if (!actualCol || !nextCol) return;
    const line = card.querySelector(".line");
    line.classList.remove("pending");
    line.classList.add("progress");
    const footer = card.querySelector(".card-footer");
    footer.innerHTML = `
        <button class="btn-task return" data-action="return-pending">Regresar</button>
        <button class="btn-task success" data-action="finish">Finalizar</button>`;
    nextCol.appendChild(card);
    actualizarPendientes(-1);
}

function finish(tr, card) {
    const actualCol = tr.children[1];
    const nextCol = tr.children[2];
    if (!actualCol || !nextCol) return;
    const line = card.querySelector(".line");
    line.classList.remove("progress");
    line.classList.add("done");
    const footer = card.querySelector(".card-footer");
    footer.innerHTML = "";
    nextCol.appendChild(card);
    actualizarTareasHechas(1);
}

function deleteDone() {
    var filas = tbodyPending.querySelectorAll("tr");

    for (var i = 0; i < filas.length; i++) {
        var tr = filas[i];
        var tdDone = tr.children[2];
        if (tdDone && tdDone.children.length > 0) {
            tdDone.innerHTML = "";
            actualizarTareasHechas(-1);
        }
    }

    cerrarModal("modal-done-tasks");
}