<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de bord - Système de Vente</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: #f5f7fa;
        }
        
        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .navbar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .navbar-brand i {
            font-size: 1.8rem;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            background: white;
            color: #667eea;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            text-transform: uppercase;
        }
        
        .logout-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 20px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .logout-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        
        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
        }
        
        .welcome-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            text-align: center;
            border-left: 5px solid #667eea;
        }
        
        .welcome-card h1 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .welcome-card p {
            color: #666;
            font-size: 1.1rem;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .dashboard-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            border-top: 4px solid;
        }
        
        .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .card-1 { border-color: #667eea; }
        .card-2 { border-color: #2ecc71; }
        .card-3 { border-color: #e74c3c; }
        .card-4 { border-color: #f39c12; }
        
        .card-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: inherit;
        }
        
        .card-title {
            font-size: 1.3rem;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .card-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .card-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: transform 0.3s;
        }
        
        .card-btn:hover {
            transform: translateX(5px);
            color: white;
        }
        
        .alert {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 0.95rem;
            background-color: #efe;
            color: #393;
            border: 1px solid #cfc;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .alert i {
            font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                gap: 15px;
                padding: 15px;
            }
            
            .welcome-card {
                padding: 25px;
            }
            
            .container {
                padding: 0 15px;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-brand">
            <i class="fas fa-warehouse"></i>
            <span>StockVente Pro</span>
        </div>
        
        <div class="user-info">
            <div class="user-avatar" id="userAvatar">
                <!-- L'initial sera mis par JavaScript -->
            </div>
            <span>${sessionScope.username}</span>
            <a href="${pageContext.request.contextPath}/auth/logout" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Déconnexion
            </a>
        </div>
    </nav>
    
    <div class="container">
        <c:if test="${not empty success}">
            <div class="alert">
                <i class="fas fa-check-circle"></i> ${success}
            </div>
        </c:if>
        
        <div class="welcome-card">
            <h1>Bienvenue, ${sessionScope.username}!</h1>
            <p>Vous êtes connecté au système de gestion de vente et de stock.</p>
            <p>Email: ${sessionScope.email} | User ID: ${sessionScope.userId}</p>
            <div id="currentTime" style="margin-top: 20px; color: #666; font-size: 0.9rem;"></div>
        </div>
        
        <div class="dashboard-grid">
            <div class="dashboard-card card-1">
                <div class="card-icon">
                    <i class="fas fa-boxes"></i>
                </div>
                <h3 class="card-title">Gestion des Stocks</h3>
                <p class="card-description">
                    Gérez votre inventaire, suivez les niveaux de stock, et recevez des alertes 
                    lorsque les stocks sont bas.
                </p>
                <a href="#" class="card-btn">
                    <i class="fas fa-arrow-right"></i> Accéder au stock
                </a>
            </div>
            
            <div class="dashboard-card card-2">
                <div class="card-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3 class="card-title">Ventes & Commandes</h3>
                <p class="card-description">
                    Gérez les ventes, suivez les commandes clients, et générez des factures 
                    automatiquement.
                </p>
                <a href="#" class="card-btn">
                    <i class="fas fa-arrow-right"></i> Voir les ventes
                </a>
            </div>
            
            <div class="dashboard-card card-3">
                <div class="card-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3 class="card-title">Rapports & Analytics</h3>
                <p class="card-description">
                    Analysez les performances de vente, les tendances de stock, et générez 
                    des rapports détaillés.
                </p>
                <a href="#" class="card-btn">
                    <i class="fas fa-arrow-right"></i> Voir les rapports
                </a>
            </div>
            
            <div class="dashboard-card card-4">
                <div class="card-icon">
                    <i class="fas fa-users-cog"></i>
                </div>
                <h3 class="card-title">Gestion des Utilisateurs</h3>
                <p class="card-description">
                    Gérez les utilisateurs, attribuez des rôles et permissions, et contrôlez 
                    l'accès au système.
                </p>
                <a href="#" class="card-btn">
                    <i class="fas fa-arrow-right"></i> Gérer les utilisateurs
                </a>
            </div>
        </div>
    </div>
    
    <script>
        // Mettre l'initial de l'utilisateur dans l'avatar
        function updateUserAvatar() {
            const username = '${sessionScope.username}';
            if (username && username.length > 0) {
                const firstLetter = username.charAt(0).toUpperCase();
                document.getElementById('userAvatar').textContent = firstLetter;
            } else {
                document.getElementById('userAvatar').textContent = 'U';
            }
        }
        
        // Afficher l'heure actuelle
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const timeElement = document.getElementById('currentTime');
            if (timeElement) {
                timeElement.textContent = `${dateString} - ${timeString}`;
            }
        }
        
        // Animation pour les cartes
        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const cards = document.querySelectorAll('.dashboard-card');
                cards.forEach(c => {
                    if (c !== this) {
                        c.style.opacity = '0.7';
                        c.style.transform = 'scale(0.98)';
                    }
                });
            });
            
            card.addEventListener('mouseleave', function() {
                const cards = document.querySelectorAll('.dashboard-card');
                cards.forEach(c => {
                    c.style.opacity = '1';
                    c.style.transform = 'scale(1)';
                });
            });
        });
        
        // Initialiser
        updateUserAvatar();
        updateTime();
        setInterval(updateTime, 1000);
    </script>
</body>
</html>