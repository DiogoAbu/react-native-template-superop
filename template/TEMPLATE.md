# Template features

## Readme

You need to replace the following text on the README.md:
- `#CHANGE_ITUNES_APP_STORE_LINK` itunes app store link to your app
- `#CHANGE_GOOGLE_PLAY_STORE_LINK` goole play link to your app
- `#CHANGE_PROMOTIONAL_SCREENSHOT` image link showing the app main use
- `#CHANGE_OVERVIEW_SCREENSHOT` image link showing other screens

If you did not set a remote url at the beginning you need to replace the following at README.md and CONTRIBUTING.md:
- `#CHANGE_GITHUB_USER`
- `#CHANGE_GITHUB_REPO`

## Generate release keystore

Get a 16 byte url-safe password [here](https://generate.plus/en/base64) and use it in both the alias and the keystore. Store this password in a safe location.

Create keystore:
```sh
"%JAVA_HOME%\bin\keytool" -genkeypair -v -keystore android/app/release.keystore -alias com.helloworld -keyalg RSA -keysize 2048 -validity 10000
```
Convert to new standard:
```sh
"%JAVA_HOME%\bin\keytool" -importkeystore -srckeystore android/app/release.keystore -destkeystore android/app/release.jks -deststoretype pkcs12
```
Remove old keystore:
```sh
rm android/app/release.keystore
```

## Github
Go to your repository settings.

Under `Options` change the merge options to the following:
- ✅ Allow merge commits
- 🔲 Allow squash merging
- 🔲 Allow rebase merging

Under `Branches` and a new rule for `main` and `beta`:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
- ✅ Include administrators

### Secrets

The actions uses the following secrets:

GitHub:
- `PERSONAL_TOKEN` token with access to repo and workflows;

Git GPG key, find out more [here](https://github.com/crazy-max/ghaction-import-gpg):
- `GPG_PRIVATE_KEY` to verify commits and tags;
- `GPG_PASSPHRASE` to authenticate the gpg;

App Signing config:
- `RELEASE_JKS` get using: `openssl base64 -in android/app/release.jks`;
- `RELEASE_KEY_ALIAS` the alias used to sign the keystore;
- `RELEASE_KEY_PASSWORD` the password used for both the alias and the keystore;
- `GOOGLE_SERVICES` get using: `openssl base64 -in android/app/google-services.json`;

Dotenv:
- `DOTENV_STAGING` get using: `openssl base64 -in .env.staging`;
- `DOTENV_PROD` get using: `openssl base64 -in .env.production`;
