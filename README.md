# Student Web Portal — Internet Programming Lab

A single-page academic mini-project that demonstrates the complete Internet
Programming syllabus (Units I–V) inside one connected, working web
application — not a collection of unrelated demo files.

---

## 1. Project Title

**Student Web Portal — Internet Programming Lab**

## 2. Project Objective

To design and implement a single-page web application that practically
demonstrates client-side web technologies (HTML5, CSS3, JavaScript),
server-side programming (PHP), database connectivity (MySQL), XML
processing, and AJAX-based web services — all working together as one
real student portal rather than isolated syllabus examples.

## 3. Technologies Used

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (external, internal and inline) |
| Client scripting | Vanilla JavaScript (ES6+, DOM, fetch, XMLHttpRequest) |
| Server scripting | PHP 8 (procedural, mysqli, prepared statements) |
| Database | MySQL (via XAMPP/MariaDB) |
| Data interchange | JSON, XML, XSLT |
| Local dev environment | XAMPP (Apache + MySQL + PHP) |

No frontend frameworks (React/Angular/Vue) are used, per the project brief.

## 4. Unit-wise Syllabus Mapping

| Unit | Topic | Where it appears |
|---|---|---|
| I | HTML5 semantic structure, lists, tables, forms, media, drag-and-drop | `index.html` — every section |
| I | CSS3 (external/internal/inline, cascade, inheritance, backgrounds, borders, shadows, transforms, transitions, animations, responsive design) | `css/style.css` |
| II | JavaScript — DOM, variables, functions, arrays/objects, Date, regex, try/catch, validation, events, DHTML, JSON, AJAX | `js/script.js` |
| III | PHP — variables, operators, if/else, loops, arrays, functions, form processing, server-side validation, regex, cookies, sessions, file handling, DB connectivity | `php/*.php` |
| IV | XML structure/elements/attributes, DOM parsing, XSLT concept, RSS/Atom concept | `xml/courses.xml`, `xml/courses.xsl` |
| V | AJAX client-server architecture, XMLHttpRequest, callbacks, JSON, PHP API, database-driven AJAX, SOAP concept | `php/api.php`, `php/search.php`, AJAX section of `index.html` |

## 5. Features

- Sticky navigation bar with smooth scrolling and scroll-spy active-link highlighting
- Light/dark theme switcher (persisted with `localStorage`)
- Live digital clock built on the JavaScript `Date` object
- **Activity 1 — Registration form**: full HTML5 control showcase, posts to PHP/MySQL
- **Activity 2 — CSS3 playground**: live-editable background, text color, radius, shadow, font size
- **Activity 3 — JavaScript validation**: regex-based live validation with a character counter
- **Activity 4 — 10-question quiz**: scored client-side, saved to MySQL, shows correct/wrong answers
- **Activity 5 — Drag-and-drop matching**: HTML5 native Drag and Drop API
- **Activity 6 — AJAX search**: live student/course search against MySQL (XMLHttpRequest + fetch)
- **Activity 7 — XML course feed**: `courses.xml` fetched, parsed with `DOMParser`, rendered as cards
- **Activity 8 — Web service demo**: calls `php/api.php`, shows raw HTTP request/response, explains SOAP/WSDL conceptually
- **Bonus Activity 9 — Sessions/cookies mini login demo**
- Interactive, sortable/filterable data table
- Modal dialog, hover effects, keyframe animations, fully responsive layout
- Graceful "offline demo mode": every AJAX feature still works with simulated data if PHP/MySQL isn't running, so the demo is never blocked

## 6. Database Setup

1. Install and start **XAMPP** (see section 7).
2. Open **phpMyAdmin** at `http://localhost/phpmyadmin`.
3. Create a new database or let the script create it — see section 8.
4. Import `database/database.sql`. This creates the `ip_portal` database with
   two tables (`students`, `quiz_results`) and seed data.

