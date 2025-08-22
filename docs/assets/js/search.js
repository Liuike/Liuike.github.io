// Search functionality
let searchData = [];

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSearchData();
});

// Toggle search dropdown
function toggleSearch() {
    const dropdown = document.getElementById('searchDropdown');
    dropdown.classList.toggle('active');
    
    if (dropdown.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

// Close search when clicking outside
document.addEventListener('click', function(event) {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer.contains(event.target)) {
        document.getElementById('searchDropdown').classList.remove('active');
    }
});

// Load search data from Jekyll's generated content
async function loadSearchData() {
    try {
        const response = await fetch('/search.json');
        if (response.ok) {
            searchData = await response.json();
        } else {
            throw new Error('Search data not found');
        }
    } catch (error) {
        // Fallback to basic page data - no console error
        searchData = [
            { title: "Home", url: "/", content: "Enyan Luke Zhang personal website" },
            { title: "Blog", url: "/blog/", content: "Blog posts and articles" },
            { title: "Projects", url: "/pages/projects/", content: "Portfolio of projects" },
            { title: "Fun Facts", url: "/fun-facts/", content: "Interesting facts and hobbies" }
        ];
    }
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = searchData.filter(item => 
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query)
            ).slice(0, 5);
            
            displayResults(results);
        });
    }
});

function displayResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        return;
    }
    
    searchResults.innerHTML = results.map(item => 
        `<div class="search-result-item" onclick="navigateToResult('${item.url}')">
            <strong>${item.title}</strong>
            <br><small>${item.content.substring(0, 80)}...</small>
        </div>`
    ).join('');
}

function navigateToResult(url) {
    window.location.href = url;
}

// Handle escape key to close search
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.getElementById('searchDropdown').classList.remove('active');
    }
});
