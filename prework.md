prework.md
Raw
Prework: Advanced Web Development (WEB103)
Welcome to the CodePath WEB103 Prework!

In WEB103, you will learn how to build your own full stack apps from scratch. But first, it's important that you know how to build a frontend that can interact with an API and supports CRUD operations.

Introducing . . . 🥁

Creatorverse
A person's top content creators can say a lot about them. Do they prefer lockpicking videos 🔒, casual art streams 🖼️, or hustle-culture TikTokers 📱?

View an exemplar of the project here!

Screenshot
A simple version of the app with all the required features implemented:

Screenshot of app with core features implemented
Your mission 🧑‍🚀 is to build a frontend that supports CRUD (create, read, update, and delete) operations on your favorite content creators. Your content creators can be Twitch streamers, YouTube channels, Instagram personalities, TikTok accounts, or similar. Heck, they can even be Mastodon microbloggers.

The purpose of your app is to share at least five creators you think are worth following and give yourself the ability to create, update, and delete creators. Each Creator should have:

a name
a url (the link to their channel or page)
a description
(optional) an imageURL that links to a picture of the creator or some of their content
You must use React to create your app, and you may optionally use PicoCSS to style HTML elements.

Let's get started! 🚀

Required Features
Use a logical component structure in React to create the frontend of the app
Display at least five content creators on the homepage of the app
Each content creator item includes:
their name
a link to their channel or page
a short description of their content
API calls use the async/await design pattern via Axios or fetch
Clicking on a content creator item takes the user to their details page, which includes their name, url, and description
Each content creator has their own unique URL
The user can edit a content creator to change their name, url, or description
The user can delete a content creator
The user can add a new content creator by entering a name, url, and description
The new content creator then appears in the displayed list
Stretch Features
Use Picocss to style HTML elements
Display content creator items in a creative format, like cards instead of a list
Show an image of each content creator on their content creator card
Step 0: Setting Up Your Project
In WEB103, we'll be using Vite to create our React projects. In this step, you'll use Vite to set up your Creatorverse project. You'll also need React Router to implement navigation between the pages that make up your app.

Resources
Getting Started with Vite
React Router
Step 1: Setting Up Your Creators
In this step, you'll sign up for Supabase (or log in if you already have an account) to set up a database for your content creators.

Step 1a: Signing up for Supabase
Go to the Supabase website
Sign up for a Supabase account:
Click the green "Start your project" button
At the bottom of the sign-in form, click the "Sign Up Now" link
Create an account using your Github credentials by clicking the "Continue with GitHub" button
Create a new project:
Click the green "New project" button to create a new project
Set the name of your project to creatorverse and create a database password
Click the green "Create new project" button to submit to form
After submitting the form, give Supabase a few minutes to setup your project
Step 1b: Create your database
In this step, you'll create a new Supabase database for your project. You want to save the data for each content creator that is added to your Creatorverse. Your database needs to store the content creator's name, URL, description, and image URL.

Click the "Database" icon in the left side bar menu
Click the green "New table" button to create a new table in the database
Create a creators table:
Name the table creators
Uncheck the option "Enable Row Level Security"
Check the option "Enable Realtime"
Add columns for name, url, description, and imageURL
Click the green "Save" button to save the table
Step 1c: Connect your project to your database
In this step, you'll add the Supabase client to your project so you can connect the front-end to the database.

Install the Supabase library using the following command: npm install @supabase/supabase-js
In the src directory, create a JavaScript file called client.js
In client.js:

Import createClient from Supabase:

import { createClient } from '@supabase/supabase-js'

Create a variable called URL. Assign it a string containing your Supabase Project URL. To find the Project URL on the Supabase website, click to the "Settings" icon in the left side bar menu and then click "API" under Project Settings. Click "Copy" button under Project URL.

const URL = 'insert your Project URL here'
Create a variable called API_KEY. Assign it a string containing your Supabase Project API Key. To find the Project API Key on the Supabase website, click to the "Settings" icon in the left side bar menu and then click "API" under Project Settings. Click "Copy" button under Project API Key.
const API_KEY = 'insert your Project API key here'
Create a variable called supabase. Assign it a function call to createClient(). Pass URL and API_KEY variables to the createClient() function.
const supabase = createClient(URL, API_KEY)
Export the supabase variable by adding the export keyword before const supabase.
export const supabase = createClient(URL, API_KEY)
📍 Checkpoint 0: After completing Steps 0 and 1, you should now have an empty app that's connected to your database.

Step 2: Create Pages and Components
Now that you have all the components you need, it's time to build your 💫 Creatorverse! Let's start by creating the components and pages you need.

In the src directory, create a subdirectory called components.
In the components directory, create a file to represent a content creator. This component should contain the content creator's information (name, url, description, and imageURL (optional)) so it can be displayed on the main page. For example, you might want to create a Card file to organize a content creator's information on a card.
In the src directory, create a subdirectory called pages.
In the pages directory, create the pages you need. For example:
a ShowCreators page to show all content creators
a ViewCreator page to view a single content creator
an EditCreator page to allow the user to update a content creator's information
an AddCreator page to allow the user to add a new content creator
💡 Some Tips to Consider
Before you start development, take some time to plan out what is needed and how the different parts will look.

Don't forget, a user should be able to:

View all content creators
View a single content creator
Visit a content creator's channel or page
Edit a content creator
Delete a content creator
Add a content creator
Step 3: Set Up Routes
In this step, you'll need to create the routes that allow the user to go between each page.

Edit your App page by:

Importing useRoutes from react-router-dom
Importing your pages for showing all creators, viewing a creator, editing a creator, adding a creator
Defining the paths and elements for the main page, edit page, new page, and view page
Inserting the element into the App container
Resources
React Router
React Router: Getting Started Tutorial
📍 Checkpoint 1: At this point, you should now have your pages and components set up and routes defined to load specific elements when a certain path is reached.