### Table: `students`
| Column | Type | Notes |
|---|---|---|
| id | INT, AUTO_INCREMENT, PK | |
| name | VARCHAR(100) | |
| email | VARCHAR(150), UNIQUE | |
| phone | VARCHAR(15) | |
| password | VARCHAR(255) | bcrypt hash |
| age | INT | optional |
| course | VARCHAR(100) | |
| gender | VARCHAR(10) | |
| dob | DATE | |
| interests | VARCHAR(255) | comma-separated |
| favcolor | VARCHAR(20) | |
| notes | TEXT | |
| created_at | DATETIME | default NOW() |

### Table: `quiz_results`
| Column | Type | Notes |
|---|---|---|
| id | INT, AUTO_INCREMENT, PK | |
| student_name | VARCHAR(100) | |
| score | INT | |
| total_questions | INT | |
| created_at | DATETIME | default NOW() |

## 7. How to Run the Project Using XAMPP

1. **Install XAMPP** from https://www.apachefriends.org (Windows/Linux/macOS).
2. **Copy the project folder** `internet-programming/` into your XAMPP
   `htdocs` directory, e.g. `C:\xampp\htdocs\internet-programming` (Windows)
   or `/opt/lampp/htdocs/internet-programming` (Linux).
3. **Start Apache and MySQL** — see section 9.
4. **Import the database** — see section 8.
5. **Access the application** — see section 10.

## 8. How to Import the MySQL Database

**Option A — phpMyAdmin (recommended for beginners)**
1. Go to `http://localhost/phpmyadmin`.
2. Click **Import** in the top menu.
3. Choose the file `database/database.sql`.
4. Click **Go**. This creates the `ip_portal` database automatically.

**Option B — MySQL command line**
```bash
mysql -u root -p < database/database.sql
```

If your MySQL username/password differ from the defaults, update them in
`php/db.php`:
```php
$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASS = "";
$DB_NAME = "ip_portal";
```

## 9. How to Start Apache and MySQL

1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.
4. Both rows should turn green, confirming the services are running.

## 10. How to Access the Application

