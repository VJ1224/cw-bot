# Content Warning Discord Bot

A Discord bot that gives content warnings for different media. Uses the [DoesTheDogDie](https://www.doesthedogdie.com/api) API.

## Usage

To add the bot to your server, [click here](https://discord.com/oauth2/authorize?client_id=802916478092836884&scope=bot)

## Requirements

* Node.js: Install node

* Discord.js: npm install discord.js

* Axios: npm install axios

* Dotenv: npm install dotenv

## Files

* app.js: Stores the main bot logic to read messages and execute commands.

* commands: Folder that stores each command in a separate .js file. Each .js file exports the execute function as well as relevant information about the command.

## Run

Run the bot using Node.js

```node
node app.js
```

## Credits

* DoesTheDogDie API:

   [doesthedogdie.com](https://www.doesthedogdie.com/api)
