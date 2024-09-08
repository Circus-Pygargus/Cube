# Cube

Création en cours

## Description

Gestionnaire de chronos de résolution de cube de type Rubik's.

## Installation

Initialisation du projet :

Cloner le repo.

Remplacer les infos de la variable DATABASE_URL (db_user, db_password et db_name)

Lancer ces commandes :
```bash
composer install

php bin/console doctrine:database:create

php bin/console doctrine:migrations:migrate
```
