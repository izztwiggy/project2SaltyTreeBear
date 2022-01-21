# project2 STORY CATCHER
Sylvie Sallquist
GITHUB PROJECT LINK: https://github.com/izztwiggy/project2StoryCatcher
HEROKU LINK: https://young-citadel-84218.herokuapp.com/session
 
Name of Application: Story Catcher
 
Purpose/Description: A place for parents/guardians to have a place to keep their memories of kids childhood.
When you want to write down when your kid says something that is funny/memorable at the moment but you’re not near paper or just don’t want to put it in your phone notes and forget about it,  this gives you Quick & easy access to input in the text/photos /(potentially) voice memos,  that saves it to the day you entered it. 
It also gives you the option when you have more time, to view the calendar and either fill in moments from the past that you have saved somewhere else to create one place to hold all the memories as a digital baby calendar, and lets you input future events that you want to be held on the calendar. 
You also have access to your child’s “Bookshelf”, this is a place where you can write down and save meaningful stories that you have made up and tell to your child, those special stories that you hope you never forget and will want to be able to pass down to their kids one day. 
 
**Things that Are Incomplete:
BOOKSHELF:
	*Have not yet added the Book Api to search and Pin Books to the library
	* My Bookshelf does not visually look like how i imagined and I need to work on the CSS factoring to place multiple books on the shelf rather than just one, as this is quite annoying to have to scroll so far down if lots of books. **This will also be continued to be worked on
 
EMAILS: This was a stretch but I think adds an important usage functionality. Think like the highlight reels Google Photos gives you at the end of the month or every couple months 
	*Need to bring on Node Mailer and set up annual Highlight emails to user and then one they can send to an email for their child, sent on child's Birthday.
Once the email is compiled, will export to PDF and save to local storage or as a collection in mongo, but I dont want more than I need in Mongo so still considering this. 
 
 
Option 1: Users will input an email that they will already have/will create for their child (instructions would be given to explain) Every Year on that child’s birthday, all the information from the calendar and bookshelf will be compiled into a document/email that contains the year of a calendar from Childs birthday month => next year birthday month, each day that has inputs being marked with a symbol and then able to click on the day to bring up a modal to view the day and its input. The next section would highlight their favorite books and include the personal stories from the parent if input. Once the document was compiled, it would be stored in the profile for safekeeping, but also emailed to the given email of choice. At any point of the parents choosing, the idea would be that they can give the email and password to the child so they can also have a digital version of a memory book. Would continue as long as there is input for the year.Emails stop at specification by the user, or if there is no activity for the whole year. Will unsubscribe them after that.
CALENDAR:
I just completely dropped the ball on this I struggled so much with getting anything that I just ran out of time to start. 
What I will do for Calendar:
* Quick add options that are separated out from the calendar views for the parent to quickly add an entry input for the same day
An actual Calendar to view, First load is of the same month we are in, 42 “units” will be rendered, showing the previous months days and the next  months days to fill dependent of the current month and Year for leap years. Users can go back any amount of months they wish (up to a year before child's birth and can move as many years forward as they wish. Each date will be clickable to either add an entry or view entries that have been previously added to that date. 
Was going to use Day.js to help with the rendering of the calendar as it is a small and powerful library but then was too focused on whether it would look best to use pure JS or not. And by looking best, I mean to future employers to show that I have competency around the building of a calendar and working with Date objects. As of right now I am going to complete it in pure JS but will go back and change it to using Dayjs since I think the shortcuts do make the code cleaner. But I am going to take the learning opportunity to do JS first.
 
Stretch Goal 1: Unmet: User has the option to export the child’s digital calendar to a physical version, can customize their calendar months, would be able to include all the text inputs: including birthdays/milestones, payment made with Stripe.
Stretch Goal 2: Add in letters to the child, have a list of prompts or blank template for the parent/gaurdian to write the child a letter and have it be included in the year end Bday Emails : Incomplete but will be added 
Stretch goal 3: Add in the ability to have a joint main functioning user: thinking like partners / etc: people who can view and access/all Children information as can the main user : Incomplete but will be added - still researching safest ways to add a linked user security wise. Potentially thinking to have Main user come up with a code, use Crypto to create a “version” of that code, then use bcrypt to save in the MongoDB to be linked as the key for the other user to be able to register and automatically then be added to the Main user profile. But I would want a verification to be sent to the main user first to verify, yes this is actually the person, then once verified the kids profiles would load on the 2nd user's profile.
 
 
THINGS THAT ARE COMPLETED:
 
USERS/CHILDREN:
I was able to add Multer with Cloudinary to add and remove profile pictures for both the Adult User and all children they added to their profile. They do have the option to select an avatar picture to use instead of an uploaded image and if none were chosen I used the App logo. 
The user sets their name, information, and if they want to link a partner, they gave their partner's email, and the user selects if they want to receive annual emails by a check box.  
For the kids, they have the option to add in their full name (first middle last suffix), a nickname and preferred name which defaults to first name unless species by the adult. They can choose a profile picture and an avatar for the child. On the User’s profile page, they can view each child, edit the child's info, delete, add a child, on each child's page they can add a Profile entry which is sort of like a “Notes about you now, to read later”, different from the calendar in that its more of a generalized feel about the kids general time frame in life, like their favorite places to go, favorite things/food/books/etc rafter than specifically, they did X on __ date. These entries appear on a timeline under the child's info with the title and a little snippet with a read more/view button. (if Under 100 characters it’s a view if 100+ characters it’s  Read More) Click the entry to view edit or delete. 
The parent can go to the bookshelf tab, choose the child they want to upload a story for, or view current stories (all of them) and then can view existing, add a new one, edit an existing one, or delete. 
 
 MODELS:
*Note: The Entry Schema is Used for the Profile Entries and The Calendar Entries
 
User Schema (Adults)
  username: {type: String,unique: true,required: true}, 
    password:{type: String, required: true},
    name: String,
    email: String,
    annualEmail: Boolean,
    avatar: String,
    partnerEmail: String,
    profilePicture:{
        url: String, 
        filename: String
    }
 
Child Schema:
firstName: String,
middleName: String,
lastName: String, 
suffix: String,
nickname:String,
preferredName: {type:String, default: this.firstName}, 
birthDay: {type:String, required: true},
birthMonth:{type:String, required: true},
birthYear: {type: String, require:true},
childEmail:String,
avatar: String,
 parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    profilePicture: {
        url: String, 
        filename: String
    }
 
Entry Schema:
date: {type: Date, default: new Date()},
    title: String, 
    body: String,
    calendar: {type: Boolean, default: false},
    picture: {
        url: String, 
        filename: String
    },
    child:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }
 
