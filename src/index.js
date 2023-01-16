import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, onSnapshot, 
  addDoc, deleteDoc, doc, query, where,
  orderBy, serverTimestamp, getDoc, getDocs, updateDoc,
} from 'firebase/firestore';
import {
    getAuth, createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged, 
    // auth,
} from 'firebase/auth';
import firebaseConfigKeys from './firebase';

const firebaseConfig = firebaseConfigKeys;                                              

// init firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, 'books');

//queries
const q = query(colRef, orderBy('Timestamp', 'desc'));
const ul = document.querySelector('.ul');

function renderData() {
    ul.innerHTML = '';
    onSnapshot(q, (snapshot) => {
        let books = [];
        snapshot.docs.forEach((item) => {
            books.push({ ...item.data(), id: item.id })
        });
        console.log(books);
        ul.innerHTML = '';
        books.forEach((book, index) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = 'Delete';
            button.classList.add("delete-button");
            button.addEventListener("click", function() {
                // document.querySelector(".delete").scrollIntoView();
                // const input = document.querySelector('input[name="delete"]');
                // input.focus();
                unSubCol();
                const docRef = doc(db, 'books', book.id);
                deleteDoc(docRef)
                    .then(() => {
                        li.remove();
                    })
            });
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.classList.add("update-button");
            updateButton.addEventListener("click", function() {
                document.querySelector(".delete").scrollIntoView();
                const input = document.querySelector('input[name="update"]');
                input.value = book.id;
                const updateInput = document.querySelector('input[name="updateTitle"]');
                updateInput.value = book.Title;
                const authorInput = document.querySelector('input[name="updateAuthor"]')
                authorInput.value = book.Author;
                updateInput.focus();       
    
            });
            li.textContent = `${index + 1}) ${book.Author} - ${book.Title}`;
            li.appendChild(button);
            li.appendChild(updateButton);
            ul.appendChild(li);
        })
    })
};

// get real time collection data
const unSubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((item) => {
        books.push({ ...item.data(), id: item.id })
    });
    console.log(books);
    books.forEach((book, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = 'Delete';
        button.classList.add("delete-button");
        button.addEventListener("click", function() {
            // document.querySelector(".delete").scrollIntoView();
            // const input = document.querySelector('input[name="delete"]');
            // input.focus();
            unSubCol();
            const docRef = doc(db, 'books', book.id);
            deleteDoc(docRef)
                .then(() => {
                    li.remove();
                })
        });
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add("update-button");
        updateButton.addEventListener("click", function() {
            document.querySelector(".delete").scrollIntoView();
            const input = document.querySelector('input[name="update"]');
            input.value = book.id;
            const updateInput = document.querySelector('input[name="updateTitle"]');
            updateInput.value = book.Title;
            const authorInput = document.querySelector('input[name="updateAuthor"]')
            authorInput.value = book.Author;
            updateInput.focus();       

        });
        li.textContent = `${index + 1}) ${book.Author} - ${book.Title}`;
        li.appendChild(button);
        li.appendChild(updateButton);
        ul.appendChild(li);
    })
})  


const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    unSubCol();

    addDoc(colRef, {
        Title: addBookForm.title.value,
        Author: addBookForm.author.value,
        Timestamp: serverTimestamp()
    })
    .then(() => {
        addBookForm.reset();
        renderData();
        setTimeout( () => {
            document.querySelector(".ul").scrollIntoView();
        }, 1000)
    })
})

const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const docRef = doc(db, 'books', deleteBookForm.delete.value);

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset();
        })
})

//get a single document

const docRef = doc(db, 'books', 'RTzlaJZezdkjXEQ7NWMI');

const unSubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
});    

// updating a document

const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    unSubCol();
    setTimeout( () => {
        document.querySelector(".ul").scrollIntoView();
    }, 1000)

    
    const docRef = doc(db, 'books', updateForm.update.value);
    updateDoc(docRef, {
        Title: updateForm.updateTitle.value,
        Author: updateForm.updateAuthor.value,
    })
    .then(() => {
        updateForm.reset();
        renderData();
    })
}) 


// signing up

const singUpForm = document.querySelector('.signup');
singUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = singUpForm.email.value;
    const password = singUpForm.password.value;
    createUserWithEmailAndPassword(auth, email, password )
        .then((credential) => {
            console.log('user created: ', credential.user);
            singUpForm.reset();
            // document.querySelector(".header").scrollIntoView();
            // ul.style.display = 'block';
            // addBookForm.style.display = 'flex';
            // updateForm.style.display = 'flex';
            // deleteBookForm.style.display = 'flex';
            // const p = document.createElement('p');
            // const signup = document.querySelector('.signup');
            // p.innerHTML = 'You have succesfully signed up <br> <br> Please Log in with this email and Password';
            // signup.append(p);
            // p.style.backgroundColor = 'white';
            // p.style.color = 'green';
            // p.style.fontSize = 'larger';
            // p.style.fontWeight = 'bold';
            // p.style.maxWidth = '250px';
            // p.scrollIntoView();
        })
        .catch(err => {
            console.log(err.message);
            const p = document.createElement('p');
            const signup = document.querySelector('.signup');
            p.textContent = err.message;
            signup.append(p);
            p.style.backgroundColor = 'white';
            p.style.color = 'red';
            p.style.fontSize = 'larger';
            p.style.fontWeight = 'bold';
            p.style.maxWidth = '250px';
            p.scrollIntoView();
            setTimeout(() => {
                p.remove()
               }, 15000);
        });
})

// logging in and logging out
const logOutButton = document.querySelector('.logout');
logOutButton.addEventListener('click', () => {
    document.querySelector(".header").scrollIntoView();
    signOut(auth)
        .then(() => console.log('signed out'))
        .catch((err) => console.log(err.message));
})

const logInForm = document.querySelector('.login');
logInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector(".header").scrollIntoView();
    
    const email = logInForm.email.value;
    const password = logInForm.password.value;
    const p = document.createElement('p');

    signInWithEmailAndPassword(auth, email, password)
        .then((credential) => {
            console.log('logged in: ', credential.user)
            logInForm.reset();
        })
        .catch((err) => {
           console.log(err.message);
           const login = document.querySelector('.login');
           p.textContent = err.message;
           login.append(p);
           p.style.backgroundColor = 'white';
           p.style.color = 'red';
           p.style.fontSize = 'larger';
           p.style.fontWeight = 'bold';
           p.style.maxWidth = '250px';
           p.scrollIntoView();
           setTimeout(() => {
            p.remove()
           }, 15000);
        });
    
})


// subscribing to auth changes
const logoutButton = document.querySelector('.logout');
onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user);
    if (user) {
        // User is signed in.
        console.log("User is logged in.");
        document.querySelector('.auth').innerHTML = 'Log Out'
        logoutButton.style.display = 'block';
        ul.style.display = 'block';
        addBookForm.style.display = 'flex';
        updateForm.style.display = 'flex';
        deleteBookForm.style.display = 'flex';
        singUpForm.style.display = 'none';
        logInForm.style.display = 'none';
      } else {
        // No user is signed in.
        document.querySelector('.auth').innerHTML = 'Sign Up or Log In'
        console.log("User is not logged in.");
        ul.style.display = 'none';
        logoutButton.style.display = 'none';
        addBookForm.style.display = 'none';
        updateForm.style.display = 'none';
        deleteBookForm.style.display = 'none';
        singUpForm.style.display = 'none';
        logInForm.style.display = 'none';
        singUpForm.style.display = 'flex';
        logInForm.style.display = 'flex';
      }
})


