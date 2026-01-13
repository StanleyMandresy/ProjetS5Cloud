<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription - Système de Vente</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
     <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #4f8cff 0%, #2ecc71 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #4f8cff 0%, #2ecc71 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .header .logo i {
            font-size: 2.5rem;
        }

        .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 1rem;
        }

        .form-container {
            padding: 40px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }

        .input-with-icon {
            position: relative;
        }

        .input-with-icon i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #4f8cff;
        }

        .input-with-icon input {
            width: 100%;
            padding: 15px 15px 15px 45px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s;
        }

        .input-with-icon input:focus {
            outline: none;
            border-color: #4f8cff;
            box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
        }

        .password-strength {
            margin-top: 5px;
            font-size: 0.85rem;
            color: #666;
        }

        .strength-bar {
            height: 5px;
            background: #eee;
            border-radius: 3px;
            margin-top: 5px;
            overflow: hidden;
        }

        .strength-fill {
            height: 100%;
            width: 0%;
            transition: width 0.3s, background 0.3s;
        }

        .btn-register {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #4f8cff 0%, #2ecc71 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .btn-register:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(79, 140, 255, 0.4);
        }

        .links {
            text-align: center;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .links a {
            color: #4f8cff;
            text-decoration: none;
            font-weight: 500;
        }

        .links a:hover {
            text-decoration: underline;
        }

        .alert {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 0.95rem;
        }

        .alert-error {
            background-color: #fee;
            color: #c33;
            border: 1px solid #fcc;
        }

        .alert-success {
            background-color: #efe;
            color: #393;
            border: 1px solid #cfc;
        }

        .terms {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            font-size: 0.9rem;
            color: #666;
        }

        .terms input[type="checkbox"] {
            width: 18px;
            height: 18px;
        }

        .terms a {
            color: #4f8cff;
            text-decoration: none;
        }

        @media (max-width: 600px) {
            .form-container {
                padding: 30px 20px;
            }

            .header {
                padding: 20px;
            }

            form-select {
                width: 100%;
                padding: 15px 15px 15px 45px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s;
                background-color: white;
                cursor: pointer;
                appearance: none;
            }

            .form-select:focus {
                outline: none;
                border-color: #4f8cff;
                box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
            }

            .select-with-icon {
                position: relative;
            }

            .select-with-icon i {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #4f8cff;
                z-index: 1;
            }

            .select-with-icon select {
                padding-left: 45px;
            }

            .select-with-icon::after {
                content: '\f078';
                font-family: 'Font Awesome 5 Free';
                font-weight: 900;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #4f8cff;
                pointer-events: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <i class="fas fa-user-plus"></i>
                <h1>Créer un compte</h1>
            </div>
            <p>Rejoignez notre système de gestion de vente et de stock</p>
        </div>
        
        <div class="form-container">
            <c:if test="${not empty error}">
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i> ${error}
                </div>
            </c:if>
            
            <form action="${pageContext.request.contextPath}/auth/register" method="post" id="registerForm">
                <div class="form-group">
                    <label for="username">Nom d'utilisateur *</label>
                    <div class="input-with-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="username" name="username" 
                               placeholder="Choisissez un nom d'utilisateur" 
                               value="${username}" required>
                    </div>
                    <small id="usernameFeedback" class="password-strength"></small>
                </div>
                
                <div class="form-group">
                    <label for="email">Adresse email *</label>
                    <div class="input-with-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="email" name="email" 
                               placeholder="Votre adresse email" 
                               value="${email}" required>
                    </div>
                    <small id="emailFeedback" class="password-strength"></small>
                </div>

   <div class="form-group">
    <label for="role">Rôle *</label>
    <div class="input-with-icon">
        <i class="fas fa-user-tag"></i>
        <select id="roleName" name="roleName" class="form-select" required>
            <option value="">Sélectionnez un rôle</option>
            <c:forEach var="role" items="${roles}">
                <option value="${role.name}" 
                        ${param.role == role.name ? 'selected' : ''}>
                    ${role.name} - ${role.description}
                </option>
            </c:forEach>
        </select>
    </div>
    <small class="password-strength">
        <i class="fas fa-info-circle"></i> Votre rôle déterminera vos permissions dans le système
    </small>
</div>
                
                
                <div class="form-group">
                    <label for="password">Mot de passe *</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" 
                               placeholder="Créez un mot de passe sécurisé" required>
                    </div>
                    <div class="password-strength">
                        Force du mot de passe: <span id="strengthText">Faible</span>
                        <div class="strength-bar">
                            <div class="strength-fill" id="strengthFill"></div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirmer le mot de passe *</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="confirmPassword" name="confirmPassword" 
                               placeholder="Retapez votre mot de passe" required>
                    </div>
                    <small id="passwordMatch" class="password-strength"></small>
                </div>
                
                <div class="terms">
                    <input type="checkbox" id="terms" name="terms" required>
                    <label for="terms">
                        J'accepte les <a href="#">conditions d'utilisation</a> et la 
                        <a href="#">politique de confidentialité</a>
                    </label>
                </div>
                
                <button type="submit" class="btn-register" id="submitBtn">
                    <i class="fas fa-user-plus"></i> S'inscrire
                </button>
            </form>
            
            <div class="links">
                <p>Vous avez déjà un compte ? <a href="${pageContext.request.contextPath}/auth/login">Se connecter</a></p>
            </div>
        </div>
    </div>
    
    <script>
        // Vérification en temps réel
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const strengthText = document.getElementById('strengthText');
        const strengthFill = document.getElementById('strengthFill');
        const passwordMatch = document.getElementById('passwordMatch');
        const usernameFeedback = document.getElementById('usernameFeedback');
        const emailFeedback = document.getElementById('emailFeedback');
        const submitBtn = document.getElementById('submitBtn');
        
        // Vérifier la disponibilité du username
        usernameInput.addEventListener('blur', function() {
            const username = this.value;
            
            if (username.length < 3) {
                usernameFeedback.textContent = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
                usernameFeedback.style.color = '#c33';
                return;
            }
            
            // Vérification AJAX pour l'username
            fetch('${pageContext.request.contextPath}/auth/api/check-username/' + encodeURIComponent(username))
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        usernameFeedback.textContent = 'Ce nom d\'utilisateur est déjà pris';
                        usernameFeedback.style.color = '#c33';
                    } else {
                        usernameFeedback.textContent = 'Nom d\'utilisateur disponible';
                        usernameFeedback.style.color = '#393';
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la vérification du username:', error);
                });
        });
        
        // Vérifier la disponibilité de l'email
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                emailFeedback.textContent = 'Format d\'email invalide';
                emailFeedback.style.color = '#c33';
                return;
            }
            
            // Vérification AJAX pour l'email
            fetch('${pageContext.request.contextPath}/auth/api/check-email/' + encodeURIComponent(email))
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        emailFeedback.textContent = 'Cet email est déjà utilisé';
                        emailFeedback.style.color = '#c33';
                    } else {
                        emailFeedback.textContent = 'Email disponible';
                        emailFeedback.style.color = '#393';
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la vérification de l\'email:', error);
                });
        });
        
        // Calcul de la force du mot de passe
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
            const strengthColors = ['#c33', '#f93', '#fc3', '#6c3', '#393'];
            const strengthPercent = (strength / 4) * 100;
            
            strengthText.textContent = strengthLabels[strength];
            strengthText.style.color = strengthColors[strength];
            strengthFill.style.width = `${strengthPercent}%`;
            strengthFill.style.background = strengthColors[strength];
        });
        
        // Vérification de la correspondance des mots de passe
        function checkPasswordMatch() {
            if (passwordInput.value && confirmPasswordInput.value) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    passwordMatch.textContent = 'Les mots de passe ne correspondent pas';
                    passwordMatch.style.color = '#c33';
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.6';
                } else {
                    passwordMatch.textContent = 'Les mots de passe correspondent';
                    passwordMatch.style.color = '#393';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            }
        }
        
        passwordInput.addEventListener('input', checkPasswordMatch);
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        
        // Afficher/masquer mot de passe
        [passwordInput, confirmPasswordInput].forEach((input, index) => {
            const toggle = document.createElement('i');
            toggle.className = 'fas fa-eye';
            toggle.style.position = 'absolute';
            toggle.style.right = '15px';
            toggle.style.top = '50%';
            toggle.style.transform = 'translateY(-50%)';
            toggle.style.cursor = 'pointer';
            toggle.style.color = '#4f8cff';
            toggle.style.zIndex = '2';
            
            input.parentElement.appendChild(toggle);
            
            toggle.addEventListener('click', function() {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    this.className = 'fas fa-eye';
                }
            });
        });
        
        // Validation du formulaire
        document.getElementById('registerForm').addEventListener('submit', function(event) {
            // Vérifier que les mots de passe correspondent
            if (passwordInput.value !== confirmPasswordInput.value) {
                event.preventDefault();
                alert('Les mots de passe ne correspondent pas!');
                return;
            }
            
            // Vérifier les termes et conditions
            if (!document.getElementById('terms').checked) {
                event.preventDefault();
                alert('Vous devez accepter les conditions d\'utilisation!');
                return;
            }
        });
    </script>
</body>
</html>