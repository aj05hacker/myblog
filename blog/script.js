// script.js

document.querySelector('.hamburger-menu').addEventListener('click', function () {
    document.querySelector('.navbar').classList.toggle('active');
});


// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAYfSOYiMe8y4BF2Tj7e1kKgBMi6tzuiQ0",
    authDomain: "time-and-thought.firebaseapp.com",
    projectId: "time-and-thought",
    storageBucket: "time-and-thought.appspot.com",
    messagingSenderId: "302383115904",
    appId: "1:302383115904:web:a9c880021a3b102ccdc065",
    measurementId: "G-SWE4Y6BH4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const blogsContainer = document.getElementById('blogs-container');
const authorSelect = document.getElementById('author-select');

// Set to store unique authors
const authorsSet = new Set();

// Function to create blog card HTML
function createBlogCard(blog) {
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.style.position = 'relative'; // To ensure the link covers the card
    blogCard.innerHTML = `
        <a href="${blog.link}" class="blog-card-link" style="display: block; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 1;" aria-label="Read more about ${blog.title}"></a>
        <div class="blog-title">${blog.title}</div>
        <div class="blog-image" style="background-image: url('${blog.image}');"></div>
        <div class="blog-date">${blog.date}</div> 
        <div class="blog-author">Author: ${blog.author}</div>
        <div class="blog-content">
            <p class="clamp-2-lines">${blog.description}</p>
        </div>
        <div class="blog-btn">
            <a href="${blog.link}" aria-label="Open the Blog about ${blog.title}">Open The Blog</a>
        </div>
    `;
    return blogCard;
}

// Function to load blogs from Firestore
async function loadBlogs() {
    try {
        const blogsCollection = collection(db, "blogs");
        const blogSnapshot = await getDocs(blogsCollection);
        const blogs = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        blogsContainer.innerHTML = ''; // Clear existing blogs
        authorsSet.clear(); // Clear existing authors

        blogs.forEach(blog => {
            // Add author to set
            if (blog.author) {
                authorsSet.add(blog.author);
            }

            // Create blog card
            const blogCard = createBlogCard(blog);
            blogsContainer.appendChild(blogCard);
        });

        populateAuthorDropdown();
    } catch (error) {
        console.error("Error loading blogs: ", error);
        blogsContainer.innerHTML = '<p style="color: red;">Error loading blogs. Please try again later.</p>';
    }
}

// Function to populate author dropdown
function populateAuthorDropdown() {
    // Clear existing options except "All Authors"
    authorSelect.innerHTML = '<option value="all">All Authors</option>';

    authorsSet.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorSelect.appendChild(option);
    });
}

// Function to filter blogs by author
function filterBlogs() {
    const selectedAuthor = authorSelect.value;

    const blogCards = document.querySelectorAll('.blog-card');

    blogCards.forEach(card => {
        const authorText = card.querySelector('.blog-author').textContent;
        const author = authorText.replace('Author: ', '').trim();

        if (selectedAuthor === 'all' || author === selectedAuthor) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event listener for author filter
authorSelect.addEventListener('change', filterBlogs);

// Load blogs on page load
window.addEventListener('DOMContentLoaded', loadBlogs);
