class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");

    // Insert Cols
    row.innerHTML = `<td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>`;
    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));

    // Get parent
    const container = document.querySelector(".container");
    // Get form
    const form = document.querySelector("#book-form");
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
  removeBook(target) {
    if (target.className === "delete") {
      target.parentNode.parentNode.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

// Local storage class

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => {
      const ui = new UI();
      // Add book to UI
      ui.addBookToList(book);
    });
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event listeners

// Dom load event

document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event listener for add book
document.getElementById("book-form").addEventListener("submit", function(e) {
  // Get form values
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  //   Instanitate UI
  const ui = new UI();

  // Validate

  if (title === "" || author === "" || isbn === "") {
    // Error alert

    ui.showAlert("Please fill in all fileds", "error");
  } else {
    //   Add book to list
    ui.addBookToList(book);

    // Add to local Storage
    Store.addBook(book);

    // Show success
    ui.showAlert("Book added!", "success");

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event listener for delete book

document.getElementById("book-list").addEventListener("click", function(e) {
  // Instantiate UI
  const ui = new UI();

  // Remove book
  ui.removeBook(e.target);

  // Remove from local storage
  Store.removeBook(e.target.parentNode.previousElementSibling.textContent);

  // Alert remove book
  ui.showAlert("Book removed", "success");

  e.preventDefault();
});
