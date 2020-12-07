# Who Wants to Be a Bitcoinaire?

[Try Me!](https://bitcoinaire.herokuapp.com/)

## What is this?

This is a simple trivia web app that allows you to quiz yourself on 10 questions of your choice of difficulty, then compares your score with others who have played before.

This is a proof of concept for me to play around with Vue 3, as well as various other technologies I wanted to explore like [Vue-Router](https://router.vuejs.org/) and [express-validator](https://github.com/express-validator/express-validator).

## Installation

1. Install Node ^12.0.0. ([nvm](https://github.com/nvm-sh/nvm) is helpful here!)
2. `npm install` or `yarn install`.

## Usage

* `npm run serve`/`yarn serve` will bring up the development version of Vue. Enter `localhost:8080` in your webpage to enter the web app.
* `npm run server-local`/`yarn server-local` will bring up the Express backend as well as the database. The API can be queried at `localhost:8000`.
* `npm run test`/`yarn test` will run all unit tests for the Vue components, views, and store, as well as the backend API.

## To-dos & Tech Debt

If this project grows, I'll convert these to Github issues.

To-do:
* I'm tracking most of my to-dos as `//TODO` comments in the code.
* This codebase should _really_ be separated by `client` and `server` folders. That way there's separation of concerns, and they don't have to share the same NPM package list or configuration files.
* Add limit on length of player name.
* Add timeout on API calls so front-end doesn't wait forever.
* Add error notifications on front-end if API fails. (Currently errors are handled gracefully but not reported.)

Bugs:
* Prevent occasional duplication of round score in high score table.

Wishlist:
* Try Vue3 features like 'native' state management and composition API.
* Add time limit on game rounds.
* Show correct answer if a wrong answer is picked.
* Round properties e.g. number of questions per round, custom difficulties, etc.
