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

// Function to create blog card HTML with inline styles
function createBlogCard(blog) {
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.style.position = 'relative';
    blogCard.style.width = '300px'; // Set a fixed width for consistency
    blogCard.style.backgroundColor = '#fff';
    blogCard.style.border = '1px solid #ddd';
    blogCard.style.borderRadius = '10px';
    blogCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    blogCard.style.overflow = 'hidden';
    blogCard.style.display = 'flex';
    blogCard.style.flexDirection = 'column';
    blogCard.style.transition = 'transform 0.3s';
    
    // Hover effect
    blogCard.addEventListener('mouseover', () => {
        blogCard.style.transform = 'translateY(-5px)';
        blogCard.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    });
    blogCard.addEventListener('mouseout', () => {
        blogCard.style.transform = 'translateY(0)';
        blogCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    });

    // Blog Card Content
    blogCard.innerHTML = `
        <a href="${blog.link}" class="blog-card-link" aria-label="Read more about ${blog.title}" style="
            display: block; 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            z-index: 1;
        "></a>
        <div class="blog-image" style="
            height: 180px; 
            background-image: url('${blog.image}'); 
            background-size: cover; 
            background-position: center;
        "></div>
        <div class="blog-content" style="
            padding: 1em; 
            flex: 1; 
            display: flex; 
            flex-direction: column;
        ">
            <div class="blog-title" style="
                font-size: 1.5em; 
                margin-bottom: 0.5em; 
                font-family: 'Montserrat', sans-serif; 
                color: #4CAF50;
            ">${blog.title}</div>
            <div class="blog-date" style="
                font-size: 0.9em; 
                color: #888; 
                margin-bottom: 0.5em;
            ">${blog.date}</div>
            <div class="blog-author" style="
                font-size: 0.9em; 
                color: #555; 
                margin-bottom: 1em;
            "><strong>Author:</strong> ${blog.author}</div>
            <p class="clamp-2-lines" style="
                flex: 1; 
                font-size: 1em; 
                color: #666; 
                margin-bottom: 1em;
            ">${blog.description}</p>
            <div class="blog-btn" style="
                text-align: center;
            ">
                <a href="${blog.link}" aria-label="Open the Blog about ${blog.title}" style="
                    display: inline-block; 
                    padding: 0.5em 1em; 
                    background-color: #4CAF50; 
                    color: #fff; 
                    border-radius: 5px; 
                    text-decoration: none; 
                    transition: background-color 0.3s;
                ">Open The Blog</a>
            </div>
        </div>
    `;
    
    // Hover effect for the button
    const blogButton = blogCard.querySelector('.blog-btn a');
    blogButton.addEventListener('mouseover', () => {
        blogButton.style.backgroundColor = '#45a049';
    });
    blogButton.addEventListener('mouseout', () => {
        blogButton.style.backgroundColor = '#4CAF50';
    });

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
        blogsContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading blogs. Please try again later.</p>';
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
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event listener for author filter
authorSelect.addEventListener('change', filterBlogs);

// Load blogs on page load
window.addEventListener('DOMContentLoaded', loadBlogs);
