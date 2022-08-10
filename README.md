# A to-do list web app, where users can add tasks in different categories.

## Features

- Add a new Item to the to-do list.
- Delete an Item by checking the checkbox.
- Each route parameter creates a new list document.
- Item is a document with the name of a task.
- List is a document with the list's name and an array of item documents.

## Installation

blog-website requires [Node.js] and [mongoDB] server to run.

Install the dependencies and start the mongoDB & server.

```sh
cd my-website
npm i
mongod
node app.js
```

## Tech
- [JavaScript] [HTML], [CSS]: duh.
- [Node.js] - back-end JavaScript runtime environment.
- [Express] - fast node.js network app framework .
- [Bootstrap] - great UI boilerplate for modern web apps.
- [ejs] - Embedded JavaScript templating.
- [mongoDB] - NoSQL Database.
- [mongoose] - An Object Data Modeling (ODM) library for MongoDB & Node.js.




[JavaScript]:<https://developer.mozilla.org/en-US/docs/Web/JavaScript>
[HTML]:<https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics>
[CSS]:<https://developer.mozilla.org/en-US/docs/Web/CSS>
[express]: <http://expressjs.com>
[Node.js]: <http://nodejs.org>
[Bootstrap]: <http://twitter.github.com/bootstrap/>
[ejs]:<https://ejs.co/>
[mongoDB]:<https://www.mongodb.com/>
[mongoose]:<https://mongoosejs.com/docs/>
