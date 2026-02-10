# Sélection de Date lors du Changement de Statut

## Modifications apportées

### Backend

#### 1. `UpdatePointReparationRequest.java`
- **Ajout de champs** : `dateDebutTravaux` et `dateFinTravaux` de type `LocalDate`
- **Getters/Setters** : Ajout des méthodes pour accéder et modifier ces dates

#### 2. `PointReparationService.java`
- **Logique modifiée** : Lors du changement de statut
  - Si passage à `EN_COURS` : utilise `dateDebutTravaux` si fournie, sinon `LocalDate.now()`
  - Si passage à `TERMINE` : utilise `dateFinTravaux` si fournie, sinon `LocalDate.now()`
- **Mise à jour explicite** : Permet de modifier les dates même après leur première assignation

### Frontend

#### 1. `Manager.tsx`
- **Nouveaux états** :
  - `showDatePickerModal` : contrôle l'affichage du modal de sélection de date
  - `pendingStatusChange` : stocke le changement de statut en attente
  - `selectedDate` : stocke la date sélectionnée par l'utilisateur

- **Fonction modifiée** : `handleQuickStatusChange`
  - Détecte les changements vers `EN_COURS` ou `TERMINE`
  - Ouvre un modal pour choisir la date avant d'appliquer le changement

- **Nouvelle fonction** : `executeStatusChange`
  - Exécute le changement de statut avec la date sélectionnée
  - Envoie `dateDebutTravaux` pour EN_COURS
  - Envoie `dateFinTravaux` pour TERMINE

- **Nouveau modal** : Modal de sélection de date
  - Input de type `date` avec validation (pas de date future)
  - Affiche le statut cible
  - Boutons Annuler et Confirmer

## Utilisation

1. Dans la liste des travaux, cliquez sur le menu déroulant du statut
2. Sélectionnez `EN_COURS` ou `TERMINE`
3. Un modal s'affiche vous demandant de choisir une date
4. La date par défaut est aujourd'hui
5. Vous pouvez choisir n'importe quelle date passée ou présente
6. Cliquez sur "Confirmer" pour valider le changement

## Avantages

✅ Plus de flexibilité pour enregistrer des changements rétroactifs
✅ Meilleure traçabilité des dates réelles de début et fin
✅ Interface utilisateur intuitive avec validation
✅ Possibilité de corriger des dates incorrectes

## Note

Pour les autres changements de statut (ex: revenir à `NOUVEAU`), le changement s'effectue immédiatement sans sélection de date.
