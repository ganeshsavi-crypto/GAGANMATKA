// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Your Firebase configuration
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
const provider = new GoogleAuthProvider();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const googleLogin = document.getElementById('googleLogin');
const googleSignup = document.getElementById('googleSignup');
const forgotPassword = document.getElementById('forgotPassword');
const loginStatus = document.getElementById('loginStatus');
const signupStatus = document.getElementById('signupStatus');
const spinner = document.getElementById('spinner');
const toast = document.getElementById('toast');

// Show loading spinner
function showLoading() {
    spinner.style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
    spinner.style.display = 'none';
}

// Show toast notification
function showToast(message, type = 'info') {
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

// Handle form submission - Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            showLoading();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Show success message
            loginStatus.textContent = 'Login successful! Redirecting...';
            loginStatus.className = 'status-message success';
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }));
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. ';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address.';
                    break;
                case 'auth/user-not-found':
                    errorMessage += 'No user found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage += 'Incorrect password.';
                    break;
                case 'auth/user-disabled':
                    errorMessage += 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += 'Too many failed attempts. Try again later.';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            loginStatus.textContent = errorMessage;
            loginStatus.className = 'status-message error';
            showToast(errorMessage, 'error');
        } finally {
            hideLoading();
        }
    });
}

// Handle form submission - Signup
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            signupStatus.textContent = 'Passwords do not match!';
            signupStatus.className = 'status-message error';
            showToast('Passwords do not match!', 'error');
            return;
        }
        
        // Validate password strength
        if (password.length < 6) {
            signupStatus.textContent = 'Password must be at least 6 characters long!';
            signupStatus.className = 'status-message error';
            showToast('Password must be at least 6 characters long!', 'error');
            return;
        }
        
        try {
            showLoading();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update user profile with name
            await updateProfile(user, { displayName: name });
            
            signupStatus.textContent = 'Account created successfully! Redirecting...';
            signupStatus.className = 'status-message success';
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: name
            }));
            
            showToast('Account created successfully!', 'success');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Signup failed. ';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += 'Email already in use.';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address.';
                    break;
                case 'auth/weak-password':
                    errorMessage += 'Password is too weak.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage += 'Email/password accounts are not enabled.';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            signupStatus.textContent = errorMessage;
            signupStatus.className = 'status-message error';
            showToast(errorMessage, 'error');
        } finally {
            hideLoading();
        }
    });
}

// Google Authentication for Login
if (googleLogin) {
    googleLogin.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            showLoading();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Store user info
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }));
            
            showToast('Login successful with Google!', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Google login error:', error);
            showToast('Google login failed!', 'error');
        } finally {
            hideLoading();
        }
    });
}

// Google Authentication for Signup
if (googleSignup) {
    googleSignup.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            showLoading();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Store user info
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }));
            
            showToast('Account created with Google!', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Google signup error:', error);
            showToast('Google signup failed!', 'error');
        } finally {
            hideLoading();
        }
    });
}

// Password Reset
if (forgotPassword) {
    forgotPassword.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value || prompt('Enter your email address:');
        
        if (!email) {
            showToast('Please enter your email address.', 'error');
            return;
        }
        
        try {
            showLoading();
            await sendPasswordResetEmail(auth, email);
            showToast('Password reset email sent! Check your inbox.', 'success');
        } catch (error) {
            console.error('Password reset error:', error);
            showToast('Failed to send reset email. Check email address.', 'error');
        } finally {
            hideLoading();
        }
    });
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
        
        // If we're on login page and user is already logged in, redirect to dashboard
        if (window.location.pathname.includes('index.html')) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    } else {
        // User is signed out
        console.log('User is signed out');
        
        // If we're on dashboard and user is not logged in, redirect to login
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Export auth for use in dashboard
export { auth, signOut };