/* =====================================================================
   UNIT II / V: JavaScript and Client-Side Programming
   Student Web Portal — Internet Programming Lab
   Every function below is commented with the syllabus topic it covers.
   ===================================================================== */

/* UNIT II: Variables and data types (const/let, string, number, boolean, array, object) */
const API_BASE = "php/"; // string
const QUIZ_QUESTION_COUNT = 10; // number
let currentTheme = "light"; // string, mutable
let isMenuOpen = false; // boolean

/* Run everything after the DOM is ready — UNIT II: Event handling (DOMContentLoaded) */
document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initThemeToggle();
    initClock();
    initCssPlayground();
    initDragAndDrop();
    initJsValidationForm();
    initInteractiveTable();
    initRegistrationForm();
    initQuiz();
    initAjaxSearch();
    initAjaxDemo();
    initXmlFeed();
    initWebServiceDemo();
    initSessionDemo();
    initContactForm();
    initModal();
    document.getElementById("footerYear").textContent = new Date().getFullYear();
});

/* =====================================================================
   1. NAVIGATION — smooth scroll active-link highlighting + mobile menu
   UNIT II: DOM manipulation, event handling
   ===================================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll(".main-nav a");
    const sections = Array.from(navLinks)
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    // UNIT II: Event handling — highlight nav link matching the visible section
    function onScroll() {
        let currentId = sections[0] ? sections[0].id : "";
        const scrollPos = window.scrollY + 120;
        sections.forEach((sec) => {
            if (sec.offsetTop <= scrollPos) currentId = sec.id;
        });
        navLinks.forEach((link) => {
            link.classList.toggle("active-link", link.getAttribute("href") === "#" + currentId);
        });
    }
    window.addEventListener("scroll", onScroll);
    onScroll();

    // Mobile hamburger toggle — UNIT II: DHTML (showing/hiding elements dynamically)
    const hamburger = document.getElementById("hamburger");
    const mainNav = document.getElementById("mainNav");
    hamburger.addEventListener("click", function () {
        isMenuOpen = !isMenuOpen;
        mainNav.classList.toggle("nav-open", isMenuOpen);
        hamburger.setAttribute("aria-expanded", String(isMenuOpen));
    });
    navLinks.forEach((link) =>
        link.addEventListener("click", function () {
            isMenuOpen = false;
            mainNav.classList.remove("nav-open");
        })
    );
}

/* =====================================================================
   2. THEME SWITCHER — light/dark mode toggle
   UNIT II: DOM manipulation, event handling
   ===================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");
    const statusTheme = document.getElementById("statusTheme");

    toggleBtn.addEventListener("click", function () {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        document.body.classList.toggle("theme-dark", currentTheme === "dark");
        icon.innerHTML = currentTheme === "dark" ? "&#9788;" : "&#9789;";
        if (statusTheme) statusTheme.textContent = currentTheme;
        // Persist the choice for this browser session (UNIT III concept: client-side storage)
        try {
            localStorage.setItem("ip-portal-theme", currentTheme);
        } catch (e) {
            console.warn("Could not persist theme preference:", e);
        }
    });

    // Restore a previously saved theme, if any
    try {
        const saved = localStorage.getItem("ip-portal-theme");
        if (saved === "dark") toggleBtn.click();
    } catch (e) {
        /* localStorage may be unavailable (e.g. privacy mode) — fail silently */
    }
}

/* =====================================================================
   3. DIGITAL CLOCK — UNIT II: Date object
   ===================================================================== */
function initClock() {
    const timeEl = document.getElementById("clockTime");
    const dateEl = document.getElementById("clockDate");
    const statusJs = document.getElementById("statusJs");
    if (statusJs) statusJs.textContent = "running";

    function tick() {
        const now = new Date(); // UNIT II: Date object
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        timeEl.textContent = `${hh}:${mm}:${ss}`;

        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        dateEl.textContent = now.toLocaleDateString(undefined, options);
    }
    tick();
    setInterval(tick, 1000);
}

/* =====================================================================
   4. CSS3 PLAYGROUND — Activity 2
   UNIT II: DOM manipulation editing inline styles based on form controls
   ===================================================================== */
