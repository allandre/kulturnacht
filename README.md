# kulturnacht

# local development

## running a server

Use

```
php -S localhost:8000
```

to start a server so that all assets can be correctly loaded.

## linting

```
nvm use
npm install
npm run prettier # or prettier:fix
```

# deployment

```
./scripts/deploy.sh
```
`index.html` and everything in the `site` folder will be uploaded. Nothing else.