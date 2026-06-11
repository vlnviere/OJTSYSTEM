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
const courseSearchForms = document.querySelectorAll(".course-search");
const dashboardBackButtons = document.querySelectorAll(".dashboard-back");
const announcementForm = document.querySelector("#announcementForm");
const adminAnnouncements = document.querySelector("#adminAnnouncements");
const studentAnnouncements = document.querySelector("#studentAnnouncements");
const studentAnnouncementClass = document.querySelector("#studentAnnouncementClass");
const chatbox = document.querySelector("#chatbox");
const chatForm = document.querySelector("#chatForm");
const chatMessage = document.querySelector("#chatMessage");
const chatMessages = document.querySelector("#chatMessages");
const chatClassroom = document.querySelector("#chatClassroom");
const chatToggle = document.querySelector(".chat-toggle");
const videoForm = document.querySelector("#videoForm");
const videoError = document.querySelector("#videoError");
const adminVideos = document.querySelector("#adminVideos");
const studentVideos = document.querySelector("#studentVideos");
const studentVideoClass = document.querySelector("#studentVideoClass");
const videoModal = document.querySelector("#videoModal");
const videoModalFrame = document.querySelector("#videoModalFrame");
const videoModalLabel = document.querySelector("#videoModalLabel");
const invitationForm = document.querySelector("#invitationForm");
const studentInvitations = document.querySelector("#studentInvitations");
const studentInvitationClass = document.querySelector("#studentInvitationClass");
const enrollmentRequests = document.querySelector("#enrollmentRequests");

const classroomTitles = {
  ict: "ICT OJT Classroom",
  css: "Computer Systems Servicing",
  all: "All Classrooms"
};

const selectedClassroom = new URLSearchParams(window.location.search).get("classroom") || "ict";
const selectedClassroomTitle = classroomTitles[selectedClassroom];

const demoAnnouncements = [
  {
    id: "demo-ict-pinned",
    classroom: "ict",
    subject: "OJT Onboarding Essentials",
    message: "Please complete your onboarding checklist before Friday.",
    pinned: true,
    createdAt: "2026-06-11T08:00:00.000Z"
  },
  {
    id: "demo-css-safety",
    classroom: "css",
    subject: "Safety and Compliance",
    message: "Bring your lab tools and review the safety reminders before class.",
    pinned: false,
    createdAt: "2026-06-11T09:00:00.000Z"
  }
];

const demoVideos = [
  {
    id: "demo-video-ict",
    classroom: "ict",
    title: "OJT Orientation Walkthrough",
    youtubeId: "dQw4w9WgXcQ",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: "2026-06-11T10:00:00.000Z"
  }
];

const demoInvitations = [
  {
    id: "demo-invite-ict",
    classroom: "ict",
    title: "ICT OJT Classroom Enrollment",
    link: "https://globaltechnohub.example/invite/ict-ojt",
    createdAt: "2026-06-11T11:00:00.000Z"
  }
];

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

dashboardBackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "index.html";
  });
});

courseSearchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = form.querySelector("input[type='search']").value.trim().toLowerCase();
    if (!query) return;

    const cards = Array.from(document.querySelectorAll(".course-card"));
    const match = cards.find((card) => {
      const title = card.querySelector("h3")?.textContent.trim().toLowerCase() || "";
      return title.includes(query);
    });

    cards.forEach((card) => card.classList.remove("course-search-match"));

    if (!match) {
      form.querySelector("input[type='search']").classList.add("is-invalid");
      setTimeout(() => {
        form.querySelector("input[type='search']").classList.remove("is-invalid");
      }, 1200);
      return;
    }

    match.classList.remove("d-none");
    match.scrollIntoView({ behavior: "smooth", block: "center" });
    match.classList.add("course-search-match");

    setTimeout(() => {
      match.classList.remove("course-search-match");
    }, 2200);
  });
});