function initCssPlayground() {
    const preview = document.getElementById("pgPreview");
    const bgColor = document.getElementById("pgBgColor");
    const textColor = document.getElementById("pgTextColor");
    const radius = document.getElementById("pgRadius");
    const radiusVal = document.getElementById("pgRadiusVal");
    const shadow = document.getElementById("pgShadow");
    const shadowVal = document.getElementById("pgShadowVal");
    const fontSize = document.getElementById("pgFontSize");
    const fontSizeVal = document.getElementById("pgFontSizeVal");
    const borderStyle = document.getElementById("pgBorderStyle");
    const resetBtn = document.getElementById("pgReset");

    function applyStyles() {
        preview.style.background = bgColor.value;
        preview.style.color = textColor.value;
        preview.style.borderRadius = radius.value + "px";
        preview.style.boxShadow = `0 ${Math.round(shadow.value / 2)}px ${shadow.value}px rgba(0,0,0,0.25)`;
        preview.style.fontSize = fontSize.value + "px";
        preview.style.borderStyle = borderStyle.value;
        radiusVal.textContent = radius.value;
        shadowVal.textContent = shadow.value;
        fontSizeVal.textContent = fontSize.value;
    }

    [bgColor, textColor, radius, shadow, fontSize, borderStyle].forEach((el) =>
        el.addEventListener("input", applyStyles)
    );

    resetBtn.addEventListener("click", function () {
        bgColor.value = "#fdf6ec";
        textColor.value = "#1b2a4a";
        radius.value = 12;
        shadow.value = 10;
        fontSize.value = 18;
        borderStyle.value = "solid";
        applyStyles();
    });

    applyStyles();
}

/* =====================================================================
   5. DRAG AND DROP — Activity 5 (native HTML5 Drag and Drop API)
   ===================================================================== */
function initDragAndDrop() {
    const items = document.querySelectorAll(".dnd-item");
    const targets = document.querySelectorAll(".dnd-target");
    const feedback = document.getElementById("dndFeedback");
    const resetBtn = document.getElementById("dndReset");
    const sourceContainer = document.getElementById("dndSource");
    let placedCount = 0;

    items.forEach((item) => {
        item.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("text/plain", item.id);
            e.dataTransfer.effectAllowed = "move";
            item.classList.add("dragging");
        });
        item.addEventListener("dragend", function () {
            item.classList.remove("dragging");
        });
    });

    targets.forEach((target) => {
        target.addEventListener("dragover", function (e) {
            e.preventDefault(); // required to allow a drop
            target.classList.add("drag-over");
        });
        target.addEventListener("dragleave", function () {
            target.classList.remove("drag-over");
        });
        target.addEventListener("drop", function (e) {
            e.preventDefault();
            target.classList.remove("drag-over");
            const id = e.dataTransfer.getData("text/plain");
            const item = document.getElementById(id);
            if (!item) return;

            const isCorrect = item.dataset.answer === target.dataset.category;
            target.appendChild(item);
            item.setAttribute("draggable", "false");
            item.style.cursor = "default";

            if (isCorrect) {
                target.classList.add("correct-drop");
                placedCount++;
                feedback.textContent = `Correct! "${item.textContent}" belongs here.`;
                feedback.className = "feedback success";
            } else {
                feedback.textContent = `Not quite — "${item.textContent}" belongs in the other category. Try dragging it again.`;
                feedback.className = "feedback error";
                item.setAttribute("draggable", "true"); // allow retry
            }

            if (placedCount === items.length) {
                feedback.textContent = "All items matched correctly! Great job.";
            }
        });
    });

    resetBtn.addEventListener("click", function () {
        items.forEach((item) => {
            sourceContainer.appendChild(item);
            item.setAttribute("draggable", "true");
            item.style.cursor = "grab";
        });
        targets.forEach((t) => t.classList.remove("correct-drop"));
        placedCount = 0;
        feedback.textContent = "";
        feedback.className = "feedback";
    });
}

/* =====================================================================
   6. JS VALIDATION PLAYGROUND — Activity 3
   UNIT II: Regular expressions, functions, try/catch exception handling
   ===================================================================== */
