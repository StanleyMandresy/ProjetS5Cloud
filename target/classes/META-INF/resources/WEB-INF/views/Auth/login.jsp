<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Système de Vente</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            display: flex;
            max-width: 1000px;
            width: 100%;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        
        .welcome-section {
            flex: 1;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .welcome-section h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .welcome-section p {
            font-size: 1.1rem;
            line-height: 1.6;
            opacity: 0.9;
        }
        
        .login-section {
            flex: 1;
            padding: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 30px;
            color: #667eea;
        }
        
        .logo i {
            font-size: 2rem;
        }
        
        .logo h2 {
            font-size: 1.8rem;
        }
        
        h3 {
            color: #333;
            margin-bottom: 30px;
            font-size: 1.8rem;
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
            color: #667eea;
        }
        
        .input-with-icon input {
            width: 100%;
            padding: 15px 15px 15px 45px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .input-with-icon input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn-login {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .links {
            text-align: center;
            margin-top: 20px;
        }
        
        .links a {
            color: #667eea;
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
        
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }
            
            .welcome-section, .login-section {
                padding: 30px;
            }
        }
        
        .demo-credentials {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 0.9rem;
        }
        
        .demo-credentials h4 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .demo-credentials p {
            color: #666;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="welcome-section">
            <h1>Bienvenue !</h1>
            <p>Connectez-vous à votre compte pour accéder au système de gestion de vente et de stock.</p>
            <p>Système sécurisé avec authentification JWT et gestion des rôles.</p>
            
            <div class="demo-credentials">
                <h4>Compte de test :</h4>
                <p><strong>Utilisateur :</strong> magasinier</p>
                <p><strong>Mot de passe :</strong> password123</p>
            </div>
        </div>
        
        <div class="login-section">
            <div class="logo">
                <i class="fas fa-warehouse"></i>
                <h2>StockVente Pro</h2>
            </div>
            
            <h3>Connectez-vous à votre compte</h3>
            
            <c:if test="${not empty error}">
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i> ${error}
                </div>
            </c:if>
            
            <c:if test="${not empty message}">
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> ${message}
                </div>
            </c:if>
            
            <form action="${pageContext.request.contextPath}/auth/login" method="post">
                <div class="form-group">
                    <label for="username">Nom d'utilisateur</label>
                    <div class="input-with-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="username" name="username" 
                               placeholder="Entrez votre nom d'utilisateur" 
                               value="${username}" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" 
                               placeholder="Entrez votre mot de passe" required>
                    </div>
                </div>
                
                <button type="submit" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </form>
            
            <div class="links">
                <p>Vous n'avez pas de compte ? <a href="${pageContext.request.contextPath}/auth/register">S'inscrire</a></p>
            </div>
        </div>
    </div>
    
    <script>
        // Animation pour les inputs
        document.querySelectorAll('.input-with-icon input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
        
        // Afficher/masquer mot de passe
        const passwordInput = document.getElementById('password');
        const passwordToggle = document.createElement('i');
        passwordToggle.className = 'fas fa-eye';
        passwordToggle.style.position = 'absolute';
        passwordToggle.style.right = '15px';
        passwordToggle.style.top = '50%';
        passwordToggle.style.transform = 'translateY(-50%)';
        passwordToggle.style.cursor = 'pointer';
        passwordToggle.style.color = '#667eea';
        
        passwordInput.parentElement.appendChild(passwordToggle);
        
        passwordToggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                this.className = 'fas fa-eye';
            }
        });
    </script>
</body>
</html>