Open a browser and visit:
```
http://localhost/internet-programming/index.html
```
(Do **not** open `index.html` directly with `file://` — the AJAX, PHP and
XML-fetch features require a real web server to function, which is exactly
why XAMPP's Apache is used.)

## 11. Explanation of the AJAX Flow

1. A user action (typing in the search box, submitting the registration
   form, submitting the quiz, clicking "Call API") triggers a JavaScript
   event handler in `js/script.js`.
2. JavaScript builds an HTTP request using either `fetch()` or
   `XMLHttpRequest` (both are used deliberately, in different features, so
   both syllabus APIs are demonstrated).
3. The request is sent asynchronously to a PHP file in `php/` — the page
   itself never reloads.
4. The PHP script (`register.php`, `quiz.php`, `search.php` or `api.php`)
   validates input, talks to MySQL using a **prepared statement**, and
   builds a PHP associative array of the result.
5. PHP encodes that array with `json_encode()` and echoes it as the HTTP
   response body, with `Content-Type: application/json`.
6. Back in the browser, the JavaScript callback (`.then()`/`await`, or the
   `onreadystatechange` handler for `XMLHttpRequest`) parses the JSON and
   updates the DOM — new table rows, a feedback message, or a score.

## 12. Explanation of the XML Flow

1. `xml/courses.xml` stores the master course catalogue as XML, with each
   `<course>` element carrying `id` and `level` **attributes** and nested
   `<title>`, `<duration>`, `<instructor>` and `<description>` **elements**.
2. On the client, clicking "Load courses from XML" fires a `fetch()` call
   for `xml/courses.xml`, and the response text is parsed with the
   browser's built-in `DOMParser` into a navigable XML DOM tree.
3. JavaScript walks that tree (`getElementsByTagName`, `getAttribute`) and
   renders one card per `<course>`.
4. `xml/courses.xsl` shows the same data transformed into HTML entirely
   through **XSLT** — open `courses.xml` directly in a desktop browser
   (Firefox/Edge) to see the `<?xml-stylesheet?>` processing instruction
   apply the transformation automatically, without any JavaScript.
5. On the server, `php/api.php?resource=courses` re-parses the very same
   XML file using PHP's `DOMDocument` class, so the JSON API and the XML
   feed always agree — this shows XML acting as a shared data source for
   both a browser-side and a server-side consumer, mirroring how RSS/Atom
   feeds are consumed by many different readers.

## 13. Explanation of the PHP/MySQL Flow

1. `php/db.php` centralizes the MySQL connection (`mysqli`) and two helper
   functions: `sanitizeInput()` for cleaning user input, and
   `jsonResponse()` for consistent JSON output.
2. `php/register.php` receives `$_POST` data, validates it (length checks,
   `preg_match` regular expressions, `in_array` whitelist checks), hashes
   the password with `password_hash()`, and inserts a new row into
   `students` using a **prepared statement** (`bind_param`) — this is what
   prevents SQL injection. It also starts a PHP session (`$_SESSION`) and
   sets a cookie (`setcookie()`) to demonstrate Unit III's sessions/cookies
   topic in a real code path, not just a toy example.
3. `php/quiz.php` reads a raw JSON body (`file_get_contents("php://input")`,
   `json_decode`), validates the score, and inserts it into `quiz_results`.
4. `php/search.php` builds a `LIKE '%term%'` prepared statement across
   `name`, `email` and `course`, loops over the `mysqli_result` with a
   `while` loop, and returns the matches as a JSON array.
5. `php/api.php` is the "web service" endpoint: a single file that branches
   on a `resource` query parameter (`students`, `courses`, `quiz_results`)
   and returns the corresponding data as JSON, standing in for a small
   REST API a real client application could consume.

## 14. Viva Questions and Answers

1. **Q: What is the difference between HTML and HTML5?**
   A: HTML5 adds semantic elements (`<header>`, `<nav>`, `<section>`,
   `<article>`, `<aside>`, `<footer>`), native audio/video support, new
   form input types (date, color, range, email, number), and APIs like
   Drag-and-Drop and Canvas, without needing plugins.

2. **Q: What is the CSS cascade?**
   A: The mechanism by which the browser decides which rule "wins" when
   multiple CSS rules target the same element — based on origin,
   specificity, and source order. Inline styles beat internal/embedded
   CSS, which beats external CSS of equal specificity, unless `!important`
   or higher specificity selectors intervene.

3. **Q: What is CSS inheritance? Give an example from this project.**
   A: Certain CSS properties (like `font-family` and `color`) pass down
   from a parent element to its children unless overridden. In this
   project, `body { font-family: var(--font-body); }` cascades down to
   every paragraph and span automatically.

4. **Q: Why use `fetch()`/`XMLHttpRequest` instead of a normal form submit?**
   A: Both send an HTTP request in the background and let JavaScript
   handle the response, so the page does not reload — this is the core
   idea of AJAX, and it's what allows the registration, search, and quiz
   features to update instantly.

5. **Q: What is JSON and why is it used here instead of XML for AJAX responses?**
   A: JSON (JavaScript Object Notation) is a lightweight text format that
   maps directly onto JavaScript objects/arrays, so it needs no parsing
   library on the client (`JSON.parse`/`response.json()`). XML is used
   in this project specifically for Unit IV's syllabus topic (the course
   feed), while JSON is used for the Unit V AJAX/web-service topic —
   showing both formats in the same project.

6. **Q: What is a prepared statement, and why is it used in every PHP query here?**
   A: A prepared statement separates the SQL structure from user-supplied
   values (`?` placeholders bound with `bind_param`), so the database
   driver escapes the values automatically. This prevents SQL injection,
   unlike concatenating raw `$_POST` values directly into a SQL string.

7. **Q: What is the difference between a PHP session and a cookie?**
   A: A cookie is a small piece of data stored in the user's browser and
   sent with every request to the same domain. A PHP session stores data
   **on the server**, keyed by a session ID that is usually itself sent
   to the browser via a cookie (`PHPSESSID`). In `register.php`,
   `$_SESSION` holds the logged-in student's ID/name server-side, while
   `setcookie()` separately remembers the student's name in the browser.