function initJsValidationForm() {
    // UNIT II: Regular expressions for each field type
    const PATTERNS = {
        name: /^[A-Za-z][A-Za-z\s.'-]{2,49}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        phone: /^[6-9]\d{9}$/, // Indian-style 10 digit mobile number starting 6-9
        password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    };

    function validateField(value, pattern, fieldName) {
        // UNIT II: try/catch exception handling
        try {
            if (!value || value.trim() === "") {
                throw new Error(`${fieldName} cannot be empty.`);
            }
            if (!pattern.test(value)) {
                throw new Error(`${fieldName} format looks incorrect.`);
            }
            return { valid: true, message: `${fieldName} looks good.` };
        } catch (err) {
            return { valid: false, message: err.message };
        }
    }

    function bindLiveValidation(inputId, msgId, pattern, label) {
        const input = document.getElementById(inputId);
        const msg = document.getElementById(msgId);
        input.addEventListener("input", function () {
            const result = validateField(input.value, pattern, label);
            msg.textContent = result.message;
            msg.className = "hint " + (result.valid ? "ok" : "error");
            input.classList.toggle("input-valid", result.valid);
            input.classList.toggle("input-error", !result.valid);
        });
    }

    bindLiveValidation("valName", "valNameMsg", PATTERNS.name, "Name");
    bindLiveValidation("valEmail", "valEmailMsg", PATTERNS.email, "Email");
    bindLiveValidation("valPhone", "valPhoneMsg", PATTERNS.phone, "Phone number");
    bindLiveValidation("valPassword", "valPasswordMsg", PATTERNS.password, "Password");

    // Date of birth: must be a real past date and imply age >= 15
    const dobInput = document.getElementById("valDob");
    const dobMsg = document.getElementById("valDobMsg");
    dobInput.addEventListener("change", function () {
        try {
            if (!dobInput.value) throw new Error("Please choose a date of birth.");
            const dob = new Date(dobInput.value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
            if (dob > today) throw new Error("Date of birth cannot be in the future.");
            if (age < 15) throw new Error("You must be at least 15 years old.");
            dobMsg.textContent = `Looks good — age ${age}.`;
            dobMsg.className = "hint ok";
        } catch (err) {
            dobMsg.textContent = err.message;
            dobMsg.className = "hint error";
        }
    });

    // UNIT II: Character counter (Activity — DOM + event handling)
    const bio = document.getElementById("valBio");
    const bioCount = document.getElementById("valBioCount");
    bio.addEventListener("input", function () {
        bioCount.textContent = `${bio.value.length} / 120`;
    });
}

/* =====================================================================
   7. INTERACTIVE TABLE — search/filter + sorting
   UNIT II: Arrays and objects, JSON data, DOM manipulation
   ===================================================================== */
function initInteractiveTable() {
    // UNIT II: Array of objects acting as an in-memory JSON dataset
    const students = [
        { name: "Aditi Sharma", course: "Internet Programming", gender: "Female", year: 2 },
        { name: "Rohan Verma", course: "Data Structures", gender: "Male", year: 1 },
        { name: "Sneha Iyer", course: "Database Systems", gender: "Female", year: 3 },
        { name: "Karan Mehta", course: "Computer Networks", gender: "Male", year: 2 },
        { name: "Priya Nair", course: "Internet Programming", gender: "Female", year: 1 },
        { name: "Arjun Rao", course: "Operating Systems", gender: "Male", year: 3 },
        { name: "Meera Das", course: "Internet Programming", gender: "Female", year: 2 },
        { name: "Vikram Singh", course: "Data Structures", gender: "Male", year: 1 },
    ];

    const tbody = document.getElementById("jsFilterTableBody");
    const filterInput = document.getElementById("tableFilter");
    const headers = document.querySelectorAll("#jsFilterTable thead th");
    let sortKey = null;
    let sortAsc = true;

    function render(data) {
        tbody.innerHTML = ""; // UNIT II: DOM manipulation — clearing and rebuilding rows
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="muted">No matching records.</td></tr>`;
            return;
        }
        data.forEach((s) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.course)}</td><td>${escapeHtml(s.gender)}</td><td>${s.year}</td>`;
            tbody.appendChild(tr);
        });
    }

    function applyFilterAndSort() {
        const q = filterInput.value.trim().toLowerCase();
        let data = students.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.course.toLowerCase().includes(q) ||
                s.gender.toLowerCase().includes(q)
        );
        if (sortKey) {
            data = data.slice().sort((a, b) => {
                if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
                if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
                return 0;
            });
        }
        render(data);
    }

    filterInput.addEventListener("input", applyFilterAndSort);
    headers.forEach((th) => {
        th.addEventListener("click", function () {
            const key = th.dataset.key;
            sortAsc = sortKey === key ? !sortAsc : true;
            sortKey = key;
            applyFilterAndSort();
        });
    });

    render(students);
}

/* Utility: escape HTML to avoid injecting markup from user-controlled strings */
function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
}

/* =====================================================================
   8. REGISTRATION FORM — Activity 1
   UNIT II: Form validation, event handling, fetch/AJAX, JSON
   UNIT III/V: talks to php/register.php
   ===================================================================== */
