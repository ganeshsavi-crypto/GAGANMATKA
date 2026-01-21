// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const phoneForm = document.getElementById('phoneForm');
const messageDiv = document.getElementById('message');
const userInfoDiv = document.getElementById('userInfo');
const userEmailSpan = document.getElementById('userEmail');

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    // Clear messages
    clearMessage();
}

// Display messages
function showMessage(text, type = 'success') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(clearMessage, 5000);
}

function clearMessage() {
    messageDiv.style.display = 'none';
}

// Show user info after login
function showUserInfo(email) {
    userEmailSpan.textContent = email;
    userInfoDiv.style.display = 'block';
    document.querySelector('.tabs').style.display = 'none';
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
}

// Hide user info
function hideUserInfo() {
    userInfoDiv.style.display = 'none';
    document.querySelector('.tabs').style.display = 'flex';
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'block';
    });
    showTab('login');
}

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        showUserInfo(user.email);
        showMessage(`Welcome back, ${user.email}!`, 'success');
    } else {
        hideUserInfo();
    }
});

// ====================
// LOGIN WITH EMAIL/PASSWORD
// ====================
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                showMessage('Login successful!', 'success');
                loginForm.reset();
            })
            .catch((error) => {
                showMessage(error.message, 'error');
            });
    });
}

// ====================
// SIGN UP WITH EMAIL/PASSWORD
// ====================
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                showMessage('Account created successfully! Please check your email for verification.', 'success');
                signupForm.reset();
                
                // Send verification email (optional)
                // userCredential.user.sendEmailVerification();
            })
            .catch((error) => {
                showMessage(error.message, 'error');
            });
    });
}

// ====================
// PHONE OTP AUTHENTICATION
// ====================
let confirmationResult;

if (phoneForm) {
    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phoneNumber = document.getElementById('phoneNumber').value;
        
        // Validate phone number format
        if (!phoneNumber.startsWith('+')) {
            showMessage('Please enter phone number with country code (e.g., +91 1234567890)', 'error');
            return;
        }
        
        // Recaptcha verifier
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phoneForm', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber
            }
        });
        
        const appVerifier = window.recaptchaVerifier;
        
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmation) => {
                confirmationResult = confirmation;
                document.getElementById('otpSection').style.display = 'block';
                showMessage('OTP sent successfully! Check your phone.', 'success');
            })
            .catch((error) => {
                showMessage(error.message, 'error');
                window.recaptchaVerifier.render().then(widgetId => {
                    window.recaptchaVerifier.reset(widgetId);
                });
            });
    });
}

// Verify OTP
window.verifyOTP = function() {
    const otp = document.getElementById('otpCode').value;
    
    if (!otp || otp.length !== 6) {
        showMessage('Please enter a valid 6-digit OTP', 'error');
        return;
    }
    
    confirmationResult.confirm(otp)
        .then((result) => {
            showMessage('Phone number verified successfully!', 'success');
            document.getElementById('otpSection').style.display = 'none';
            document.getElementById('phoneNumber').value = '';
            document.getElementById('otpCode').value = '';
        })
        .catch((error) => {
            showMessage('Invalid OTP. Please try again.', 'error');
        });
}

// ====================
// LOGOUT
// ====================
window.logout = function() {
    auth.signOut()
        .then(() => {
            showMessage('Logged out successfully!', 'success');
        })
        .catch((error) => {
            showMessage(error.message, 'error');
        });
}

// Initialize first tab
showTab('login');
// ====================
// REDIRECT TO DASHBOARD AFTER LOGIN
// ====================

// Update onAuthStateChanged function
auth.onAuthStateChanged((user) => {
    if (user) {
        // Redirect to dashboard immediately
        window.location.href = "dashboard.html";
    } else {
        hideUserInfo();
    }
});

// Update successful login/signup to redirect
// In login section, change success handler to:
auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    })

// In signup section, change success handler to:
auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    })

// In phone OTP verification, change success handler to:
confirmationResult.confirm(otp)
    .then((result) => {
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    })
