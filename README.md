Web Pro Todo List
=================

Preview via [github page](https://macsigner.github.io/webpro-exercise-todo-app/)

## Notes

- Not working with [_node-sass_](https://www.npmjs.com/package/node-sass). Written for [_dart-sass_](https://www.npmjs.com/package/sass).

## Node scripts

| Script      | Task                                                              |
|-------------|-------------------------------------------------------------------|
| `watch`     | Watch SCSS-Files in _src/scss/_ with destination in _assets/css/_ |
| `build`     | Build SCSS-Files without generating source map                    |
| `predeploy` | Remove CSS Folder and build files                                 |
| `deploy`    | Run `predeploy` and run `ghPages`                                 |
| `ghPages`   | Deploy current assets and files to githubp agees                  |
