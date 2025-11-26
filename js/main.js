//  Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// * HTML den Js e elemanları çekme

const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("#popup-title");
const popupButton = document.querySelector("#form-btn");

//* Global Scopeler

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// sayfa yüklendiğinde renderNotes fonksiyonunu çalıştır

let isUpdate = false;
let updateId = null;

document.querySelector("DOMContentLoaded", renderNotes(notes));

// note içerisindeki menüyü aktif edecek fonksiyon

function showMenu(item) {
  const parentElemenet = item.parentElement;
  // show classı ekle
  parentElemenet.classList.add("show");
  // show eklenerek aktif edilen pasife çek

  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != item) {
      parentElemenet.classList.remove("show");
    }
  });
}

//silinecek not elemanı için fonksiyon

function deleteNote(item) {
  const response = confirm(`Bu notu silmek istediğinizden eminmisiniz ?`);

  if (response) {
    // en yakın note clasına sahip yere eriş

    const noteItem = item.closest(".note");

    // id sine eriş

    const noteId = Number(noteItem.dataset.id);

    // id si bilinen notu not dizisinden kaldır

    notes = notes.filter((note) => note.id != noteId);

    //local storageyi güncelle

    localStorage.setItem("notes", JSON.stringify(notes));

    // renderlamak için render notes u çalıstır

    renderNotes(notes);
  }
}

//Note elemanını güncelleyecek fonksiyon

function editNote(item) {
  const note = item.closest(".note");

  const noteId = Number(note.dataset.id);

  const foundedNote = notes.find((note) => note.id == noteId);

  popupBox.classList.add("show");
  popup.classList.add("show");

  document.body.style.overflow = "hidden";

  form[0].value = foundedNote.title;
  form[1].value = foundedNote.description;

  isUpdate = true;
  updateId = noteId;

  popupTitle.textContent = "Update Note";
  popupButton.textContent = "Update";
}

//* 5-)wrapperdaki noktaya tıklandığında yada edit ve düzenleye tıklandığında olacaklar

wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    // 3 noktaya tıklandığında menüyü aktif et

    showMenu(e.target);
  }

  //delete icon a tıklama
  else if (e.target.classList.contains("delete-icon")) {
    deleteNote(e.target);
  }

  //edit  icon a tıklama
  else if (e.target.classList.contains("edit-icon")) {
    editNote(e.target);
  }
});

//* 1-) Popup ve Popup-box ı aktif et

addBox.addEventListener("click", () => {
  popupBox.classList.add("show");
  popup.classList.add("show");

  document.body.style.overflow = "hidden";
});

//* 2-) Popup ı pasif etmek için closeBtn e tıkla

closeBtn.addEventListener("click", () => {
  popupBox.classList.remove("show");
  popup.classList.remove("show");

  document.body.style.overflow = "auto";
  form.reset();

  // Popup'ı eski haline çevir
  popupTitle.textContent = "New Note";
  popupButton.textContent = "Add";
  isUpdate = false;
  updateId = null;
});

//* 3-) Formun gönderilmesini izle

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //form içerisindeki bilgilere  eriş

  const title = e.target[0].value;
  const description = e.target[1].value;

  // eger bilgiler yoksa uyarı ver
  if (!title || !description) {
    alert("Title ve description kısımları boş bırakılamaz.");

    return;
  }

  // Notun gönderildiği tarihe erişme

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const updateMonth = months[month];
  const year = date.getFullYear();
  const id = date.getTime();

  // ! popup güncelleme modunda mı?

  if (isUpdate) {
    // notes dizisi içerisinde güncellenecek elemanın sırasını bul
    const updateIndex = notes.findIndex((note) => note.id == updateId);

    // Bulunan index'deki elemanı notes dizisi içerisinde güncelle

    notes[updateIndex] = {
      title,
      description,
      date: `${updateMonth} ${day},${year} `,
      id,
    };

    popupTitle.textContent = "New Note";
    popupButton.textContent = "Add";

    isUpdate = false;
    updateId = null;
  } else {
    // karta aktarılacak dataları yönetmek için bir obje oluştur

    let noteItem = {
      title,
      description,
      date: `${updateMonth} ${day}, ${year}`,
      id,
    };

    //Formu gönderince oluşan noteItem leri notes dizisine ekle

    notes.push(noteItem);
  }

  // Local storage a kayıt yap

  localStorage.setItem("notes", JSON.stringify(notes));

  // Formu temizle

  form.reset();

  //formu kapat

  popupBox.classList.remove("show");
  popup.classList.remove("show");

  document.body.style.overflow = "auto";

  // notları renderlamak için renderNotes fonksiyonunu çalıştır

  renderNotes(notes);
});

// * 4-) Notları arayüze renderlama

function renderNotes(notes) {
  // önce tüm not clasına sahip olanları sil sonra hepsini tekrar yükleyecez
  document.querySelectorAll(".note").forEach((noteItem) => noteItem.remove());

  notes.forEach((note) => {
    let noteHtml = `    <div class="note " data-id=${note.id}  >
        <div class="details">
          <h2>${note.title}</h2>
          <p>${note.description}</p>
        </div>
        <div class="bottom">
          <p>${note.date}</p>

          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menü">
              <li class="edit-icon"><i class="bx bx-edit"></i>Edit</li>
              <li class="delete-icon"><i class="bx bx-trash"></i> Delete</li>
            </ul>
          </div>
        </div>
      </div>`;

    // oluşturulan elemanı arayüze ekle

    addBox.insertAdjacentHTML("afterend", noteHtml);
  });
}

renderNotes(notes);

// notes dizisinde yer alan her note için bir arayüze elaman renderlamalı
