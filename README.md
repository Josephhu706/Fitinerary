
##View the code for my front-end here: 

(https://github.com/Josephhu706/final-project-test)


##Accessing the site
Access the app here: (https://main--fitinerary.netlify.app/)

Both responsive on desktop and mobile.

##Features

Fitinerary is a full stack application that allows its users to create and schedule workouts and also track their progress.

The features include:

Sign up/log in functionality with encrypted passwords and an authorisation flow
Users are only allowed into the site if they have an account
A database is used to store user information - passwords are encrypted once users have signed up

Users have the ability to do the following:
Create a workout by selecting a type of workout, exercises and schedule when they want the workout to be.
View their workout on a calendar and complete workouts to update progress.
View their progress for both strength and cardio exercises.


##Technologies used

Front end
Vue3.js
Axios
Tailwind Css
Lodash
Lottifiles
vue-cal
moment.js

Back end
Supabase

##Approach taken

Planning
For my frontend, I drew up a wireframe of how I wanted my app to look, and how the pages would flow. This gave me a clear indication on what pages need to be worked on. During the process of coding, my final design did change from the original. Integrating the scheduling aspect with the planning aspects was quite challenging.

For my backend, I experimented using Supabase as it allowed for easier implementation of user authentication and gave me the best of both worlds of document based databases such as firebase and also relational databases like sql. This made it easier to structure my data.

![fitinerary-wireframe](https://user-images.githubusercontent.com/99111357/171306627-aa328390-5dca-4375-9b01-857a831102bc.png)


##Lessons learnt
To plan and revist the plan frequently to make sure you are on track or if things need to be revised

There is a lot that goes into a full stack application and that it can be a lot to do in 7 days

A lot of learning is done when you are working on a project
I learnt more about Vue, how to use styling libraries like Tailwindcss, learned how to implement simple animations and transitions.

##Future improvements

As there were time constraints with the project, I was not able to deliver everything I would have liked to with my app.

In the future, I would like to add/improve the following:

The styling falls apart a little bit on medium screens, i'll need to configure the tailwind config file more.

I accidentally used multiple fonts, will need to consolidate fonts.

On the achievments page, the workout gifs shrink a little bit too much on small screens.

I did not have time to filter out all the data from the fitness api i used by equipment. The exercises are properly sorted by body part but some exercises might not require a weight field but it is there by default.

The Calendar content could be a bit more interactive. At the moment there is just the modal but it would be more interesting if i could add stuff like creating a workout from the calendar etc.

