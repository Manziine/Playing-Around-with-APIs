📄 Skynza Jobs – 
Skynza Jobs is a lightweight job search web application built using vanilla HTML, CSS, and JavaScript. It integrates the JSearch API to fetch real-time job listings and provides a clean, responsive user interface with dark/light theme support.

🚀 Core Features

🎯 Functionality

Real-Time Job Search: Powered by the JSearch API.

Advanced Filtering: Search jobs by keyword, location, and job type.

Featured Categories: Quick-access buttons for common job categories.

Modern UI: Clean design with a steel blue and teal color scheme.

💡 User Experience

Dark/Light Theme Toggle: Smooth transitions with saved preferences.

Mobile-First Design: Fully responsive layout for all devices.

Loading & Feedback: Polished loading animations and error handling.

⚙️ Technical Highlights

No Frameworks: Built entirely with vanilla JavaScript, HTML, and CSS.

Performance Optimized: Lightweight and fast.

Accessible & SEO-Friendly: Semantic HTML, keyboard navigation, and screen reader support.

🛠 Technologies Used

Frontend: HTML5, CSS3, JavaScript (ES6+)

Layout: CSS Grid, Flexbox, CSS Variables

Icons: Font Awesome

Fonts: Google Fonts (Inter)

External API: JSearch API (via RapidAPI)

📂 Project Structure
bash
Copy
Edit
skynza-jobs/
├── index.html       # Main HTML file
├── styles.css       # Application styling with theme support
├── script.js        # API logic and user interaction
└── README.md        # Documentation
🧠 Key Components

ThemeManager: Controls theme switching.

JobSearchService: Handles job data from the API.

FEATURED_CATEGORIES: Customizable featured job areas.

⚡ Getting Started

Local Setup

Download or clone the repository.

Ensure all files (index.html, styles.css, script.js) are in the same directory.

Open index.html in a browser or use a live server.

Start searching for jobs.

API Configuration

To use the app with your own API key:

Go to RapidAPI - JSearch

Subscribe and get your API key.

In script.js, replace the placeholder with your key:

javascript
Copy
Edit
const JSEARCH_API = {
    key: 'your-api-key-here',
    host: 'jsearch.p.rapidapi.com',
    baseUrl: 'https://jsearch.p.rapidapi.com/search'
};
🌐 Deployment (Static Hosting)

You can deploy the app using any static hosting service such as:

Netlify

GitHub Pages

Vercel

Steps:

Upload index.html, styles.css, and script.js

Add your API key

Publish — no build tools needed

🎨 Customization Options

Theme Colors
Edit the CSS variables in :root for custom themes:

css
Copy
Edit
:root {
    --accent-primary: #4682B4;
    --accent-secondary: #008080;
    --bg-primary: #1a1a1a;
}
Featured Job Categories
Modify the FEATURED_CATEGORIES array in script.js:

javascript
Copy
Edit
const FEATURED_CATEGORIES = [
    {
        title: 'Your Category',
        icon: 'fas fa-your-icon',
        description: 'Category description',
        searchTerms: 'search keywords'
    }
];
📱 Browser Compatibility

Chrome 90+

Firefox 88+

Safari 14+

Edge 90+

Mobile browsers (iOS & Android)

📷 Live Demo & Screenshots
Live App: URL goes here

Screenshots included for:

Home Screen

Search Results

Theme Toggle

🤝 Contribution Guidelines

Fork the repository

Create a new branch (feature/your-feature)

Commit and push changes

Open a pull request

🐞 Known Issues

CORS: May require configuration depending on host.

API Limits: The free plan on RapidAPI may hit usage limits.

Mobile Safari: Some advanced CSS features may need fallbacks.

📊 API Information

Endpoint Used:

GET /search – for retrieving job listings.

Sample Response:
json
Copy
Edit
{
  "status": "OK",
  "data": [
    {
      "job_title": "Software Engineer",
      "employer_name": "Tech Company",
      "job_city": "San Francisco",
      "job_country": "US",
      "job_description": "Job description...",
      "job_apply_link": "https://apply-link.com",
      "job_posted_at_datetime_utc": "2025-01-15T10:30:00Z"
    }
  ]
}
📝 License

Licensed under the MIT License.

👨‍💻 Author

Arnaud Ineza Manzi

Instagram

LinkedIn

II
