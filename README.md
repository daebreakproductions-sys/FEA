# Flint Eats Mobile App

This app is the client facing platform for Flint Eats.

### Tech Stack
- Ionic 5 
- Angular 10 
- Capacitor 2

### Developer Notes

For development/testing use ``` ionic serve --configuration="local|dev|test|prod" ```

In bash/terminal run ``` ./_makeModel ``` to generate new objects quickly 

### Native Build (capacitor)

1. ionic build --configuration="local|dev|test|prod"
2. npx cap copy
3. (android only) npx jetify
4. npx cap sync ios|android
5. npx cap open ios|android