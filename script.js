// Check if there are registered users in local storage
var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
  var passwordInput = document.getElementById(inputId);
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

// Event listener for toggling password visibility in registration form
document.getElementById('showPassword').addEventListener('change', function() {
  togglePasswordVisibility('password');
});

// Event listener for toggling password visibility in login form
document.getElementById('showLoginPassword').addEventListener('change', function() {
  togglePasswordVisibility('loginPassword');
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var username = document.getElementById('username').value.trim();
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value;

  // Reset error messages
  clearMessage('registerMessage');

  // Validate fields
  if (!username || !email || !password) {
    showMessage('registerMessage', 'Please fill in all fields.', true);
    return;
  }

  if (!validateEmail(email)) {
    showMessage('registerMessage', 'Please enter a valid email address.', true);
    return;
  }

  if (password.length < 8) {
    showMessage('registerMessage', 'Password must be at least 8 characters long.', true);
    return;
  }

  if (!checkPasswordStrength(password)) {
    showMessage('registerMessage', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.', true);
    return;
  }

  // Check if username or email is already registered
  if (registeredUsers.some(user => user.username === username || user.email === email)) {
    showMessage('registerMessage', 'Username or email is already registered.', true);
    return;
  }

  // Register the user
  registeredUsers.push({ username: username, email: email, password: password });
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

  // Display success message
  showMessage('registerMessage', 'Registered successfully.', false);
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var username = document.getElementById('loginUsername').value.trim();
  var password = document.getElementById('loginPassword').value;

  // Reset error messages
  clearMessage('loginMessage');

  // Validate fields
  if (!username || !password) {
    showMessage('loginMessage', 'Please fill in all fields.', true);
    return;
  }

  // Check if user is registered
  var user = registeredUsers.find(user => user.username === username && user.password === password);
  if (!user) {
    showMessage('loginMessage', 'Invalid username or password.', true);
    return;
  }

  // Display the chess game
  showChessGame(username);
});

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function checkPasswordStrength(password) {
  // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return re.test(password);
}

function showMessage(id, message, isError) {
  var messageElement = document.getElementById(id);
  messageElement.textContent = message;
  if (isError) {
    messageElement.style.color = 'red';
  } else {
    messageElement.style.color = 'green';
  }
}

function clearMessage(id) {
  document.getElementById(id).textContent = '';
}

function showChessGame(username) {
  document.querySelector('.container').style.display = 'none';
  var chessGameElement = document.getElementById('chessGame');
  chessGameElement.style.display = 'block';

  // Initialize chessboard and game
  var game = new Chess();
  var board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: function(source, target) {
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // promote to queen for simplicity
      });

      // Illegal move
      if (move === null) return 'snapback';
    },
    onSnapEnd: function() {
      board.position(game.fen());
    }
  });
}
