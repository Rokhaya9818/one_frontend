# Documentation des Endpoints API - Dashboard One Health Sénégal

## URL de base
- **Développement** : `http://localhost:3000/api/trpc`
- **Production** : `https://3000-ihc99yp4qknej10i9j62d-5db6f1bf.manusvm.computer/api/trpc`

## Architecture
Le dashboard utilise **tRPC** pour la communication client-serveur. Toutes les requêtes sont typées de bout en bout.

---

## Endpoints Disponibles

### 1. Authentication

#### `auth.me`
Récupère les informations de l'utilisateur connecté.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  createdAt: Date;
}
```

#### `auth.logout`
Déconnecte l'utilisateur.

**Type** : Mutation  
**Paramètres** : Aucun  
**Réponse** :
```typescript
{ success: true }
```

---

### 2. Dashboard - KPIs et Statistiques

#### `dashboard.kpis`
Récupère les indicateurs clés de performance (KPIs) du dashboard.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
{
  malariaCases: string;           // Nombre de cas de paludisme
  tuberculoseCases: string;       // Nombre de cas de tuberculose
  fvrHumainCases: number;         // Nombre de cas FVR humain
  fvrAnimalCases: number;         // Nombre de cas FVR animal
  grippeAviaireCases: number;     // Nombre d'incidents grippe aviaire
  pm25Recent: string;             // Pollution PM2.5 récente
}
```

#### `dashboard.fvrHumainTotal`
Total des cas confirmés de FVR humain.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** : `number`

#### `dashboard.fvrHumainByRegion`
Répartition géographique des cas FVR humain.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  region: string;
  total: number;
}>
```

#### `dashboard.fvrAnimalTotal`
Total des cas détectés de FVR animal.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** : `number`

#### `dashboard.fvrAnimalByRegion`
Répartition géographique des cas FVR animal.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  region: string;
  total: number;
}>
```

#### `dashboard.malariaByIndicator`
Répartition des indicateurs de paludisme.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  name: string;
  value: number;
}>
```

#### `dashboard.tuberculoseByIndicator`
Répartition des indicateurs de tuberculose.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  name: string;
  value: number;
}>
```

---

### 3. Paludisme (Malaria)

#### `malaria.list`
Liste des données de paludisme avec filtres optionnels.

**Type** : Query  
**Paramètres** :
```typescript
{
  yearStart?: number;
  yearEnd?: number;
}
```
**Réponse** :
```typescript
Array<{
  id: number;
  indicatorCode: string;
  indicatorName: string;
  year: number;
  value: string | null;
  numericValue: string | null;
  lowValue: string | null;
  highValue: string | null;
  createdAt: Date;
}>
```

---

### 4. Tuberculose

#### `tuberculose.list`
Liste des données de tuberculose avec filtres optionnels.

**Type** : Query  
**Paramètres** :
```typescript
{
  yearStart?: number;
  yearEnd?: number;
}
```
**Réponse** :
```typescript
Array<{
  id: number;
  indicatorCode: string;
  indicatorName: string;
  year: number;
  value: string | null;
  numericValue: string | null;
  lowValue: string | null;
  highValue: string | null;
  createdAt: Date;
}>
```

---

### 5. FVR Humain

#### `fvrHumain.list`
Liste de tous les cas de FVR humain.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  id: number;
  dateBilan: Date;
  casConfirmes: number;
  deces: number;
  gueris: number;
  region: string | null;
  district: string | null;
  tauxLetalite: string | null;
  createdAt: Date;
}>
```

---

### 6. FVR Animal

#### `fvrAnimal.list`
Liste de tous les cas de FVR animal.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  id: number;
  annee: number;
  cas: number;
  espece: string | null;
  region: string | null;
  localisation: string | null;
  source: string | null;
  createdAt: Date;
}>
```

---

### 7. Grippe Aviaire

#### `grippeAviaire.list`
Liste de tous les incidents de grippe aviaire.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  id: number;
  reportId: string;
  dateRapport: Date;
  region: string | null;
  espece: string | null;
  maladie: string | null;
  casConfirmes: number;
  deces: number;
  statutEpidemie: string | null;
  notes: string | null;
  source: string | null;
  createdAt: Date;
}>
```

---

### 8. Régions

#### `regions.list`
Liste de toutes les régions du Sénégal.

**Type** : Query  
**Paramètres** : Aucun  
**Réponse** :
```typescript
Array<{
  id: number;
  nom: string;
  code: string;
  population: number | null;
  superficieKm2: number | null;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
}>
```

---

### 9. Pollution de l'Air

#### `pollutionAir.list`
Liste des données de pollution de l'air avec filtres optionnels.

**Type** : Query  
**Paramètres** :
```typescript
{
  yearStart?: number;
  yearEnd?: number;
}
```
**Réponse** :
```typescript
Array<{
  id: number;
  annee: number;
  zone: string;
  concentrationPm25: string;
  createdAt: Date;
}>
```

---

## Utilisation avec tRPC Client

### Installation
```bash
pnpm add @trpc/client @trpc/react-query
```

### Exemple d'utilisation (React)
```typescript
import { trpc } from "@/lib/trpc";

function Dashboard() {
  // Query simple
  const { data: kpis, isLoading } = trpc.dashboard.kpis.useQuery();
  
  // Query avec paramètres
  const { data: malaria } = trpc.malaria.list.useQuery({
    yearStart: 2020,
    yearEnd: 2024
  });
  
  // Mutation
  const logout = trpc.auth.logout.useMutation();
  
  return (
    <div>
      {isLoading ? "Chargement..." : `FVR Humain: ${kpis?.fvrHumainCases} cas`}
    </div>
  );
}
```

---

## Codes d'Erreur

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentification requise |
| `FORBIDDEN` | Accès refusé (permissions insuffisantes) |
| `NOT_FOUND` | Ressource non trouvée |
| `INTERNAL_SERVER_ERROR` | Erreur serveur |
| `BAD_REQUEST` | Paramètres invalides |

---

## Notes Importantes

1. **Authentification** : Actuellement désactivée pour le dashboard public. Pour activer, utiliser `protectedProcedure` au lieu de `publicProcedure`.

2. **CORS** : Configuré pour accepter toutes les origines en développement. À restreindre en production.

3. **Rate Limiting** : Non implémenté actuellement. Recommandé pour la production.

4. **Cache** : Les données sont récupérées en temps réel. Envisager un cache Redis pour améliorer les performances.

5. **Pagination** : Non implémentée. Toutes les requêtes retournent l'ensemble des données. À implémenter pour les grandes tables.

---

## Statistiques de la Base de Données

- **Paludisme** : 138 enregistrements
- **Tuberculose** : 325 enregistrements
- **FVR Humain** : 7 enregistrements
- **FVR Animal** : 34 enregistrements
- **Grippe Aviaire** : 7 enregistrements
- **Pollution Air** : 197 enregistrements
- **Régions** : 14 enregistrements

**Date de dernière mise à jour** : 2025-01-11