function initRegistrationForm() {
    const form = document.getElementById("registrationForm");
    const feedback = document.getElementById("regFeedback");
    const experienceRange = document.getElementById("regExperience");
    const experienceOut = document.getElementById("regExperienceVal");

    experienceRange.addEventListener("input", function () {
        experienceOut.textContent = experienceRange.value;
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // UNIT II: prevent full-page reload — this IS the "no refresh" requirement

        const errors = clientValidateRegistration(form);
        if (errors.length > 0) {
            feedback.textContent = errors.join(" ");
            feedback.className = "feedback error";
            return;
        }

        const formData = new FormData(form);
        // Interests checkboxes come through as multiple 'interests[]' entries automatically.

        feedback.textContent = "Submitting to server…";
        feedback.className = "feedback";

        try {
            // UNIT V: fetch() performing an AJAX-style asynchronous POST request
            const response = await fetch(API_BASE + "register.php", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Server responded with status " + response.status);
            const result = await response.json(); // UNIT II/IV: parsing JSON response

            if (result.status === "success") {
                feedback.textContent = "✔ " + result.message;
                feedback.className = "feedback success";
                form.reset();
                experienceOut.textContent = "5";
            } else {
                feedback.textContent = "✘ " + (result.message || "Registration failed.");
                feedback.className = "feedback error";
            }
        } catch (err) {
            // Fallback so the demo still works if PHP/MySQL isn't running (e.g. static preview)
            console.warn("Falling back to client-only simulation:", err.message);
            feedback.textContent =
                "✔ (Offline demo mode) Form validated successfully. Connect this to a running PHP/MySQL server to persist real data.";
            feedback.className = "feedback success";
            form.reset();
            experienceOut.textContent = "5";
        }
    });
}

function clientValidateRegistration(form) {
    const errors = [];
    const name = form.querySelector("#regName").value.trim();
    const email = form.querySelector("#regEmail").value.trim();
    const phone = form.querySelector("#regPhone").value.trim();
    const password = form.querySelector("#regPassword").value;
    const dob = form.querySelector("#regDob").value;
    const gender = form.querySelector('input[name="gender"]:checked');
    const course = form.querySelector("#regCourse").value;

    if (name.length < 3) errors.push("Name must be at least 3 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push("Enter a valid email.");
    if (!/^\d{10}$/.test(phone)) errors.push("Phone must be exactly 10 digits.");
    if (password.length < 8) errors.push("Password must be at least 8 characters.");
    if (!dob) errors.push("Date of birth is required.");
    if (!gender) errors.push("Please select a gender.");
    if (!course) errors.push("Please select a course.");
    return errors;
}

/* =====================================================================
   9. QUIZ — Activity 4
   UNIT II: Arrays/objects, functions, DOM manipulation, event handling
   UNIT V: fetch/AJAX to store result in MySQL via php/quiz.php
   ===================================================================== */
const QUIZ_QUESTIONS = [
    { q: "What does HTML stand for?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HyperText Markdown Language", "Home Tool Markup Language"], correct: 1 },
    { q: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "foreground"], correct: 2 },
    { q: "Which HTML5 tag is used to embed video?", options: ["<media>", "<video>", "<movie>", "<film>"], correct: 1 },
    { q: "Which symbol is used for CSS class selectors?", options: ["#", ".", "*", "&"], correct: 1 },
    { q: "Which JavaScript method converts a JSON string into an object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "JSON.convert()"], correct: 0 },
    { q: "Which PHP superglobal holds submitted form data via POST?", options: ["$_GET", "$_POST", "$_FORM", "$_REQUEST_DATA"], correct: 1 },
    { q: "In AJAX, which object was traditionally used before fetch()?", options: ["XMLHttpRequest", "HttpConnection", "AjaxRequest", "WebSocket"], correct: 0 },
    { q: "Which SQL statement inserts a new row?", options: ["ADD ROW", "INSERT INTO", "CREATE ROW", "NEW RECORD"], correct: 1 },
    { q: "Which HTTP method is typically used to fetch data without side effects?", options: ["POST", "DELETE", "GET", "PUT"], correct: 2 },
    { q: "XML stands for:", options: ["eXtra Markup Language", "eXtensible Markup Language", "eXecutable Markup Language", "eXternal Markup Language"], correct: 1 },
];

let quizUserAnswers = new Array(QUIZ_QUESTION_COUNT).fill(null);

function initQuiz() {
    const quizForm = document.getElementById("quizForm");
    renderQuiz();

    document.getElementById("quizSubmitBtn").addEventListener("click", submitQuiz);
    document.getElementById("quizResetBtn").addEventListener("click", function () {
        quizUserAnswers = new Array(QUIZ_QUESTION_COUNT).fill(null);
        document.getElementById("quizResult").hidden = true;
        document.getElementById("quizStudentName").value = "";
        renderQuiz();
    });

    function renderQuiz() {
        quizForm.innerHTML = "";
        QUIZ_QUESTIONS.forEach((item, qIndex) => {
            const qDiv = document.createElement("div");
            qDiv.className = "quiz-question";
            qDiv.innerHTML = `<h4>${qIndex + 1}. ${escapeHtml(item.q)}</h4>`;
            const optWrap = document.createElement("div");
            optWrap.className = "quiz-options";

            item.options.forEach((opt, optIndex) => {
                const optEl = document.createElement("label");
                optEl.className = "quiz-option";
                optEl.innerHTML = `<input type="radio" name="q${qIndex}" value="${optIndex}"> <span>${escapeHtml(opt)}</span>`;
                optEl.querySelector("input").addEventListener("change", function () {
                    quizUserAnswers[qIndex] = optIndex;
                    optWrap.querySelectorAll(".quiz-option").forEach((el) => el.classList.remove("selected"));
                    optEl.classList.add("selected");
                });
                optWrap.appendChild(optEl);
            });
            qDiv.appendChild(optWrap);
            quizForm.appendChild(qDiv);
        });
    }
}

async function submitQuiz() {
    const nameInput = document.getElementById("quizStudentName");
    const resultBox = document.getElementById("quizResult");
    const unanswered = quizUserAnswers.filter((a) => a === null).length;

    if (!nameInput.value.trim()) {
        alert("Please enter your name before submitting the quiz.");
        nameInput.focus();
        return;
    }
    if (unanswered > 0 && !confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) {
        return;
    }

    // UNIT II: score calculation using array iteration
    let score = 0;
    const optionEls = document.querySelectorAll(".quiz-option");
    QUIZ_QUESTIONS.forEach((item, qIndex) => {
        const isCorrect = quizUserAnswers[qIndex] === item.correct;
        if (isCorrect) score++;
        // Reveal correct/wrong answers visually
        const group = document.querySelectorAll(`input[name="q${qIndex}"]`);
        group.forEach((input, optIndex) => {
            const label = input.closest(".quiz-option");
            if (optIndex === item.correct) label.classList.add("correct-answer");
            else if (optIndex === quizUserAnswers[qIndex]) label.classList.add("wrong-answer");
        });
    });

    const percentage = Math.round((score / QUIZ_QUESTION_COUNT) * 100);
    resultBox.hidden = false;
    resultBox.innerHTML = `
        <p class="quiz-score-big">${score} / ${QUIZ_QUESTION_COUNT}</p>
        <p>Score: <strong>${percentage}%</strong></p>
        <p id="quizSaveStatus" class="feedback">Saving result…</p>
    `;
    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });

    const saveStatus = document.getElementById("quizSaveStatus");
    const payload = {
        student_name: nameInput.value.trim(),
        score: score,
        total_questions: QUIZ_QUESTION_COUNT,
    };

    try {
        // UNIT V: AJAX request storing quiz result in MySQL via PHP
        const response = await fetch(API_BASE + "quiz.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.status === "success") {
            saveStatus.textContent = "✔ Result saved to the database.";
            saveStatus.className = "feedback success";
        } else {
            throw new Error(result.message || "Server rejected the result.");
        }
    } catch (err) {
        console.warn("Quiz save fallback:", err.message);
        saveStatus.textContent = "✔ (Offline demo mode) Score calculated locally. Connect PHP/MySQL to persist results.";
        saveStatus.className = "feedback success";
    }
}

