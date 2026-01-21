// dashboard.js - Add this as a new file
import { auth, signOut } from './auth.js';

// DOM Elements
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const welcomeName = document.getElementById('welcomeName');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');

// Initialize dashboard
function initDashboard() {
    // Get user data from localStorage or Firebase auth
    const userData = JSON.parse(localStorage.getItem('user'));
    
    // Check if user is authenticated
    auth.onAuthStateChanged((user) => {
        if (!user && !userData) {
            // No user data, redirect to login
            console.log('No authenticated user, redirecting to login');
            showToast('Please login first', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            return;
        }
        
        // Use Firebase user or localStorage data
        const currentUser = user || userData;
        
        if (currentUser) {
            // Display user information
            const displayName = currentUser.displayName || 
                               currentUser.email?.split('@')[0] || 
                               'User';
            const email = currentUser.email || '';
            const initials = displayName.charAt(0).toUpperCase();
            
            // Update DOM elements
            if (userName) userName.textContent = displayName;
            if (userEmail) userEmail.textContent = email;
            if (welcomeName) welcomeName.textContent = displayName;
            
            // Update avatar
            if (userAvatar) {
                if (currentUser.photoURL) {
                    userAvatar.innerHTML = `<img src="${currentUser.photoURL}" alt="${displayName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                } else {
                    userAvatar.textContent = initials;
                    userAvatar.style.background = 'linear-gradient(to right, #5b86e5, #36d1dc)';
                    userAvatar.style.color = 'white';
                    userAvatar.style.display = 'flex';
                    userAvatar.style.alignItems = 'center';
                    userAvatar.style.justifyContent = 'center';
                    userAvatar.style.fontWeight = 'bold';
                    userAvatar.style.fontSize = '18px';
                }
            }
            
            console.log('Dashboard loaded for:', displayName);
        }
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            showLoading();
            await signOut(auth);
            localStorage.removeItem('user');
            showToast('Logged out successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Logout failed!', 'error');
        } finally {
            hideLoading();
        }
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'success') {
        toast.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#f44336';
    } else {
        toast.style.backgroundColor = '#333';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show loading spinner
function showLoading() {
    // Create spinner if not exists
    let spinner = document.getElementById('spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.className = 'spinner-overlay';
        spinner.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(spinner);
    }
    spinner.style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Update stats with random numbers
function updateStats() {
    const stats = {
        visitorsCount: Math.floor(Math.random() * 1000) + 1000,
        conversionRate: (Math.random() * 5 + 2).toFixed(1),
        totalUsers: Math.floor(Math.random() * 1000) + 2000,
        revenue: (Math.random() * 5000 + 8000).toFixed(1),
        projects: Math.floor(Math.random() * 20) + 40,
        tasks: Math.floor(Math.random() * 50) + 100
    };

    Object.keys(stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            // Format numbers
            if (key === 'visitorsCount' || key === 'totalUsers' || key === 'projects' || key === 'tasks') {
                element.textContent = stats[key].toLocaleString();
            } else if (key === 'conversionRate') {
                element.textContent = stats[key] + '%';
            } else if (key === 'revenue') {
                element.textContent = '$' + stats[key] + 'K';
            }
        }
    });
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    
    // Initialize stats
    if (typeof updateStats === 'function') {
        updateStats();
        // Update stats every 10 seconds
        setInterval(updateStats, 10000);
    }
    
    // Add CSS for loading spinner if not exists
    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            .spinner-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #5b86e5;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});