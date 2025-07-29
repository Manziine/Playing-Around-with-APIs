// API Configuration - Replace with your actual API key
const JSEARCH_API = {
    key: 'b418d39c8cmshcae33f9423a1772p120ec7jsndb5ec68a0c71', // Your JSearch API key
    host: 'jsearch.p.rapidapi.com',
    baseUrl: 'https://jsearch.p.rapidapi.com/search'
};

// DOM Elements
const elements = {
    loadingOverlay: document.getElementById('loading-overlay'),
    jobKeyword: document.getElementById('job-keyword'),
    jobLocation: document.getElementById('job-location'),
    searchBtn: document.getElementById('search-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    welcomeSection: document.getElementById('welcome-section'),
    resultsSection: document.getElementById('results-section'),
    resultsTitle: document.getElementById('results-title'),
    resultsCount: document.getElementById('results-count'),
    jobsContainer: document.getElementById('jobs-container'),
    noResults: document.getElementById('no-results'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    retryBtn: document.getElementById('retry-btn'),
    clearSearch: document.getElementById('clear-search')
};

// Application State
let currentSearch = {
    keyword: '',
    location: '',
    results: []
};
let isLoading = false;

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme();
        this.applyTheme(this.currentTheme);
        this.updateThemeIcon();
    }

    getStoredTheme() {
        return localStorage.getItem('skynza-jobs-theme') || 'dark';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('skynza-jobs-theme', theme);
        this.currentTheme = theme;
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = elements.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Job Search API Service
class JobSearchService {
    static async searchJobs(keyword, location) {
        try {
            // Build query string
            const query = location ? `${keyword} in ${location}` : keyword;
            const url = `${JSEARCH_API.baseUrl}?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': JSEARCH_API.key,
                    'X-RapidAPI-Host': JSEARCH_API.host
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('API key is invalid or expired. Please check your RapidAPI subscription.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. Please verify your API key has access to JSearch API.');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                }
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.status !== 'OK') {
                throw new Error(data.message || 'Failed to fetch job listings');
            }

            return data.data || [];
        } catch (error) {
            console.error('Job Search API Error:', error);
            throw error;
        }
    }
}

// UI Helper Functions
function showLoading() {
    if (!isLoading) {
        isLoading = true;
        elements.loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    if (isLoading) {
        isLoading = false;
        setTimeout(() => {
            elements.loadingOverlay.classList.add('hidden');
        }, 500);
    }
}

function showSection(sectionElement) {
    // Hide all sections
    elements.welcomeSection.classList.add('hidden');
    elements.resultsSection.classList.add('hidden');
    elements.noResults.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
    
    // Show the specified section
    sectionElement.classList.remove('hidden');
}

function formatJobDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    } catch {
        return 'Recently posted';
    }
}

function truncateText(text, maxLength = 150) {
    if (!text) return 'No description available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function displayJobResults(jobs) {
    if (!jobs || jobs.length === 0) {
        showSection(elements.noResults);
        return;
    }

    // Update results header
    elements.resultsTitle.textContent = `Jobs for "${currentSearch.keyword}"`;
    elements.resultsCount.textContent = `${jobs.length} jobs found`;
    
    // Generate job cards HTML
    const jobsHTML = jobs.map(job => {
        const title = job.job_title || 'Job Title Not Available';
        const company = job.employer_name || 'Company Not Listed';
        const location = job.job_city && job.job_country 
            ? `${job.job_city}, ${job.job_country}`
            : job.job_country || 'Location Not Specified';
        const description = truncateText(job.job_description);
        const applyUrl = job.job_apply_link || '#';
        const postedDate = formatJobDate(job.job_posted_at_datetime_utc);
        const jobType = job.job_employment_type || 'Full-time';
        
        return `
            <div class="job-card" data-job-id="${job.job_id || Math.random()}">
                <div class="job-header">
                    <div class="job-company">${company}</div>
                </div>
                <h3 class="job-title">${title}</h3>
                <div class="job-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${location}</span> • <span>${jobType}</span>
                </div>
                <p class="job-description">${description}</p>
                <div class="job-footer">
                    <span class="job-posted">${postedDate}</span>
                    <a href="${applyUrl}" target="_blank" rel="noopener noreferrer" class="apply-button">
                        <i class="fas fa-external-link-alt"></i>
                        Apply Now
                    </a>
                </div>
            </div>
        `;
    }).join('');
    
    elements.jobsContainer.innerHTML = jobsHTML;
    showSection(elements.resultsSection);
}

function showError(message) {
    elements.errorText.textContent = message;
    showSection(elements.errorMessage);
}

// Main Search Function
async function performJobSearch() {
    const keyword = elements.jobKeyword.value.trim();
    const location = elements.jobLocation.value.trim();
    
    if (!keyword) {
        elements.jobKeyword.focus();
        return;
    }
    
    currentSearch.keyword = keyword;
    currentSearch.location = location;
    
    try {
        showLoading();
        const jobs = await JobSearchService.searchJobs(keyword, location);
        currentSearch.results = jobs;
        displayJobResults(jobs);
    } catch (error) {
        console.error('Search failed:', error);
        let errorMessage = 'Unable to search for jobs. Please try again later.';
        
        if (error.message.includes('API key')) {
            errorMessage = 'API configuration error. Please check your API key setup.';
        } else if (error.message.includes('Rate limit')) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
            errorMessage = 'Network connection error. Please check your internet connection.';
        }
        
        showError(errorMessage);
    } finally {
        hideLoading();
    }
}

function clearSearch() {
    elements.jobKeyword.value = '';
    elements.jobLocation.value = '';
    currentSearch = { keyword: '', location: '', results: [] };
    showSection(elements.welcomeSection);
}

// Featured Job Categories
const FEATURED_CATEGORIES = [
    {
        title: 'Software Engineering',
        icon: 'fas fa-laptop-code',
        description: 'Frontend, Backend, Full-stack development roles',
        searchTerms: 'software engineer developer programmer'
    },
    {
        title: 'Data Science',
        icon: 'fas fa-chart-bar',
        description: 'Data analysts, scientists, and ML engineers',
        searchTerms: 'data scientist analyst machine learning'
    },
    {
        title: 'Product Management',
        icon: 'fas fa-rocket',
        description: 'Product managers, owners, and strategists',
        searchTerms: 'product manager product owner'
    },
    {
        title: 'Design & UX',
        icon: 'fas fa-palette',
        description: 'UI/UX designers, graphic designers, researchers',
        searchTerms: 'designer UX UI graphic design'
    },
    {
        title: 'Marketing',
        icon: 'fas fa-bullhorn',
        description: 'Digital marketing, growth, and brand managers',
        searchTerms: 'marketing manager digital marketing'
    },
    {
        title: 'Sales',
        icon: 'fas fa-handshake',
        description: 'Sales representatives, managers, and executives',
        searchTerms: 'sales representative sales manager'
    }
];

// Load Featured Jobs
function loadFeaturedJobs() {
    const container = document.getElementById('featured-jobs-container');
    if (!container) return;
    
    const featuredHTML = FEATURED_CATEGORIES.map(category => `
        <div class="featured-job-card" data-search="${category.searchTerms}">
            <div class="featured-job-header">
                <div class="featured-job-icon">
                    <i class="${category.icon}"></i>
                </div>
                <div>
                    <h4 class="featured-job-title">${category.title}</h4>
                    <div class="featured-job-count">Popular category</div>
                </div>
            </div>
            <p class="featured-job-description">${category.description}</p>
        </div>
    `).join('');
    
    container.innerHTML = featuredHTML;
    
    // Add click handlers to featured job cards
    container.addEventListener('click', (e) => {
        const card = e.target.closest('.featured-job-card');
        if (card) {
            const searchTerms = card.dataset.search;
            elements.jobKeyword.value = searchTerms;
            elements.jobLocation.value = '';
            performJobSearch();
        }
    });
}

// Event Listeners
function initializeEventListeners() {
    // Search functionality
    elements.searchBtn.addEventListener('click', performJobSearch);
    
    elements.jobKeyword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performJobSearch();
        }
    });
    
    elements.jobLocation.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performJobSearch();
        }
    });

    // Theme toggle
    elements.themeToggle.addEventListener('click', () => {
        themeManager.toggle();
    });

    // Clear search
    elements.clearSearch.addEventListener('click', clearSearch);

    // Retry search
    elements.retryBtn.addEventListener('click', () => {
        if (currentSearch.keyword) {
            performJobSearch();
        } else {
            showSection(elements.welcomeSection);
        }
    });

    // Job card interactions
    elements.jobsContainer.addEventListener('click', (e) => {
        const jobCard = e.target.closest('.job-card');
        if (jobCard && !e.target.closest('.apply-button')) {
            // Add subtle interaction effect
            jobCard.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                if (jobCard.style) {
                    jobCard.style.transform = '';
                }
            }, 150);
        }
    });
}

// Initialize Application
function initializeApp() {
    console.log('Initializing Skynza Jobs App...');
    
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Set up event listeners
    initializeEventListeners();
    
    // Load featured jobs
    loadFeaturedJobs();
    
    // Show welcome section by default
    showSection(elements.welcomeSection);
    
    // Set focus on search input
    elements.jobKeyword.focus();
    
    console.log('Skynza Jobs App initialized successfully!');
}

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    if (isLoading) {
        hideLoading();
        showError('An unexpected error occurred. Please refresh the page and try again.');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (isLoading) {
        hideLoading();
        showError('An unexpected error occurred. Please try again.');
    }
});

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Expose useful functions to global scope for debugging
window.SkynzaJobsApp = {
    performJobSearch,
    clearSearch,
    themeManager: window.themeManager,
    currentSearch
};
