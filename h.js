const RecipeApp = (function() {

            console.log("App starting...");

            /* =========================
               DATA
            ========================= */
            const recipes = [{
                    id: 1,
                    title: "Pasta",
                    difficulty: "easy",
                    time: 20,
                    ingredients: ["pasta", "salt", "water"],
                    steps: ["Boil water", "Add pasta", "Serve"]
                },
                {
                    id: 2,
                    title: "Biryani",
                    difficulty: "hard",
                    time: 60,
                    ingredients: ["rice", "chicken", "spices"],
                    steps: ["Cook rice", "Prepare chicken", "Mix"]
                },
                {
                    id: 3,
                    title: "Sandwich",
                    difficulty: "easy",
                    time: 10,
                    ingredients: ["bread", "butter", "veg"],
                    steps: ["Take bread", "Add filling", "Serve"]
                }
            ];

            /* =========================
               STATE
            ========================= */
            let currentFilter = "all";
            let currentSort = "none";
            let searchQuery = "";

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            let debounceTimer;

            /* =========================
               DOM
            ========================= */
            const container = document.getElementById("recipe-container");
            const counter = document.getElementById("counter");
            const searchInput = document.getElementById("search");

            const filterButtons = document.querySelectorAll("[data-filter]");
            const sortButtons = document.querySelectorAll("[data-sort]");

            /* =========================
               FILTER
            ========================= */
            const applyFilter = (data) => {
                if (currentFilter === "easy") {
                    return data.filter(r => r.difficulty === "easy");
                }
                if (currentFilter === "hard") {
                    return data.filter(r => r.difficulty === "hard");
                }
                if (currentFilter === "quick") {
                    return data.filter(r => r.time < 30);
                }
                if (currentFilter === "favorites") {
                    return data.filter(r => favorites.includes(r.id));
                }
                return data;
            };

            /* =========================
               SEARCH
            ========================= */
            const applySearch = (data) => {
                if (!searchQuery) return data;

                return data.filter(r => {
                    return (
                        r.title.toLowerCase().includes(searchQuery) ||
                        r.ingredients.some(i => i.toLowerCase().includes(searchQuery))
                    );
                });
            };

            /* =========================
               SORT
            ========================= */
            const applySort = (data) => {
                if (currentSort === "name") {
                    return [...data].sort((a, b) => a.title.localeCompare(b.title));
                }
                if (currentSort === "time") {
                    return [...data].sort((a, b) => a.time - b.time);
                }
                return data;
            };

            /* =========================
               FAVORITES
            ========================= */
            const toggleFavorite = (id) => {
                if (favorites.includes(id)) {
                    favorites = favorites.filter(f => f !== id);
                } else {
                    favorites.push(id);
                }

                localStorage.setItem("favorites", JSON.stringify(favorites));
                updateDisplay();
            };

            /* =========================
               CARD
            ========================= */
            const createCard = (r) => {
                    const isFav = favorites.includes(r.id);

                    return `
      <div class="card">
        <h3>${r.title}</h3>
        <p>${r.difficulty} | ${r.time} mins</p>

        <button class="fav-btn" data-id="${r.id}">
          ${isFav ? "❤️" : "🤍"}
        </button>

        <button class="toggle-btn" data-id="${r.id}" data-type="steps">
          Show Steps
        </button>

        <div id="steps-${r.id}" class="hidden">
          <ul>
            ${r.steps.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  };

  /* =========================
     RENDER
  ========================= */
  const render = (data) => {
    container.innerHTML = data.map(createCard).join("");
  };

  /* =========================
     COUNTER
  ========================= */
  const updateCounter = (count) => {
    counter.innerText = `Showing ${count} of ${recipes.length} recipes`;
  };

  /* =========================
     MAIN UPDATE
  ========================= */
  const updateDisplay = () => {
    let data = recipes;

    data = applySearch(data);
    data = applyFilter(data);
    data = applySort(data);

    updateCounter(data.length);
    render(data);
  };

  /* =========================
     EVENTS
  ========================= */
  const setupEvents = () => {

    // FILTER
    filterButtons.forEach(btn => {
      btn.onclick = () => {
        currentFilter = btn.dataset.filter;
        updateDisplay();
      };
    });

    // SORT
    sortButtons.forEach(btn => {
      btn.onclick = () => {
        currentSort = btn.dataset.sort;
        updateDisplay();
      };
    });

    // SEARCH (DEBOUNCE)
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase();
        updateDisplay();
      }, 300);
    });

    // CLICK (DELEGATION)
    container.addEventListener("click", (e) => {

      // FAVORITE
      if (e.target.classList.contains("fav-btn")) {
        const id = Number(e.target.dataset.id);
        toggleFavorite(id);
      }

      // TOGGLE STEPS
      if (e.target.classList.contains("toggle-btn")) {
        const id = e.target.dataset.id;
        const div = document.getElementById(`steps-${id}`);

        div.classList.toggle("hidden");

        e.target.innerText =
          div.classList.contains("hidden")
            ? "Show Steps"
            : "Hide Steps";
      }
    });
  };

  /* =========================
     INIT
  ========================= */
  const init = () => {
    setupEvents();
    updateDisplay();
    console.log("App Ready 🚀");
  };

  return { init };

})();

RecipeApp.init();