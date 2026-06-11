const filterButtons = document.querySelectorAll("[data-filter]");
const courseCards = document.querySelectorAll(".course-card");
const adminLogin = document.querySelector("#adminLogin");
const adminApp = document.querySelector("#adminApp");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLogout = document.querySelector("#adminLogout");
const loginError = document.querySelector("#loginError");
const portalLoginForm = document.querySelector("#portalLoginForm");
const portalLoginError = document.querySelector("#portalLoginError");
const clientLogout = document.querySelector("#clientLogout");
const classroomName = document.querySelector("#classroomName");
const classroomLabel = document.querySelector("#classroomLabel");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    courseCards.forEach((card) => {
      const isVisible = filter === "all" || card.dataset.status === filter;
      card.classList.toggle("d-none", !isVisible);
    });
  });
});

function showAdminApp() {
  adminLogin?.classList.add("d-none");
  adminApp?.classList.remove("d-none");
}

function showAdminLogin() {
  adminApp?.classList.add("d-none");
  adminLogin?.classList.remove("d-none");
}

if (adminLoginForm && adminLogin && adminApp) {
  if (sessionStorage.getItem("gthAdminLoggedIn") === "true") {
    showAdminApp();
  }

  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector("#adminUsername").value.trim();
    const password = document.querySelector("#adminPassword").value;

    if (username.toLowerCase() === "admin" && password === "123") {
      sessionStorage.setItem("gthAdminLoggedIn", "true");
      loginError.classList.add("d-none");
      showAdminApp();
      return;
    }

    loginError.classList.remove("d-none");
  });
}

adminLogout?.addEventListener("click", () => {
  sessionStorage.removeItem("gthAdminLoggedIn");
  showAdminLogin();
});

portalLoginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.querySelector("#portalUsername").value.trim();
  const password = document.querySelector("#portalPassword").value;

  if (username.toLowerCase() === "admin" && password === "123") {
    sessionStorage.setItem("gthAdminLoggedIn", "true");
    window.location.href = "admin.html";
    return;
  }

  if (username.toLowerCase() === "user" && password === "321") {
    sessionStorage.setItem("gthClientLoggedIn", "true");
    window.location.href = "classrooms.html";
    return;
  }

  portalLoginError?.classList.remove("d-none");
});

clientLogout?.addEventListener("click", () => {
  sessionStorage.removeItem("gthClientLoggedIn");
  window.location.href = "login.html";
});

if ((document.body.contains(clientLogout) || classroomName) && sessionStorage.getItem("gthClientLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const classroomTitles = {
  ict: "ICT OJT Classroom",
  css: "Computer Systems Servicing"
};

const selectedClassroom = new URLSearchParams(window.location.search).get("classroom");
const selectedClassroomTitle = classroomTitles[selectedClassroom];

if (selectedClassroomTitle) {
  if (classroomName) classroomName.textContent = selectedClassroomTitle;
  if (classroomLabel) classroomLabel.textContent = selectedClassroomTitle;
}
