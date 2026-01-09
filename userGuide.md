# Guide Utilisateur - Dashboard One Health Sénégal

## Informations Générales

**Objectif** : Visualiser et analyser les données de santé publique selon l'approche One Health (santé humaine, animale et environnementale) pour faciliter la prise de décision sanitaire.

**Accès** : Public, aucune authentification requise pour consulter les données.

---

## Powered by Manus

Ce dashboard est construit avec une stack technologique moderne et performante garantissant rapidité, fiabilité et évolutivité.

**Frontend** : React 19 avec TypeScript pour une interface utilisateur réactive et typée. Tailwind CSS 4 pour un design moderne et responsive inspiré de SaniVision. Recharts pour des visualisations de données interactives et élégantes. Carte interactive du Sénégal avec répartition géographique des cas.

**Backend** : Express 4 avec tRPC 11 pour une communication type-safe entre le client et le serveur. Les données circulent de manière sécurisée avec validation automatique côté client et serveur.

**Base de données** : MySQL/TiDB avec Drizzle ORM pour une gestion efficace des données de santé. Le schéma inclut des tables pour le paludisme, la tuberculose, la FVR (humaine et animale), la grippe aviaire, la pollution de l'air et les régions du Sénégal.

**Déploiement** : Infrastructure auto-scalable avec CDN global pour des temps de chargement optimaux partout dans le monde.

---

## Utiliser Votre Dashboard

Le dashboard s'organise en quatre sections principales accessibles via les onglets en haut de page. Cliquez sur "Vue d'ensemble" pour voir tous les indicateurs clés, "Santé Humaine" pour les maladies humaines (paludisme, tuberculose, FVR), "Santé Animale" pour les zoonoses (FVR animal, grippe aviaire), ou "Environnement" pour les facteurs environnementaux (pollution PM2.5, pluviométrie).

Utilisez les **filtres** en haut de page pour affiner votre analyse. Sélectionnez une région dans le menu déroulant "Région" pour voir les données d'une zone spécifique. Choisissez un type de maladie dans "Type de Maladie" pour filtrer par pathologie. La section "Période" propose six options : cliquez sur "Jour" pour les données quotidiennes, "Semaine" pour hebdomadaires, "Mois" pour mensuelles, "Année" pour annuelles, ou "Période personnalisée" pour définir vos propres dates. Le bouton "Actualiser" recharge les données et "Export" télécharge un rapport.

Les **cartes KPI** affichent les indicateurs clés avec des couleurs distinctives. Chaque carte montre un chiffre principal (nombre de cas, taux, etc.), une variation en pourcentage avec flèche verte (amélioration) ou rouge (dégradation), et des barres de progression en bas. Les couleurs suivent le code SaniVision : bleu pour patients, vert pour prestations, violet pour prescriptions, cyan pour chiffre d'affaires.

La **carte interactive du Sénégal** montre la répartition géographique des cas par région. Les cercles colorés indiquent l'intensité : vert pour faible (0-20%), jaune pour modéré (20-40%), orange pour élevé (40-70%), rouge pour très élevé (plus de 70%). La taille des cercles est proportionnelle au nombre de cas. Survolez une région pour voir les détails.

Les **graphiques de répartition** utilisent des diagrammes circulaires (camemberts) et des barres pour montrer la distribution des cas par type d'indicateur. Les couleurs varient pour faciliter la distinction entre catégories.

---

## Gérer Votre Dashboard

Accédez au **panneau de gestion** en cliquant sur l'icône dans l'en-tête. Vous y trouverez plusieurs sections.

La section **Preview** vous permet de visualiser le dashboard tel qu'il apparaît aux utilisateurs. La section **Code** donne accès à tous les fichiers du projet avec possibilité de téléchargement. La section **Dashboard** affiche les statistiques d'utilisation (UV/PV) et permet de gérer la visibilité du site.

Dans **Settings → General**, vous pouvez modifier le nom et le logo du site. Dans **Settings → Domains**, vous pouvez personnaliser le domaine (xxx.manus.space) ou lier un domaine personnalisé. La section **Database** offre une interface CRUD complète pour gérer les données de santé directement.

---

## Prochaines Étapes

Parlez à Manus AI à tout moment pour demander des modifications ou ajouter des fonctionnalités. Vous pouvez par exemple demander d'ajouter des filtres avancés, d'intégrer des données en temps réel via API, de créer des rapports PDF automatiques, ou d'ajouter des alertes email pour les décideurs.

Le dashboard est conçu pour évoluer avec vos besoins. Les données actuelles proviennent de fichiers CSV importés. Pour une utilisation en production, envisagez de connecter des sources de données en temps réel et d'automatiser les mises à jour quotidiennes.