8. **Q: What does `mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT)` do?**
   A: It makes the `mysqli` extension throw exceptions on database errors
   instead of just emitting a PHP warning, which lets the code use
   `try/catch` for structured error handling.

9. **Q: What is the difference between `GET` and `POST` in this project?**
   A: `GET` is used for read-only, idempotent requests (searching,
   calling the API) and appears in the URL as a query string. `POST` is
   used when data is being created or changed on the server (registering
   a student, saving a quiz result) and is sent in the request body.

10. **Q: How does the drag-and-drop activity work under the hood?**
    A: It uses the native HTML5 Drag and Drop API: `draggable="true"` on
    source items, a `dragstart` handler that stores an ID via
    `event.dataTransfer.setData()`, and `dragover`/`drop` handlers on the
    target zones that call `event.preventDefault()` (required to allow a
    drop) and read the ID back with `event.dataTransfer.getData()`.

11. **Q: What is the purpose of `password_hash()` in `register.php`?**
    A: It converts the plain-text password into a one-way bcrypt hash
    before it's stored in MySQL, so even if the database were
    compromised, the original passwords could not be recovered directly.

12. **Q: What is XSLT and how is it different from CSS?**
    A: XSLT (eXtensible Stylesheet Language Transformations) transforms
    the *structure* of an XML document into another format (often HTML),
    whereas CSS only changes the *presentation* of existing HTML/XML
    elements without restructuring the underlying data.

13. **Q: How would you extend this project to use SOAP instead of REST/JSON?**
    A: You would wrap each request/response in a SOAP XML envelope
    (`<soap:Envelope><soap:Body>...</soap:Body></soap:Envelope>`), define
    the available operations in a WSDL file, and use PHP's built-in
    `SoapServer`/`SoapClient` classes instead of plain `echo json_encode(...)`.

14. **Q: Why does the JavaScript code include a "fallback"/"offline demo mode" for every AJAX call?**
    A: So the demo remains fully interactive even if PHP/MySQL isn't
    running at the time of the presentation — each `fetch()`/`XMLHttpRequest`
    call is wrapped in `try/catch`, and on failure the code substitutes a
    small hard-coded dataset while clearly labeling it as "offline demo mode".

15. **Q: What is the difference between client-side and server-side validation, and why does this project do both?**
    A: Client-side validation (JavaScript/regex in `js/script.js`) gives
    instant feedback without a network round trip but can be bypassed by
    a user disabling JavaScript or calling the API directly. Server-side
    validation (`preg_match`, length checks in the PHP files) is the
    authoritative check that actually protects the database, so both
    layers are implemented.

## 15. Suggested Screenshots for Your Project Report

1. The hero/home section with the live clock visible
2. The full navigation bar (desktop) and the hamburger menu open (mobile view, resize browser or use dev tools device toolbar)
3. The registration form filled in, plus the success message after submission
4. phpMyAdmin showing the `students` table with your new row after registering
5. The CSS3 playground with a customized preview card (different colors/radius/shadow)
6. The drag-and-drop activity mid-drag and after all four items are correctly matched
7. The JavaScript validation section showing both a red "error" state and a green "valid" state
8. The 10-question quiz fully answered, with the score/percentage result and highlighted correct/wrong answers
9. The AJAX search box with live results appearing beneath it
10. The "Run AJAX demo" request/response code panel after clicking the button
11. The XML course feed rendered as cards after clicking "Load courses from XML"
12. `courses.xml` opened directly in Firefox/Edge, showing the XSLT-transformed HTML table
13. The Web Services section with a chosen endpoint's JSON response displayed
14. The dark mode toggle — one screenshot in light mode, one in dark mode, of the same section
15. The final "Syllabus Coverage" table at the bottom of the page

---

*Built for academic purposes as an Internet Programming Lab mini-project.*