/* =====================================================================
   10. AJAX SEARCH — Activity 6
   UNIT V: XMLHttpRequest/fetch, callback functions, JSON, database-driven AJAX
   ===================================================================== */
function initAjaxSearch() {
    const input = document.getElementById("ajaxSearchInput");
    const status = document.getElementById("ajaxSearchStatus");
    const body = document.getElementById("ajaxResultsBody");
    const showAllBtn = document.getElementById("ajaxShowAllBtn");
    let debounceTimer = null;

    // Local fallback dataset mirrors the `students` table shape, used if PHP/MySQL is unavailable
    const fallbackData = [
        { name: "Aditi Sharma", email: "aditi@example.com", course: "Internet Programming", created_at: "2026-07-01" },
        { name: "Rohan Verma", email: "rohan@example.com", course: "Data Structures", created_at: "2026-07-03" },
        { name: "Sneha Iyer", email: "sneha@example.com", course: "Database Systems", created_at: "2026-07-05" },
    ];

    function renderResults(rows) {
        if (!rows || rows.length === 0) {
            body.innerHTML = `<tr><td colspan="4" class="muted">No matching records found.</td></tr>`;
            return;
        }
        body.innerHTML = rows
            .map(
                (r) =>
                    `<tr><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.email)}</td><td>${escapeHtml(r.course)}</td><td>${escapeHtml(r.created_at || "")}</td></tr>`
            )
            .join("");
    }

    // UNIT V: search using XMLHttpRequest explicitly, to demonstrate the raw API alongside fetch()
    function searchViaXHR(term, callback) {
        const xhr = new XMLHttpRequest();
        const url = `${API_BASE}search.php?term=${encodeURIComponent(term)}`;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        callback(null, data);
                    } catch (e) {
                        callback(e, null);
                    }
                } else {
                    callback(new Error("HTTP " + xhr.status), null);
                }
            }
        };
        xhr.onerror = function () {
            callback(new Error("Network error"), null);
        };
        xhr.send();
    }

    input.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        const term = input.value.trim();
        status.textContent = "";
        if (term.length === 0) {
            body.innerHTML = `<tr><td colspan="4" class="muted">Type above to search, or click "Show all" to load every record.</td></tr>`;
            return;
        }
        status.textContent = "Searching…";
        debounceTimer = setTimeout(function () {
            searchViaXHR(term, function (err, data) {
                if (err) {
                    // Fallback: filter the local dataset client-side
                    const filtered = fallbackData.filter(
                        (r) =>
                            r.name.toLowerCase().includes(term.toLowerCase()) ||
                            r.email.toLowerCase().includes(term.toLowerCase()) ||
                            r.course.toLowerCase().includes(term.toLowerCase())
                    );
                    status.textContent = `(Offline demo mode) ${filtered.length} result(s) from sample data.`;
                    renderResults(filtered);
                } else {
                    status.textContent = `${data.count !== undefined ? data.count : (data.results || []).length} result(s) found on the server.`;
                    renderResults(data.results || data);
                }
            });
        }, 350); // debounce so we don't spam the server on every keystroke
    });

    showAllBtn.addEventListener("click", async function () {
        status.textContent = "Loading all records…";
        try {
            const response = await fetch(API_BASE + "search.php?term=");
            if (!response.ok) throw new Error("HTTP " + response.status);
            const data = await response.json();
            renderResults(data.results || data);
            status.textContent = `Loaded ${(data.results || data).length} record(s) from the server.`;
        } catch (err) {
            renderResults(fallbackData);
            status.textContent = "(Offline demo mode) Showing sample data — connect PHP/MySQL for live records.";
        }
    });
}

