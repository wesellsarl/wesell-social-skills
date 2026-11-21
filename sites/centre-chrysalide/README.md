# Centre Chrysalide – refonte du site

Site statique (HTML/CSS/JS, aucune dépendance) + `contact.php` pour le formulaire. Déploiement : copier le dossier dans `public_html/` d'un hébergement PHP (cPanel).

## À faire avant mise en ligne
1. **Logo** : remplacer `assets/logo.svg` (provisoire) par le logo officiel — même nom, ou adapter les `src` dans `index.html` et `mentions-legales.html`.
2. **Équipe** : la liste dans `js/main.js` (`TEAM`) provient d'une page datée 2015-2021 → **à valider avec le centre** ; ajouter psychologues, neuropsychologues, kiné, diététicien·ne, photos (`assets/team/…`) et liens de réservation (Rosa, etc.).
3. **Contenu** : relire les puces des disciplines (`DISCIPLINES`) et la section remboursements avec les thérapeutes.
4. **Mentions légales** : compléter n° BCE et hébergeur.
5. **E-mail** : vérifier que `no-reply@centrechrysalide.be` peut envoyer (SPF/DKIM) ; tester le formulaire après upload.
6. Ajouter `assets/og-image.jpg` (1200×630) pour le partage sur les réseaux.
7. Créer / revendiquer la fiche Google Business Profile avec la même adresse et le même téléphone.

## Modifier le contenu
Disciplines et équipe : tableaux `DISCIPLINES` et `TEAM` en tête de `js/main.js`.
