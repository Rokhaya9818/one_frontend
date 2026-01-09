# Dashboard One Health Sénégal - TODO

## Fonctionnalités à implémenter

### Phase 1: Structure et Design
- [x] Adapter le design au style SaniVision (palette rouge bordeaux, cartes KPI colorées)
- [x] Créer le schéma de base de données pour les données One Health
- [x] Configurer les couleurs et le thème global dans index.css

### Phase 2: Backend et API
- [x] Créer les tables de base de données (malaria, tuberculose, FVR, environnement, etc.)
- [x] Importer les données depuis les fichiers CSV fournis
- [x] Créer les procédures tRPC pour récupérer les données

### Phase 3: Dashboard Principal
- [x] Créer la page d'accueil avec cartes KPI principales
- [ ] Implémenter la section Santé Humaine (Paludisme, Tuberculose)
- [ ] Implémenter la section Santé Animale (Grippe Aviaire, Mortalité)
- [ ] Implémenter la section Environnement (Pluviométrie, Pollution PM2.5)
- [ ] Implémenter la section Zoonoses (FVR)
- [ ] Implémenter la section Corrélations & Alertes One Health

### Phase 4: Visualisations
- [ ] Créer les graphiques interactifs avec Recharts
- [ ] Implémenter la carte interactive du Sénégal
- [ ] Ajouter les filtres de dates et régions
- [ ] Créer le système d'alertes automatiques

### Phase 5: Finalisation
- [ ] Tester toutes les fonctionnalités
- [ ] Optimiser les performances
- [ ] Vérifier l'utilité pour les décideurs
- [ ] Créer la documentation utilisateur

### Phase 6: Améliorations demandées
- [x] Corriger les statistiques à 0 en important plus de données CSV
- [x] Restructurer la page d'accueil : enlever évolutions, ajouter répartition des données
- [x] Créer les onglets : Vue d'ensemble, Santé Humaine, Santé Animale, Environnement
- [x] Ajouter une carte interactive du Sénégal avec FVR et paludisme par région
- [x] Implémenter les filtres : Jour/Semaine/Mois/Année/Période personnalisée
- [x] Ajouter les filtres par région et type de maladie
- [x] Créer des graphiques de répartition (donut, barres) comme SaniVision
- [x] Afficher les détails importants pour chaque section (Humaine, Animale, Environnement)

### Phase 7: Corrections finales
- [x] Vue d'ensemble : Remplacer Patients/Prestations par FVR/Grippe aviaire/Palu/Tuberculose
- [x] Corriger les graphiques de répartition pour qu'ils soient visibles avec vraies données
- [x] Carte interactive : Afficher uniquement FVR humain, FVR animal, Paludisme (avec données géographiques)
- [x] Section Environnement : Ajouter graphiques/tableaux clairs avec vraies données
- [x] Utiliser les vrais chiffres de la base de données et fichiers Excel du zip

### Phase 8: Corrections finales des graphiques et cartes
- [x] Corriger les graphiques Paludisme/Tuberculose pour qu'ils s'affichent sur Vue d'ensemble
- [x] Mettre la carte du Sénégal uniquement pour FVR humain, FVR animal et Paludisme
- [x] Améliorer l'affichage détaillé Paludisme/Tuberculose dans Santé Humaine
- [x] Corriger la pollution à 0 dans Environnement (42.5 µg/m³)
- [x] Enlever les corrélations dans Environnement
- [x] Remplacer tous les "Chargement des données..." par vraies données ou les enlever
- [x] Vérifier et afficher uniquement les cartes avec données géographiques réelles
