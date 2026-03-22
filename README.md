# Mealio - a Smart Recipe PWA

An interactive recipe app that determines what you can cook based on your own ingredients.

---

## Description
Many people don't know what to cook with the ingredients they already have at home, leading to unnecessary grocery runs. Mealio solves this by letting you enter the ingredients in your kitchen and instantly see which recipes you can make with them. Missing something? Add it to your shopping list in one click.

Create and share your own recipes, follow specific diets, set personal allergies, and engage with other users by liking, rating, and commenting on their recipes.
## Tech Stack

**Frontend:** React, TypeScript, Next.js

**Backend:** ASP.net, C#, PostGreSQL
## Features

- Login or create account
    - Username, email and password
    - Add avatar
    - Edit profile

- Browse and filter recipes

- Shopping list
    - Check off items during shopping
    - Send bought ingredients to inventory

- Inventory
    - Add and edit ingredients

- Recipes
    - Like, rate, comment and share
    - Add missing items to shopping list
    - Once completed, remove used ingredients
    - Add your own recipes

- Choose diets and allergens

- Install as a PWA


## Demo

https://mealio.mauriceh.be


## Run Locally

### 1. Frontend

Go to the frontend folder

```bash
  cd recipe-frontend
```

Install dependencies

```bash
  npm install
```

Create a **.env.local** file based on **.env.example**

Start the server

```bash
  npm run dev
```

### 2. Backend

In a seconds terminal:

Go to the backend folder

```bash
  cd RecipeBackend
```

Make sure you have EF CLI installed
```bash
dotnet tool install --global dotnet-ef
```

Install dependencies
```bash
dotnet restore
```

Create a **.env** file based on **.env.example**

- Use pgAdmin4 to find your connection string.

Apply database migrations
```bash
dotnet ef database update
```

Start the server
```bash
dotnet run
```
---
The project now runs, open http://localhost:3000 in your browser.

See the Backend API documentation on: http://localhost:5041/swagger


## Links
[![portfolio](https://img.shields.io/badge/portfolio-000?style=for-the-badge&logoColor=white)](https://mauriceh.be/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logoColor=white)](https://www.linkedin.com/in/maurice-halsberghe)