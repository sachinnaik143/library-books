/* script.js
   - Fetches from Open Library API (no API key).
   - Renders search results (cards).
   - Shows related books (by author of first result).
   - Saves "history" to localStorage.
   - Code is commented to explain behavior for interview.
*/

const RESULTS_PER_PAGE = 12;
const popularSeed = ["Harry Potter", "The Hobbit", "Pride and Prejudice", "1984", "To Kill a Mockingbird", "The Alchemist"];

// DOM references
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsEl = document.getElementById("results");
const messageEl = document.getElementById("message");
const relatedEl = document.getElementById("related");
const popularList = document.getElementById("popularList");
const popularRightNow = document.getElementById("popularRightNow");

// initialize popular chips
function renderPopularChips(){
  popularList.innerHTML = "";
  popularRightNow.innerHTML = "";
  popularSeed.forEach(title => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = title;
    chip.onclick = () => {
      searchInput.value = title;
      performSearch(title);
      window.scrollTo({top: 200, behavior: "smooth"});
    };
    popularList.appendChild(chip);

    // small right column list
    const small = document.createElement("div");
    small.className = "popular-small";
    small.textContent = title;
    small.onclick = () => { searchInput.value = title; performSearch(title); };
    popularRightNow.appendChild(small);
  });
}

// Build cover URL from cover_i, else placeholder
function coverUrl(doc){
  if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  return "https://via.placeholder.com/300x420?text=No+Cover";
}

// Save history to localStorage
function addToHistory(book){
  // book: { title, authors, year, key, time }
  const userEmail = localStorage.getItem("currentUserEmail"); // optional if login later
  const key = userEmail ? `history_${userEmail}` : `history_global`;
  const raw = localStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  // keep max 100 items
  arr.unshift(book);
  if (arr.length > 100) arr.pop();
  localStorage.setItem(key, JSON.stringify(arr));
  // feedback
  messageEl.textContent = `Saved "${book.title}" to history.`;
  setTimeout(()=> messageEl.textContent = "", 2200);
}

// Render search results (docs array)
function renderResults(docs){
  resultsEl.innerHTML = "";
  if (!docs || docs.length === 0){
    messageEl.textContent = "No results found. Try a different title.";
    return;
  }
  messageEl.textContent = `Showing ${docs.length} result(s)`;
  docs.forEach(doc => {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = coverUrl(doc);
    img.alt = doc.title || "Book cover";

    const h3 = document.createElement("h3");
    h3.textContent = doc.title;

    const pAuth = document.createElement("p");
    pAuth.textContent = (doc.author_name && doc.author_name.join(", ")) || "Unknown author";

    const pYear = document.createElement("p");
    pYear.textContent = `First published: ${doc.first_publish_year || "Unknown"}`;

    const meta = document.createElement("div");
    meta.className = "meta";

    const view = document.createElement("a");
    view.href = `https://openlibrary.org${doc.key}`;
    view.target = "_blank";
    view.rel = "noopener noreferrer";
    view.textContent = "Open Library";
    
    const addBtn = document.createElement("button");
    addBtn.className = "btn";
    addBtn.style.padding = "8px 10px";
    addBtn.style.borderRadius = "8px";
    addBtn.textContent = "Add to history";
    addBtn.onclick = () => {
      addToHistory({
        title: doc.title,
        authors: doc.author_name ? doc.author_name.slice(0,3) : [],
        year: doc.first_publish_year,
        key: doc.key,
        time: new Date().toISOString()
      });
    };

    meta.appendChild(view);
    meta.appendChild(addBtn);

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(pAuth);
    card.appendChild(pYear);
    card.appendChild(meta);

    resultsEl.appendChild(card);
  });
}

// Fetch related books (by author of firstResult)
async function fetchRelatedBooks(firstDoc){
  relatedEl.innerHTML = "";
  if (!firstDoc) return;
  const author = (firstDoc.author_name && firstDoc.author_name[0]) || null;
  if (!author) return;

  try {
    const res = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&limit=6`);
    const data = await res.json();
    const docs = data.docs || [];
    // Render related cards (compact)
    docs.slice(0,6).forEach(doc => {
      const r = document.createElement("div");
      r.className = "related-card";
      const img = document.createElement("img");
      img.src = coverUrl(doc);
      img.alt = doc.title;
      const info = document.createElement("div");
      info.className = "info";
      const h4 = document.createElement("h4");
      h4.textContent = doc.title;
      const p = document.createElement("p");
      p.textContent = doc.first_publish_year ? `First: ${doc.first_publish_year}` : "Year unknown";

      const quick = document.createElement("div");
      quick.style.marginTop = "8px";
      quick.style.display = "flex";
      quick.style.gap = "8px";
      const open = document.createElement("a");
      open.href = `https://openlibrary.org${doc.key}`;
      open.target = "_blank";
      open.rel = "noopener noreferrer";
      open.textContent = "View";
      open.className = "btn small";

      const srch = document.createElement("button");
      srch.className = "btn small";
      srch.style.background = "linear-gradient(90deg,#06b6d4,#7c3aed)";
      srch.textContent = "Search similar";
      srch.onclick = () => {
        searchInput.value = doc.title;
        performSearch(doc.title);
      };

      quick.appendChild(open);
      quick.appendChild(srch);

      info.appendChild(h4);
      info.appendChild(p);
      info.appendChild(quick);

      r.appendChild(img);
      r.appendChild(info);
      relatedEl.appendChild(r);
    });
  } catch(e){
    console.error("Related fetch error", e);
  }
}

// Perform search by title
async function performSearch(query){
  if (!query || !query.trim()) return;
  resultsEl.innerHTML = "";
  relatedEl.innerHTML = "";
  messageEl.textContent = "Searching...";
  try {
    const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=${RESULTS_PER_PAGE}`);
    const data = await res.json();
    const docs = data.docs || [];
    renderResults(docs);
    // if we have at least one doc, fetch related by author
    if (docs.length > 0) fetchRelatedBooks(docs[0]);
  } catch (err){
    console.error(err);
    messageEl.textContent = "Error fetching results. Try again.";
  }
}

// Form submit
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) {
    messageEl.textContent = "Please enter a book title";
    setTimeout(()=> messageEl.textContent = "", 1600);
    return;
  }
  performSearch(q);
});

// quick Load popular chips
renderPopularChips();

// optional: pre-populate with a sample search on page load (uncomment if you want)
// performSearch("Harry Potter");
