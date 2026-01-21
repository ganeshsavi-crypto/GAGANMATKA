// auth.js - Fixed Version
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Firebase configuration
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
const googleLoginBtn = document.getElementById('googleLogin');
const googleSignupBtn = document.getElementById('googleSignup');
const forgotPassword = document.getElementById('forgotPassword');
const loginStatus = document.getElementById('loginStatus');
const signupStatus = document.getElementById('signupStatus');
const spinner = document.getElementById('spinner');
const toast = document.getElementById('toast');

// Show loading spinner
function showLoading() {
    if (spinner) spinner.style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
    if (spinner) spinner.style.display = 'none';
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

// Clear status messages
function clearStatusMessages() {
    if (loginStatus) {
        loginStatus.textContent = '';
        loginStatus.className = 'status-message';
    }
    if (signupStatus) {
        signupStatus.textContent = '';
        signupStatus.className = 'status-message';
    }
}

// Handle form submission - Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearStatusMessages();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Basic validation
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
            
            console.log('Login successful:', user.email);
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || email.split('@')[0]
            }));
            
            // Show success message
            if (loginStatus) {
                loginStatus.textContent = 'Login successful! Redirecting...';
                loginStatus.className = 'status-message success';
            }
            
            showToast('Login successful!', 'success');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. ';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Try again later.';
                    break;
                default:
                    errorMessage = error.message || 'An error occurred during login.';
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

// Handle form submission - Signup
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearStatusMessages();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
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
                signupStatus.textContent = 'Password must be at least 6 characters long!';
                signupStatus.className = 'status-message error';
            }
            showToast('Password must be at least 6 characters long!', 'error');
            return;
        }
        
        try {
            showLoading();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update user profile with name
            await updateProfile(user, {
                displayName: name
            });
            
            console.log('Signup successful:', user.email);
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: name
            }));
            
            if (signupStatus) {
                signupStatus.textContent = 'Account created successfully! Redirecting...';
                signupStatus.className = 'status-message success';
            }
            
            showToast('Account created successfully!', 'success');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Signup failed. ';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. Use at least 6 characters.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled.';
                    break;
                default:
                    errorMessage = error.message || 'An error occurred during signup.';
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

// Google Authentication
function setupGoogleAuth(button, isSignup = false) {
    if (button) {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                showLoading();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                
                console.log('Google auth successful:', user.email);
                
                // Store user info
                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL
                }));
                
                showToast(`${isSignup ? 'Account created' : 'Login'} successful with Google!`, 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } catch (error) {
                console.error('Google auth error:', error);
                let errorMessage = 'Google authentication failed. ';
                
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'Google sign-in was cancelled.';
                } else if (error.code === 'auth/unauthorized-domain') {
                    errorMessage = 'This domain is not authorized for Google sign-in.';
                } else {
                    errorMessage += error.message || 'Please try again.';
                }
                
                showToast(errorMessage, 'error');
            } finally {
                hideLoading();
            }
        });
    }
}

// Setup Google auth buttons
setupGoogleAuth(googleLoginBtn, false);
setupGoogleAuth(googleSignupBtn, true);

// Password Reset
if (forgotPassword) {
    forgotPassword.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value || prompt('Enter your email address:');
        
        if (!email) {
            showToast('Please enter your email address.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        
        try {
            showLoading();
            await sendPasswordResetEmail(auth, email);
            showToast('Password reset email sent! Check your inbox.', 'success');
        } catch (error) {
            console.error('Password reset error:', error);
            let errorMessage = 'Failed to send reset email. ';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else {
                errorMessage += error.message || 'Please try again.';
            }
            
            showToast(errorMessage, 'error');
        } finally {
            hideLoading();
        }
    });
}

// Check authentication state and redirect if needed
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        
        // If on login page and already authenticated, redirect to dashboard
        if (window.location.pathname.endsWith('index.html') || 
            window.location.pathname.endsWith('/')) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        }
    } else {
        console.log('User is signed out');
        
        // If on dashboard and not authenticated, redirect to login
        if (window.location.pathname.includes('dashboard.html')) {
            // Don't redirect immediately, let dashboard.js handle it
            console.log('Not authenticated on dashboard page');
        }
    }
});

// Export auth for use in dashboard
export { auth, signOut };