Calander Schema
  calStart: Date, 
   child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }
 
 
Book Schema
author: String, 
title: String,
story: String,
cover: String,
published: {type: Boolean, default: false},
date: String,
child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
   }
 
 
 
 
ROOT ROUTES:
 
‘/session’ => Users Login/Register/About Us Page
‘/user’ => Access the User profile, Child Profile, and Child Profile Entries 
‘/books’ => Access the Children’s books, view on a per child basis: Add / Edit / Delete
‘/calendar’ => Currently Under Construction
 
 
 
Routes Break Down: ‘/session:
 
 
GET: ‘/’ 
=> To About Company Page (‘/session’)
 
GET : '/register' 
=> Get User registration
 
POST: ‘/register’
=> Add the User to Session
 
GET: ‘/login’ 
=> To Login Page
 
 
POST: ‘/login’
=> Add the User to Session
 
GET: ‘/logout’
=>Logs out and destroys session
 
 
Routes Break Down: ‘/user:
 
User Info On User Routes:
GET: ‘/’ 
=> To Users Profile Home Page
(‘/user’ with the root)
 
GET : '/update' 
=>  To User Info SetUp page (post registration)
 
PUT: ‘/update’
=> Updates User Info
 
GET ‘/edit’
=> To User Edit existing info, after 1st login, Is not taken to Setup so edits info here
Child Info On User Root Routes
 
GET: '/child/new'
=> Takes to form To Add New Child To Users Profile
 
POST: ‘/’
=> Adds Child to User, takes to Home Profile Views
 
GET '/:id/child'
=> View Child Profile
 
GET '/:id/edit’
=> Get the Form To Edit the Child
 
PUT '/:id/child'
=> Edit Child Info
 
DELETE '/:id/delete'
=> Deletes A Child, their Profile Picture from Cloudinary, all entries associated with Child, and All books associated with child
 
 
Child Profile Entries On USER Root Route
 
GET ‘/:id/entry/create'
=> Go to form to add an entry: Create Your Own Prompt Form 
 
GET '/:id/entry/prompts'
=> Go to form to add an entry:Prompt Selection Form 
 
POST '/:id/entry'
=> Post the New Entry 
 
GET '/:id/entry/:entryId'
=> View An Entry
 
PUT '/:id/entry/:entryId'
=> Edit An Entry
 
DELETE '/:id/:entryId/delete'
=> Delete An Entry
 
 
Routes Break Down: ‘/books:
 
User Info On User Routes:
GET: ‘/’ 
=> ToPick Child To View their Bookshelf
(‘/user’ with the root)
 
GET : '/:childId/view'
=>  View Child Bookshelf
 
GET '/:childId/new'
=> Get Form To Add New Book to Childs Profile
 
POST: '/:childId/new'
=> Adds New Book to Childs Bookshelf


GET '/bookshelf/:bookid/view'
=> To view a specific Story 
 
GET: '/:bookId/edit'
=> Get Book Edit Form 
 
PUT: '/bookshelf/:bookId'
=> Updates Specifc Book After Edit
 
GET '/bookshelf/:bookid/view'
=> To view a specific Story
 
DELETE '/:bookId/delete'
=> Deletes A Book
 
 
Calendar Routes Under Construction, coming soon to a world wide web near you
 
 
 
Technologies & Dependencies Used:
Node
Express
Mongoose
MongoDB
Cloudinary
Multer
Lodash
Bcrypt
Express Sessions
Views - EJS & EJS Layouts
Method-Override
Boostrap for Styling
 
As a user, I Can Currently:
 
Register and Set up My profile
log in and out
Easily add a child
Easily Edit and View My Children
Easily Can Update My User Info
Easily can Add Entries To my Childs Profile
Easily Can view My Childs Bookshelf 
Easily can add/edit/view/delete stories For my child's bookshelf.
Securely only able to view information When logged in
 
 
I am proud Of What I have Currently, and I am disappointed with what I have completed. I know I was totally capable of completing all my stretch goals, and my brain just would not work for about 90% of the time that I was actually working on this project. 
This will be completed and worked on until 100% Complete, so for now, this is what I am turning in. I do understand if this is marked as incomplete. 
My Heroku Deployed App is not accepting my EJS Views folders, for now, will be fixed by tomorrow is the hope. 

