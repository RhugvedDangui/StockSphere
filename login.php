<?php
session_start();
require_once 'db.php'; // Database connection

// Initialize error message variable
$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'login') {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $_SESSION['username'] = $username;
                header("Location: invoice.html");
                exit();
            } else {
                $error = "Invalid credentials!";
            }
        } else {
            $error = "Invalid credentials!";
        }
        $stmt->close();
    } elseif (isset($_POST['action']) && $_POST['action'] === 'signup') {
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
    
        if ($password !== $confirm_password) {
            $error = "Passwords do not match.";
        } else {
            // Check if username or email already exists
            $check_user = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
            $check_user->bind_param("ss", $username, $email);
            $check_user->execute();
            $result = $check_user->get_result();
    
            if ($result->num_rows > 0) {
                $error = "Username or email already exists.";
            } else {
                // Hash the password
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
                // Insert the new user
                $insert_user = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
                $insert_user->bind_param("sss", $username, $email, $hashed_password);
    
                if ($insert_user->execute()) {
                    // Set session variables after successful registration
                    $_SESSION['username'] = $username; // Save the username
                    $_SESSION['user_id'] = $conn->insert_id; // Save the user_id (auto-generated id from the insert)
    
                    // Redirect to 'createDatabase.php' after successful registration
                    header("Location: createDatabase.php");
                    exit();
                } else {
                    $error = "Error registering user. Please try again.";
                }
                $check_user->close();
                $insert_user->close();
            }
        }
    }
}

$conn->close();
?>




<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login/Sign-Up Interface</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f2f5;
        }

        .login-block {
            width: 1200px;
            height: 600px;
            border-radius: 50px;
            background-image: url('login.jpeg');
            display: flex;
            align-items: center;
            justify-content: flex-end;
            background-size: cover;
            position: relative;
            transition: background-image 0.5s ease-in-out;
        }

        .box {
            width: 35%;
            height: 80%;
            background-color: rgba(128, 166, 203, 0.78);
            border-radius: 20px;
            margin: 0 12px;
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            transition: opacity 0.5s ease-in-out;
        }

        .box.active {
            display: flex;
        }

        .logo {
            width: 190px;
            height: 100px;
            color: white;
            font-size: 30px;
            font-weight: bold;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin-bottom: 20px;
        }

        .box form {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 12px;
            padding: 20px;
        }

        .in {
            width: 70%;
            height: 40px;
            padding: 10px 15px;
            background-color: rgba(222, 222, 235, 0.773);
            font-size: 16px;
            border-radius: 17px;
            border: none;
            outline: none;
            transition: border 0.3s ease;
        }

        .in:hover {
            border: 2px solid rgba(0, 156, 171, 0.8);
        }

        .btn {
            border-radius: 17px;
            border: none;
            background-color: rgb(10, 59, 88);
            width: 40%;
            color: rgba(255, 255, 255, 0.9);
            height: 40px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .btn:hover {
            background-color: rgb(0, 45, 67);
        }

        .toggle-link {
            margin-top: 15px;
            color: rgba(0, 0, 0, 0.589);
            cursor: pointer;
            text-decoration: underline;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="login-block" id="loginBlock">
        <div class="box login active" id="loginBox">
            <form action="" method="POST" id="loginForm">
                <input type="hidden" name="action" value="login">
                <div class="logo">
                    LOGIN
                </div>
                <input class="in" name="username" placeholder="Username" type="text" required minlength="3">
                <input class="in" name="password" placeholder="Password" type="password" required minlength="6">
                <input class="btn" value="Login" type="submit">
                <div class="toggle-link" id="toSignUp">Don't have an account? Sign up</div>
            </form>
            <?php if (isset($error)): ?>
                <p class="error"><?php echo $error; ?></p> <!-- Added class for error styling -->
            <?php endif; ?>
        </div>
        <div class="box sign-up" id="signUpBox">
            <form action="" method="POST" id="signUpForm">
                <input type="hidden" name="action" value="signup">
                <div class="logo">
                    SIGN UP
                </div>
                <input class="in" name="username" placeholder="Username" type="text" required minlength="3">
                <input class="in" name="email" placeholder="Email" type="email" required>
                <input class="in" name="password" placeholder="Password" required minlength="6" id="passwordSU">
                <input class="in" name="confirm_password" placeholder="Confirm Password" required minlength="6">
                <input class="btn" value="Sign Up" type="submit">
                <div class="toggle-link" id="toLogin">Already have an account? Login</div>
            </form>
            <?php if (isset($error)): ?>
                <p class="error"><?php echo $error; ?></p> <!-- Added class for error styling -->
            <?php endif; ?>
        </div>
    </div>

    <script>
        const loginBlock = document.getElementById('loginBlock');
        const loginBox = document.getElementById('loginBox');
        const signUpBox = document.getElementById('signUpBox');
        const toSignUp = document.getElementById('toSignUp');
        const toLogin = document.getElementById('toLogin');

        function showSignUp() {
            loginBox.classList.remove('active');
            signUpBox.classList.add('active');
            loginBlock.style.backgroundImage = "url('signupBackground.jpeg')";
            loginBlock.style.justifyContent = "flex-start";
        }

        function showLogin() {
            signUpBox.classList.remove('active');
            loginBox.classList.add('active');
            loginBlock.style.backgroundImage = "url('login.jpeg')";
            loginBlock.style.justifyContent = "flex-end";
        }

        function validateSignUpForm() {
            const password = document.getElementById('passwordSU').value;
            const confirmPassword = document.querySelector('[name="confirm_password"]').value;
            if (password !== confirmPassword) {
            alert(confirmPassword);
            return false; // Prevent form submission
        }
        return true; // Allow form submission
    }

            toSignUp.addEventListener('click', showSignUp);
            toLogin.addEventListener('click', showLogin);

            document.getElementById('loginForm').addEventListener('submit', function(event) {
                const username = document.querySelector('[name="username"]').value;
                const password = document.querySelector('[name="password"]').value;
                if (username.trim() === '' || password.trim() === '') {
                    event.preventDefault();
                    alert('Please fill in all fields.');
                }
            });

            document.getElementById('signUpForm').addEventListener('submit', function(event) {
                if (!validateSignUpForm()) {
                    event.preventDefault(); // Prevent form submission
                }
            });
    </script>
</body>

</html>