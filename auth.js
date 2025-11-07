document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginBox = document.querySelector('.login-box:first-child');
    const registerBox = document.getElementById('register-box');

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            window.location.href = 'dashboard.html';
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            const loginBtn = document.getElementById('login-btn');
            
            loginBtn.textContent = 'Iniciando...';
            loginBtn.disabled = true;
            
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch (error) {
                errorDiv.textContent = getErrorMessage(error.code);
                errorDiv.style.display = 'block';
                loginBtn.textContent = 'Iniciar Sesión';
                loginBtn.disabled = false;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const errorDiv = document.getElementById('register-error');
            const registerBtn = document.getElementById('register-btn');
            
            registerBtn.textContent = 'Creando cuenta...';
            registerBtn.disabled = true;
            
            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                
                await db.collection('users').doc(userCredential.user.uid).set({
                    name: name,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    role: 'user'
                });
            } catch (error) {
                errorDiv.textContent = getErrorMessage(error.code);
                errorDiv.style.display = 'block';
                registerBtn.textContent = 'Crear Cuenta';
                registerBtn.disabled = false;
            }
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.style.display = 'none';
            registerBox.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerBox.style.display = 'none';
            loginBox.style.display = 'block';
        });
    }
});

function getErrorMessage(code) {
    const messages = {
        'auth/invalid-email': 'El correo electrónico no es válido.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/user-not-found': 'No existe una cuenta con este correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/email-already-in-use': 'Este correo ya está registrado.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
        'auth/invalid-credential': 'Credenciales inválidas.'
    };
    
    return messages[code] || 'Error al iniciar sesión. Intenta nuevamente.';
}
