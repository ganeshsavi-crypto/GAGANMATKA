// auth.js - Simplified Firebase Authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyALyTItXw0tDAy8p6PXwA1Z9XPJTds6yKU",
    authDomain: "gaganmatka-21979.firebaseapp.com",
    projectId: "gaganmatka-21979",
    storageBucket: "gaganmatka-21979.firebasestorage.app",
    messagingSenderId: "888028292027",
    appId: "1:888028292027:web:d42b489672b25c2ae4da9e",
    measurementId: "G-GF8Z6137MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
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
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'none';
}

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const loginStatus = document.getElementById('loginStatus');
        
        if (!email || !password) {
            if (loginStatus) {
                loginStatus.textContent = 'Please fill in all fields';
                loginStatus.className = 'status-message error';
            }
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        try {
            showLoading();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Store user info
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email
            }));
            
            // Show success
            if (loginStatus) {
                loginStatus.textContent = 'Login successful! Redirecting...';
                loginStatus.className = 'status-message success';
            }
            
            showToast('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            }
            
            if (loginStatus) {
                loginStatus.textContent = errorMessage;
                loginStatus.className = 'status-message error';
            }
            showToast(errorMessage, 'error');
        } finally {
            hideLoading();
        }
    });
}

// Handle Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const signupStatus = document.getElementById('signupStatus');
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            if (signupStatus) {
                signupStatus.textContent = 'Please fill in all fields';
                signupStatus.className = 'status-message error';
            }
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            if (signupStatus) {
                signupStatus.textContent = 'Passwords do not match!';
                signupStatus.className = 'status-message error';
            }
            showToast('Passwords do not match!', 'error');
            return;
        }
        
        if (password.length < 6) {
            if (signupStatus) {
                signupStatus.textContent = 'Password must be at least 6 characters';
                signupStatus.className = 'status-message error';
            }
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        try {
            showLoading();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Store user info
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: name
            }));
            
            if (signupStatus) {
                signupStatus.textContent = 'Account created! Redirecting...';
                signupStatus.className = 'status-message success';
            }
            
            showToast('Account created successfully!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Signup error:', error);
            
            let errorMessage = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            }
            
            if (signupStatus) {
                signupStatus.textContent = errorMessage;
                signupStatus.className = 'status-message error';
            }
            showToast(errorMessage, 'error');
        } finally {
            hideLoading();
        }
    });
}

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User already logged in:', user.email);
        // If on login page and already logged in, redirect to dashboard
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        }
    }
});

// Export for dashboard
export { auth, signOut };