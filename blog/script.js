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
const categorySelect = document.getElementById('category-select');

// Set to store unique categorys
const categorysSet = new Set();

// Function to create blog card HTML
function createBlogCard(blog) {
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    // Inline styles are handled via CSS classes

    blogCard.innerHTML = `
        <a href="${blog.link}" class="blog-card-link" aria-label="Read more about ${blog.title}"></a>
        <div class="blog-title">${blog.title}</div>
        <div class="blog-image" style="background-image: url('${blog.image}');"></div>
        <div class="blog-date">${blog.date}</div> 
        <div class="blog-author">Author: ${blog.author}</div>
        <div class="blog-category">Category: ${blog.category}</div>
        <div class="blog-content">
            <p class="clamp-2-lines">${blog.description}</p>
        </div>
        <div class="blog-btn">
            <a href="${blog.link}" aria-label="Open the Blog about ${blog.title}">Open The Blog</a>
        </div>
    `;
    return blogCard;
}

// Function to load blogs from Firestore and sort by date
async function loadBlogs() {
    try {
        const blogsCollection = collection(db, "blogs");
        const blogSnapshot = await getDocs(blogsCollection);
        let blogs = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort blogs by date (assuming date format is mm/dd/yyyy)
        blogs = blogs.sort((a, b) => {
            const dateA = new Date(a.date); // Convert string to Date object
            const dateB = new Date(b.date); // Convert string to Date object
            return dateB - dateA; // Sort in descending order (newest first)
        });

        blogsContainer.innerHTML = ''; // Clear existing blogs
        categorysSet.clear(); // Clear existing categories

        blogs.forEach(blog => {
            // Add category to set
            if (blog.category) {
                categorysSet.add(blog.category);
            }

            // Create blog card
            const blogCard = createBlogCard(blog);
            blogsContainer.appendChild(blogCard);
        });

        populateCategoryDropdown(); // Populate the category dropdown menu
    } catch (error) {
        console.error("Error loading blogs: ", error);
        blogsContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading blogs. Please try again later.</p>';
    }
}



// Function to populate category dropdown
function populateCategoryDropdown() {
    // Clear existing options except "All Categorys"
    categorySelect.innerHTML = '<option value="all">All Category</option>';

    categorysSet.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Function to filter blogs by category
function filterBlogs() {
    const selectedCategory = categorySelect.value;

    const blogCards = document.querySelectorAll('.blog-card');

    blogCards.forEach(card => {
        const categoryText = card.querySelector('.blog-category').textContent;
        const category = categoryText.replace('Category: ', '').trim();

        if (selectedCategory === 'all' || category === selectedCategory) {
            card.style.display = 'flex'; // Ensure flex display for alignment
        } else {
            card.style.display = 'none';
        }
    });
}

// Event listener for category filter
categorySelect.addEventListener('change', filterBlogs);

// Load blogs on page load
window.addEventListener('DOMContentLoaded', loadBlogs);