/* =====================================================================
   11. AJAX REQUEST/RESPONSE DEMO
   UNIT V: making the client↔server exchange visible
   ===================================================================== */
function initAjaxDemo() {
    const btn = document.getElementById("ajaxDemoBtn");
    const reqBlock = document.getElementById("ajaxDemoRequest");
    const resBlock = document.getElementById("ajaxDemoResponse");

    btn.addEventListener("click", async function () {
        const url = API_BASE + "api.php?resource=students";
        reqBlock.textContent = `GET ${url} HTTP/1.1\nHost: localhost\nAccept: application/json`;
        resBlock.textContent = "Waiting for response…";
        try {
            const response = await fetch(url);
            const text = await response.text();
            let pretty;
            try {
                pretty = JSON.stringify(JSON.parse(text), null, 2);
            } catch (e) {
                pretty = text;
            }
            resBlock.textContent = `HTTP/1.1 ${response.status} ${response.statusText}\nContent-Type: application/json\n\n${pretty}`;
        } catch (err) {
            resBlock.textContent =
                `HTTP/1.1 200 OK (simulated — offline demo mode)\nContent-Type: application/json\n\n` +
                JSON.stringify(
                    { status: "success", resource: "students", note: "Connect PHP/MySQL for a live response", count: 3 },
                    null,
                    2
                );
        }
    });
}

/* =====================================================================
   12. XML COURSE FEED — Activity 7
   UNIT IV: XML parsing via DOMParser, elements & attributes
   ===================================================================== */
