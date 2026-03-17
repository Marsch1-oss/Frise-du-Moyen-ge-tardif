# Frise chronologique — Moyen Âge tardif (1300–1500)

Frise interactive à 3 niveaux de zoom, avec pistes géographiques et fiches événements.

## Structure des fichiers

```
frise-medievale/
├── index.html       ← Page principale (ne pas modifier)
├── frise.js         ← Logique de la frise (ne pas modifier)
├── events.json      ← VOS DONNÉES — seul fichier à éditer
├── images/          ← Vos illustrations (créer ce dossier)
└── README.md
```

## Mise en ligne sur GitHub Pages (gratuit)

### 1. Créer un compte GitHub
Rendez-vous sur https://github.com et créez un compte gratuit.

### 2. Créer un dépôt
- Cliquez sur "New repository"
- Nommez-le `frise-medievale`
- Cochez "Public"
- Cliquez "Create repository"

### 3. Déposer les fichiers
- Cliquez "uploading an existing file"
- Glissez-déposez les 3 fichiers (index.html, frise.js, events.json)
- Cliquez "Commit changes"

### 4. Activer GitHub Pages
- Allez dans Settings → Pages
- Source : branche `main`, dossier `/root`
- Cliquez Save
- Votre site est en ligne sur : `https://VOTRE-NOM.github.io/frise-medievale`

---

## Ajouter un événement

Ouvrez `events.json` et ajoutez une entrée en respectant ce format :

```json
{
  "id": 99,
  "titre": "Titre de l'événement",
  "date": 1350,
  "zone": "France",
  "description": "Description détaillée de l'événement...",
  "image": "images/mon-image.jpg",
  "sources": "Auteur, Titre de la source"
}
```

**Zones disponibles** : `France`, `Angleterre`, `Empire`, `Ibérique`, `Italie`, `Orient`

**Ajouter une image** :
1. Créez un dossier `images/` dans votre dépôt GitHub
2. Déposez-y votre image (jpg ou png)
3. Dans events.json, renseignez `"image": "images/nom-du-fichier.jpg"`

---

## Modifier les zones géographiques

Pour ajouter ou renommer des zones, éditez le tableau `ZONES` et l'objet `COLORS` dans `frise.js`.
