# Wordle Evolved

This web application expands upon the game of Wordle. It provides the ability for users to create their own Wordle game variants by changing the word length, the number of guesses, the letters used for word selection, and so on. Users will be able to login to record their statistics and compete against each other on leaderboards for unique Wordle games that they have constructed.

## Build & Test

### Clone
Clone the repository, then `cd` into it
```
git clone https://github.com/yeadamk/wordle-evovled
cd wordle-evolved
```

### Installation
Install the required dependencies using `npm install`
```
npm install
```

### Backend
Now, `cd` into the backend directory and create a .env file
```
cd backend/
touch .env
```

Paste the following content into the .env file
```
VITE_API_KEY=AIzaSyA4H4ChI5WaEf4HMxC1zISmw7TYhXy2h3s
VITE_AUTH_DOMAIN=wordle-evolved-6c9f4.firebaseapp.com
VITE_PROJECT_ID=wordle-evolved-6c9f4
VITE_STORAGE_BUCKET=wordle-evolved-6c9f4.appspot.com
VITE_MESSAGING_SENDER_ID=958450328450
VITE_APP_ID=1:958450328450:web:c32581273b441aefbca59b
VITE_MEASUREMENT_ID=G-CLMWC7H81Q
```

Let's get the backend server running
```
node index.js
```

`cd` out to the project root directory
```
cd ..
```

### Test
After completing all the steps above, test the game using `npm run dev`
```
npm run dev
```

## License
© 2024 Yeadam Kim, Pavan Gudavalli, Om Patel, Nikolas Rodriguez, Leo Thit, Ryan Schoenburg

Licensed under the [MIT License](LICENSE).