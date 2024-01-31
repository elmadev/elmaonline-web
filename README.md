# Elmaonline site web frontend

React based frontend for the [elmaonline site](https://elma.online). The backend is found in the [elmaonline-site repo](https://github.com/elmadev/elmaonline-site).

- [test.elma.online](http://test.elma.online) New features will be tested here first, this site uses a secondary copy of the database, so you can mess up as much as you want here, and nothing you do here will be saved on the real site.
- [elma.online](http://elma.online) This site will be using the live database.

- [storybook.elma.online](https://storybook.elma.online) UI library of the components that exists in the code

## Branches

- **dev**
  - The primary branch to use while developing. Make all changes to this branch, preferably as pull requests. Test server uses this branch.
- **master**
  - This branch reflects the version currently deployed on [elma.online](http://elma.online), only people actually deploying will be pulling code to this.

## Get started

1. Install if needed nodejs and yarn
2. Clone this repo
3. Run `yarn` in terminal to install depedencies
4. Run `yarn start` in terminal to start development server

- You can connect to the test server backend or run [elmaonline-site](https://github.com/elmadev/elmaonline-site) locally, use config.js to change this.

- Run `yarn build` in terminal to make a production build.

- Run `yarn storybook` in terminal to run the storybook site

## Tech stack

- React 17 using [vitejs](https://vitejs.dev/)
- Styling with [styled-components](https://styled-components.com/) and [Material-UI](https://material-ui.com/)
- Navigation using [@reach-router](https://reach.tech/router/)
- Simplified redux using [easy-peasy](https://easy-peasy.now.sh/)
- API calls using [apisauce](https://github.com/infinitered/apisauce) built on axios
- Forms powered by [formal-web](https://www.npmjs.com/package/@kevinwolf/formal-web)
- Basic helper tools such as lodash, date-fns, nanoid
- Page and component generation from templates using plop (`yarn g`)

If you don't know react it's worth checking out the official [tutorial](https://reactjs.org/tutorial/tutorial.html). Rest of the stack should be pretty easy to learn. If you are new to any of them, check out these quick introductions to the most important ones: [easy-peasy](https://easy-peasy.now.sh/docs/tutorials/quick-start.html), [styled-components](https://styled-components.com/docs/basics#getting-started), [reach-router](https://reach.tech/router/) and [formal-web](https://www.npmjs.com/package/@kevinwolf/formal-web#usage).

## Folder structure

```
.
├── /                      # Various configuration files
├── /public                # The .html file and favicons
├── /src                   # This is where your code will be
    ├── /components        # Smaller reusable components
    ├── /constants         # Constants used in components
    ├── /features          # Bigger reusable components with stores
    ├── /images            # Images files
    ├── /pages             # Top level pages
    ├── /stories           # Style guide for components
    ├── /utils             # Pure js reusable functions
    ├── /api.js            # API endpoints
    ├── /app.js            # Where code is wrapped with router/store etc.
    ├── /config.js         # Environment variables
    ├── /easypeasy.js      # Store, update when adding new store.js files
    ├── /globalStyle.js    # Global css
    ├── /index.js          # Entry point
    ├── /theme.js          # Theme objects
    ├── /router.js         # Add new pages here
├── /templates             # Templates for generating new files
```

## Developing on the project

Use the generator to add new pages, features and components
Run `yarn g` in terminal and follow the prompts

- Most styling should happen in components which should be mostly style and as little state as possible, no easypeasy, at most some react useState. For padding, margin and colors make sure you use variables from the theme and not static values.
- Features will be built up of components to create the UI and maintain some state in easy-peasy and/or call the api. Optimally you should be able to use layout components like Grid, Row, Column, Paper, Header etc. to built up basic layouts and not rely on creating new css when making a feature.
- Pages will be built mostly of features and some layout components to comprise a full screen.

Use `yarn commit` or follow [guidelines](https://github.com/elmadev/elmaonline-site/blob/dev/docs/contributing.md) when committing code to maintain consistent commit messages.

### Pages

- Run `yarn g page` in terminal
- Type name of page in CamelCase
- Add import in src/router.js
- Add the component inside `<Router>` in src/router.js with a path param
- Add store import at the top of src/easypeasy.js
- Add store inside `export default {` in src/easypeasy.js

### Feature

- Run `yarn g feature` in terminal
- Type name of component in CamelCase
- Import in relevant pages
- Add store import at the top of src/easypeasy.js
- Add store inside `export default {` in src/easypeasy.js

### component

- Run `yarn g component` in terminal
- Type name of component in CamelCase
- Import in relevant screens/features

## Setting up editor

The project is configured to use eslint and prettier to ensure good coding practices. Make sure you install relevant plugins for your editor.

Visual Studio Code:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Test database

The config is set up to use a test database. Bear in mind the following:

- Test database is a copy of live from end june 2020
- time, battle and allfinished tables only have a subset of live (last year or two) to keep size down
- Passwords, emails and private comments have been stripped

## Communication

Feel free to create issues/discussions here on github in order to discuss things related to the project. Unless it's specifically related to only frontend, issues and discussions should be made in the [elmaonline-site repo](https://github.com/elmadev/elmaonline-site/issues). You can also join the [elma discord](https://discord.gg/j5WMFC6) #developers channel to chat.

When working on a feature make sure you assign yourself to the related issue so we avoid multiple people doing the same work.

For major chances on big ticket features such as replays, battles, profile, levels (and code architecture) make sure you join the discussion first, there most likely is one already, and reach some kind of consensus. Of course some experimentation to aid the discussion is fine.
