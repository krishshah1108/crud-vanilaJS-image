const form = document.getElementById("user-form");
let editUserId = null;

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  const id = crypto.randomUUID();
  const name = document.getElementById("name").value.trim();
  const designation = document.getElementById("designation").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const photo = document.getElementById("photo").files[0];

  const reader = new FileReader();
  if (photo) {
    reader.readAsDataURL(photo);
  } else {
    console.log("No photo uploaded");
  }

  reader.onload = () => {
    const photoBase64 = reader.result;

    if (editUserId !== null) {
      const storedData = JSON.parse(localStorage.getItem("userData")) || [];
      const updatedData = storedData.map((user) => {
        if (user.id === editUserId) {
          return { ...user, name, designation, phone, photo: photoBase64 };
        }
        return user;
      });
      localStorage.setItem("userData", JSON.stringify(updatedData));
      editUserId = null;
    } else {
      const userData = { id, name, designation, phone, photo: photoBase64 };
      const storedData = JSON.parse(localStorage.getItem("userData")) || [];
      storedData.push(userData);
      localStorage.setItem("userData", JSON.stringify(storedData));
    }

    form.reset();
    renderCards();
  };
});

// Function to render cards from local storage
function renderCards() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // Clear existing cards

  // Retrieve data from local storage
  const storedData = JSON.parse(localStorage.getItem("userData")) || [];

  // Loop through the data and create cards
  storedData.forEach((user) => {
    // Create card elements
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = user.photo; // Use Base64 photo
    img.alt = `${user.name}'s Photo`;

    const name = document.createElement("h3");
    name.textContent = user.name;

    const designation = document.createElement("p");
    designation.textContent = `Designation: ${user.designation}`;

    const phone = document.createElement("p");
    phone.textContent = `Phone: ${user.phone}`;

    // Create action buttons
    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit");
    editButton.dataset.id = user.id; // Store the unique ID for reference

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.dataset.id = user.id; // Store the unique ID for reference

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    // Append elements to the card
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(designation);
    card.appendChild(phone);
    card.appendChild(actions);

    // Append the card to the container
    cardContainer.appendChild(card);

    deleteButton.addEventListener("click", () => handleDelete(user.id));
    editButton.addEventListener("click", () => handleEdit(user.id));
  });
}

function handleDelete(userId) {
  // Retrieve data from local storage
  const storedData = JSON.parse(localStorage.getItem("userData")) || [];

  // Filter out the item to delete
  const updatedData = storedData.filter((user) => user.id !== userId);

  // Save the updated data back to local storage
  localStorage.setItem("userData", JSON.stringify(updatedData));

  // Re-render cards
  renderCards();
}

function handleEdit(userId) {
  // Retrieve data from local storage
  const storedData = JSON.parse(localStorage.getItem("userData")) || [];

  // Find the user data to edit
  const userData = storedData.find((user) => user.id === userId);

  if (userData) {
    // Populate the form with user data
    document.getElementById("name").value = userData.name;
    document.getElementById("designation").value = userData.designation;
    document.getElementById("phone").value = userData.phone;

    document.getElementById("btn-edit-submit").innerHTML = "Update";
    // Store the photo as a placeholder (if needed)
    editUserId = userId; // Save the user ID being edited
  }
}

// Initial rendering of cards
renderCards();
