const firebaseConfig = {
  apiKey: "AIzaSyDQewxlapgtrjOBK_GswmBd7x2h1VScaaU",
  authDomain: "mysig-86e27.firebaseapp.com",
  projectId: "mysig-86e27",
  storageBucket: "mysig-86e27.firebasestorage.app",
  messagingSenderId: "1061139953975",
  appId: "1:1061139953975:web:81ed516183fd238d37c2b2",
  measurementId: "G-NDG50R3GSB"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function checkAuth() {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}

async function requireAuth() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}
