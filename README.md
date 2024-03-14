# Wordle Evolved

This web application expands upon the game of Wordle. It provides the ability for users to create their own Wordle game variants by changing the word length, the number of guesses, the letters used for word selection, and so on. Users will be able to login to record their statistics and compete against each other on leaderboards for unique Wordle games that they have constructed.

## Build & Test

### Clone
Clone the repository, then `cd` into it
```
git clone https://github.com/yeadamk/wordle-evolved
cd wordle-evolved
```

### Firebase setup
![image 1](images/image1.png)
1. Set add a project with any arbitrary name with https://console.firebase.google.com/u/0/
![image 2](images/image2.png)
![image 3](images/image3.png)
2. Click the web link the one with </> icon and register the app. Copy and paste the information in the firebaseConfig somewhere you can access again. The keys in the image above are for test and will be deleted.
![image 4](images/image4.png)
3. Then click the authentication button, and click email/password and toggle enable.
![image 5](images/image5.png)
![image 6](images/image6.png)
4. Create a firestore database by clicking this icon from your app. Click create database and keep everything in default except test mode. Then you press start collection and create two collections called history and users. When creating a collection, all you need to do is to auto generate the docID and save.
![image 4 reused](images/image4.png)
![image 7](images/image7.png)
![image 8](images/image8.png)
![image 9](images/image9.png)
![image 10](images/image10.png)
![image 11](images/image11.png)
5. Then, you need to create four indexes under the collection of history, like the following.
![image12](images/image12.png)
![image13](images/image13.png)
![image14](images/image14.png)

### Installing Dependencies and Setting Up Backend
Now that firebase is all set up, you can run a shell script and it will prompt you to enter the keys you got from step 1. Make sure you are entering this information without the enclosing quotation marks around it. For example, when asked for an api key, please enter AIzaSyCJLwC9Nqjvq0U3ILxMmCpSmxyN2npQvTE instead of "AIzaSyCJLwC9Nqjvq0U3ILxMmCpSmxyN2npQvTE". 

To run the shell script, type `./project_start_script`
```
./project_start_script
```
Running this script will install all required dependencies and get the backend server running. 

### Test
After completing all the steps above, test the game using `npm run dev`
```
npm run dev
```

## License
© 2024 Yeadam Kim, Pavan Gudavalli, Om Patel, Nikolas Rodriguez, Leo Thit, Ryan Schoenburg

Licensed under the [MIT License](LICENSE).