function getStoredItems(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function saveStoredItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function renderAnnouncementCard(announcement) {
  const article = document.createElement("article");
  article.className = "announcement-item";
  if (announcement.pinned) article.classList.add("announcement-pinned");

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 align-items-center mb-2";

  if (announcement.pinned) {
    const pinned = document.createElement("span");
    pinned.className = "badge text-bg-warning";
    pinned.textContent = "Pinned";
    meta.appendChild(pinned);
  }

  const classroom = document.createElement("span");
  classroom.className = "badge text-bg-info";
  classroom.textContent = classroomTitles[announcement.classroom] || "Classroom";
  meta.appendChild(classroom);

  const time = document.createElement("small");
  time.className = "text-secondary";
  time.textContent = formatDate(announcement.createdAt);
  meta.appendChild(time);

  const subject = document.createElement("h3");
  subject.className = "h6 mb-1";
  subject.textContent = announcement.subject;

  const message = document.createElement("p");
  message.className = "mb-0 text-secondary";
  message.textContent = announcement.message;

  article.append(meta, subject, message);
  return article;
}

function getAnnouncements() {
  const stored = getStoredItems("gthAnnouncements", null);
  if (stored) return stored;

  saveStoredItems("gthAnnouncements", demoAnnouncements);
  return demoAnnouncements;
}

function renderAnnouncements() {
  const announcements = getAnnouncements().sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (adminAnnouncements) {
    adminAnnouncements.replaceChildren();
    announcements.forEach((announcement) => {
      adminAnnouncements.appendChild(renderAnnouncementCard(announcement));
    });
  }

  if (studentAnnouncements) {
    const classroomAnnouncements = announcements.filter((announcement) => {
      return announcement.classroom === selectedClassroom || announcement.classroom === "all";
    });

    studentAnnouncements.replaceChildren();
    if (studentAnnouncementClass) studentAnnouncementClass.textContent = selectedClassroomTitle;

    if (!classroomAnnouncements.length) {
      const empty = document.createElement("p");
      empty.className = "text-secondary mb-0";
      empty.textContent = "No announcements for this classroom yet.";
      studentAnnouncements.appendChild(empty);
      return;
    }

    classroomAnnouncements.forEach((announcement) => {
      studentAnnouncements.appendChild(renderAnnouncementCard(announcement));
    });
  }
}

announcementForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const announcements = getAnnouncements();
  const announcement = {
    id: `announcement-${Date.now()}`,
    classroom: document.querySelector("#announcementClassroom").value,
    subject: document.querySelector("#announcementSubject").value,
    message: document.querySelector("#announcementMessage").value.trim(),
    pinned: document.querySelector("#announcementPinned").checked,
    createdAt: new Date().toISOString()
  };

  if (!announcement.message) return;

  announcements.unshift(announcement);
  saveStoredItems("gthAnnouncements", announcements);
  announcementForm.reset();
  renderAnnouncements();
});

function getActiveChatClassroom() {
  if (chatClassroom) return chatClassroom.value;
  return selectedClassroom;
}

function getChatMessages() {
  return getStoredItems("gthChatMessages", []);
}

function renderChatMessages() {
  if (!chatMessages) return;

  const activeClassroom = getActiveChatClassroom();
  const messages = getChatMessages().filter((message) => message.classroom === activeClassroom);
  chatMessages.replaceChildren();

  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "text-secondary small mb-0";
    empty.textContent = "No messages yet.";
    chatMessages.appendChild(empty);
    return;
  }

  messages.slice(-20).forEach((message) => {
    const item = document.createElement("div");
    item.className = "chat-message";

    const meta = document.createElement("small");
    meta.className = "text-secondary d-block";
    meta.textContent = `${message.author} · ${formatDate(message.createdAt)}`;

    const text = document.createElement("p");
    text.className = "mb-0";
    text.textContent = message.text;

    item.append(meta, text);
    chatMessages.appendChild(item);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatClassroom?.addEventListener("change", renderChatMessages);

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = chatMessage.value.trim();
  if (!text) return;

  const messages = getChatMessages();
  messages.push({
    id: `chat-${Date.now()}`,
    classroom: getActiveChatClassroom(),
    author: chatbox?.dataset.role === "admin" ? "Admin" : "Student",
    text,
    createdAt: new Date().toISOString()
  });

  saveStoredItems("gthChatMessages", messages);
  chatMessage.value = "";
  renderChatMessages();
});

chatToggle?.addEventListener("click", () => {
  chatbox?.classList.toggle("chatbox-collapsed");
  chatToggle.textContent = chatbox?.classList.contains("chatbox-collapsed") ? "Open" : "Minimize";
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

if (selectedClassroomTitle) {
  if (classroomName) classroomName.textContent = selectedClassroomTitle;
  if (classroomLabel) classroomLabel.textContent = selectedClassroomTitle;
}

renderAnnouncements();
renderChatMessages();