function initXmlFeed() {
    const btn = document.getElementById("loadXmlBtn");
    const status = document.getElementById("xmlStatus");
    const grid = document.getElementById("xmlCourseCards");

    // Fallback XML string used only if the courses.xml file cannot be fetched
    // (e.g. opening index.html directly with file:// instead of via a server)
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<courses>
  <course id="IP101" level="core"><title>Internet Programming</title><duration>60 hrs</duration><instructor>Dr. Rao</instructor></course>
  <course id="DS102" level="core"><title>Data Structures</title><duration>50 hrs</duration><instructor>Prof. Iyer</instructor></course>
  <course id="CN103" level="elective"><title>Computer Networks</title><duration>45 hrs</duration><instructor>Dr. Sharma</instructor></course>
  <course id="DB104" level="core"><title>Database Systems</title><duration>55 hrs</duration><instructor>Prof. Nair</instructor></course>
</courses>`;

    function renderCourses(xmlDoc) {
        const courseNodes = xmlDoc.getElementsByTagName("course");
        grid.innerHTML = "";
        for (let i = 0; i < courseNodes.length; i++) {
            const node = courseNodes[i];
            // UNIT IV: reading XML attributes
            const id = node.getAttribute("id");
            const level = node.getAttribute("level");
            // UNIT IV: reading XML child elements
            const title = node.getElementsByTagName("title")[0]?.textContent || "Untitled";
            const duration = node.getElementsByTagName("duration")[0]?.textContent || "";
            const instructor = node.getElementsByTagName("instructor")[0]?.textContent || "";

            const card = document.createElement("div");
            card.className = "course-card";
            card.innerHTML = `
                <span class="badge">${escapeHtml(level || "course")}</span>
                <h4>${escapeHtml(title)}</h4>
                <p><strong>ID:</strong> ${escapeHtml(id)}</p>
                <p><strong>Duration:</strong> ${escapeHtml(duration)}</p>
                <p><strong>Instructor:</strong> ${escapeHtml(instructor)}</p>
            `;
            grid.appendChild(card);
        }
    }

    btn.addEventListener("click", async function () {
        status.textContent = "Fetching xml/courses.xml…";
        try {
            const response = await fetch("xml/courses.xml");
            if (!response.ok) throw new Error("HTTP " + response.status);
            const text = await response.text();
            const parser = new DOMParser(); // UNIT IV: DOM parsing of XML
            const xmlDoc = parser.parseFromString(text, "application/xml");
            const parseError = xmlDoc.getElementsByTagName("parsererror");
            if (parseError.length > 0) throw new Error("XML parse error");
            renderCourses(xmlDoc);
            status.textContent = `Loaded ${xmlDoc.getElementsByTagName("course").length} course(s) from courses.xml.`;
            status.className = "feedback success";
        } catch (err) {
            console.warn("XML fetch fallback:", err.message);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(fallbackXml, "application/xml");
            renderCourses(xmlDoc);
            status.textContent = "(Offline demo mode) Loaded built-in sample XML — serve via a web server to fetch the real file.";
            status.className = "feedback";
        }
    });
}

/* =====================================================================
   13. WEB SERVICE / API DEMO — Activity 8
   UNIT V: PHP-based JSON API, HTTP request/response
   ===================================================================== */
function initWebServiceDemo() {
    const select = document.getElementById("apiEndpointSelect");
    const callBtn = document.getElementById("apiCallBtn");
    const reqBlock = document.getElementById("apiRequestBlock");
    const resBlock = document.getElementById("apiResponseBlock");

    const simulated = {
        students: { status: "success", resource: "students", data: [{ id: 1, name: "Aditi Sharma", course: "Internet Programming" }, { id: 2, name: "Rohan Verma", course: "Data Structures" }] },
        courses: { status: "success", resource: "courses", data: [{ id: "IP101", title: "Internet Programming" }, { id: "DS102", title: "Data Structures" }] },
        quiz_results: { status: "success", resource: "quiz_results", data: [{ student_name: "Aditi Sharma", score: 8, total_questions: 10 }] },
    };

    callBtn.addEventListener("click", async function () {
        const resource = select.value;
        const url = `${API_BASE}api.php?resource=${resource}`;
        reqBlock.textContent = `GET ${url} HTTP/1.1\nHost: localhost\nAccept: application/json`;
        resBlock.textContent = "Calling API…";
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP " + response.status);
            const data = await response.json();
            resBlock.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
            resBlock.textContent =
                "(Offline demo mode — simulated response)\n\n" + JSON.stringify(simulated[resource], null, 2);
        }
    });
}

/* =====================================================================
   14. SESSION / COOKIE DEMO — UNIT III
   ===================================================================== */
function initSessionDemo() {
    const loginBtn = document.getElementById("sessionLoginBtn");
    const logoutBtn = document.getElementById("sessionLogoutBtn");
    const nameInput = document.getElementById("sessionName");
    const rememberCheckbox = document.getElementById("sessionRemember");
    const status = document.getElementById("sessionStatus");

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }
    function getCookie(name) {
        return document.cookie.split("; ").reduce((acc, part) => {
            const [k, v] = part.split("=");
            return k === name ? decodeURIComponent(v) : acc;
        }, null);
    }
    function eraseCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Restore from cookie on load — simulates a persistent PHP session cookie
    const existing = getCookie("ip_portal_user");
    if (existing) {
        status.textContent = `Welcome back, ${existing}! (restored from cookie, mirroring a PHP $_SESSION)`;
        status.className = "feedback success";
    }

    loginBtn.addEventListener("click", function () {
        const name = nameInput.value.trim();
        if (!name) {
            status.textContent = "Enter a name to simulate logging in.";
            status.className = "feedback error";
            return;
        }
        // sessionStorage models a server-side PHP $_SESSION (cleared when the tab closes)
        sessionStorage.setItem("ip_portal_session_user", name);
        if (rememberCheckbox.checked) {
            setCookie("ip_portal_user", name, 7); // models a persistent PHP cookie
            status.textContent = `Logged in as ${name}. A cookie was set for 7 days, and a session variable was created (see php/register.php for the equivalent server-side pattern using $_SESSION and setcookie()).`;
        } else {
            status.textContent = `Logged in as ${name} for this browser tab only (session, no cookie).`;
        }
        status.className = "feedback success";
    });

    logoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("ip_portal_session_user");
        eraseCookie("ip_portal_user");
        status.textContent = "Logged out. Session cleared and cookie erased.";
        status.className = "feedback";
    });
}

/* =====================================================================
   15. CONTACT FORM — character counter + simple validation
   ===================================================================== */
function initContactForm() {
    const form = document.getElementById("contactForm");
    const msg = document.getElementById("contactMsg");
    const msgCount = document.getElementById("contactMsgCount");
    const feedback = document.getElementById("contactFeedback");

    msg.addEventListener("input", function () {
        msgCount.textContent = `${msg.value.length} / 300`;
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        feedback.textContent = "✔ Thank you — your message has been noted (demo only, not sent anywhere).";
        feedback.className = "feedback success";
        form.reset();
        msgCount.textContent = "0 / 300";
    });
}

/* =====================================================================
   16. MODAL — used for quiz/answer detail popups where useful
   ===================================================================== */
function initModal() {
    const overlay = document.getElementById("modalOverlay");
    const closeBtn = document.getElementById("modalClose");
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal();
    });
}
function openModal(title, bodyHtml) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = bodyHtml;
    const overlay = document.getElementById("modalOverlay");
    overlay.style.setProperty('display', 'flex', 'important');
    overlay.hidden = false;
}
function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    overlay.style.setProperty('display', 'none', 'important');
    overlay.hidden = true;
}

/* =====================================================================
   ACTIVITY 10: TO-DO LIST (CRUD via AJAX)
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    loadTodos();
});

async function loadTodos() {
    try {
        const response = await fetch('php/todo.php');
        const result = await response.json();
        const list = document.getElementById("todoList");
        list.innerHTML = "";
        if (result.status === "success") {
            result.data.forEach(todo => {
                const li = document.createElement("li");
                li.style.display = "flex";
                li.style.justifyContent = "space-between";
                li.style.padding = "0.5rem 0";
                li.style.borderBottom = "1px solid var(--border-color)";
                
                const taskText = document.createElement("span");
                taskText.textContent = todo.task;
                if (todo.completed == 1) {
                    taskText.style.textDecoration = "line-through";
                    taskText.style.color = "var(--text-muted)";
                }
                
                const actions = document.createElement("div");
                const toggleBtn = document.createElement("button");
                toggleBtn.textContent = todo.completed == 1 ? "Undo" : "Done";
                toggleBtn.className = "btn btn-outline";
                toggleBtn.style.padding = "0.2rem 0.5rem";
                toggleBtn.style.marginRight = "0.5rem";
                toggleBtn.onclick = () => toggleTodo(todo.id, todo.completed == 1 ? 0 : 1);
                
                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete";
                delBtn.className = "btn btn-outline";
                delBtn.style.padding = "0.2rem 0.5rem";
                delBtn.style.color = "red";
                delBtn.style.borderColor = "red";
                delBtn.onclick = () => deleteTodo(todo.id);
                
                actions.appendChild(toggleBtn);
                actions.appendChild(delBtn);
                li.appendChild(taskText);
                li.appendChild(actions);
                list.appendChild(li);
            });
            if (result.data.length === 0) {
                list.innerHTML = "<li>No tasks found.</li>";
            }
        }
    } catch (e) {
        document.getElementById("todoList").innerHTML = "<li>Offline demo: Todo list unavailable without server.</li>";
    }
}

async function addTodo() {
    const taskInput = document.getElementById("todoTask");
    const task = taskInput.value.trim();
    if (!task) return;
    
    try {
        const response = await fetch('php/todo.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        });
        const result = await response.json();
        if (result.status === "success") {
            taskInput.value = "";
            loadTodos();
        } else {
            alert(result.message);
        }
    } catch (e) {
        alert("Failed to add task.");
    }
}

async function toggleTodo(id, completed) {
    try {
        await fetch('php/todo.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, completed })
        });
        loadTodos();
    } catch (e) {
        alert("Failed to update task.");
    }
}

async function deleteTodo(id) {
    try {
        await fetch('php/todo.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        loadTodos();
    } catch (e) {
        alert("Failed to delete task.");
    }
}