Step 4: Creating a Component for a Content Creator
Edit the component you created to contain a content creator's information by:

Displaying the content creator's name, URL, description, and image
Resources
ReactJS: Components and Props
Passing Data Through Props
Step 5: Viewing All Content Creators
Right now, the user can't see all of the content creators that have been added to the database. In this step, you'll need to make a request to your database to read all the entries and display them on the home page.

Edit your App file by:

Importing supabase from client.js
Inside a call to the useEffect() function, write an asynchronous function to fetch the data from your database. Don't forget to call the function you wrote at the end of the call to useEffect().
Edit the page you created to display all content creators by:

Importing the component that displays a content creator's information
Creating content creator components for each one in the database
Displaying a message if there are no content creators in the database
Resources
ReactJS: Using the State Hook
The map() Method
Async/Await
Supabase Documentation
Supabase JavaScript Library
📍 Checkpoint 2: At this point, you should now have the ability to see content creators on your page. Right now, it might just be displaying the message that there are no content creators because we need to add some!

Step 6: Viewing a Single Content Creator
When a user clicks on a content creator, they should be taken to a page that allows them to view the single content creator. In this step, you'll need to get the content creator the user clicked on and display their information on the page.

Edit the page you created for viewing a single content creator by:

Importing supabase from client.js
Getting the content creator's information from the database
Displaying the content creator's name, URL, description, and image
Resources
The filter() Method
Step 7: Adding a Content Creator
Phew! We're doing good so far! Next, let's allow the user to add a content creator to the 💫 Creatorverse.

Edit your home page by:

Adding a button on your main page to allow the user to add a content creator
The button should go to the page you created for adding a content creator
Edit the page you created for adding a content creator by:

Importing supabase from client.js
Adding a form for the user to enter details about the new content creator (name, url, description, and imageURL (optional))
Writing an asynchronous function to add the new content creator to the database
Resources
React Forms
Handling Events
React Buttons
Step 8: Updating a Content Creator
The user should also be able to update a content creator...you know, in case someone forgot a link, didn't submit the best picture of the content creator, or there are just too many typos for them to ignore ✍️ In this step, you'll need to make a request to your database to update a given content creator and display the changes.

Edit the page you created for editing a content creator by:

Importing supabase from client.js
Adding a form for the user to modify the name, url, description, and imageURL (optional) for a content creator
Getting the content creator's information from the database
Loading the content creator's information into the form
Writing an asynchronous function to update the content creator in the database
Calling the function on a submit button
Screenshot of app with core features implemented
Resources
W3Schools: React Events
ReactJS: Handling Events
Step 8a: Add an Edit Button
Well now that we have the functionality in place, let's go back and add buttons or links to the component for the content creator and/or the page to view a single content creator.

On the component for the content creator, add a button or link to edit their information
On the page to view a content creator, add a button or link to edit their information
Step 9: Deleting a Content Creator
Someone might think a content creator isn't really 💫 Creatorverse-worthy...so let's give them the power to delete them! In this step, you'll need to make a request to the database to delete a given content creator from the database and home page.

Edit the page you created for updating a content creator by:

Adding a delete button
Writing an asynchronous function to delete a content creator from the database
Calling the function on the delete button
🎉 Congratulations 🎉
You've completed your prework! 🚀

If you have time left over, continue on to the stretch features to customize and improve your app!

Step 10: Stretch Features
Your 💫 Creatorverse is looking great! Try implementing some of the stretch features to take it to the next level.

Use Picocss to style HTML elements
Display content creator items in a creative format, like cards instead of a list
Show the content creator's image on their content creator card
Adding the Prework to Your Application
Step 1: Preparing for Submission
👋 IMPORTANT: If you're taking this course For-Credit at your university, the pre-work project is optional.
All submissions happen via Github and we require each submission to follow a particular format, including a clearly documented README with a list of completed features and a video (e.g., GIF, Loom, YouTube, or drag in an MP4 file) website walkthrough. Once you have completed these challenges and pushed your code to GitHub with the README and video walkthrough included, you'll submit the project.

💡 Tip: To make the GIF app walkthrough specifically, we recommend using LiceCap. However, you are welcome to create any type of video to submit.
⚠️ Windows Users: For LiceCap to record GIFs properly in certain versions of Windows, be sure to set Scaling to 100%.
Use this README TEMPLATE.

It is important that you follow the same layout as the README template so that we can easily access your work.
Be sure to check off each feature that is implemented in your submission by changing [ ] to [x].
Resources
🎬 Submitting a project via GitHub (27:38)
Collaborating with Git
Step 2: Adding the Prework to your Application
Once you have finished developing your 💫 Creatorverse, then you are ready to notify us that you are ready for a prework review. To submit, go to the application submission form. (⚠️ IMPORTANT: Make sure you sign in with your CodePath-registered GitHub account!)

Make sure that this is the correct cohort before submitting. In the page that appears, enter the link to your 💫 Creatorverse in the form shown:


Then press "Submit" at the bottom to push your submission. Note that you can always update your submission at any time in case you want to re-upload your 💫 Creatorverse.

Once you've hit the Submit button, you'll hear from us soon with more information about the rest of the selection process.

🎉 Congratulations, you've successfully completed the prework!
Still have questions about pre-work?
If you encounter technical difficulties while submitting your work, please join our Prework Support Workspace here.
This workspace is intended to support applicants with prework completion difficulties. It exists for you. Come join us!
Make sure to join and create an account with us to get assistance from our awesome team of tech experts and other students who may have encountered the same technical issues as yours!
