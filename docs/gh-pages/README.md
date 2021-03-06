# API Console autogenerated with Travis CI

API console build tools allows you to integrate your CI process with documentation generation for your API. When you push changes to your main branch and all checkins passes then the API console should display newest version of the documentation.

This example shows how to use Travis-CI to push the API Console with newest version of the API documentation after you made changes to it.

## Overview

[.travis.yml](.travis.yml) file contains a set of directives that Travis-CI understands and executes. This file contains a minimal setup for the API console generation but you can change it as you wish.

First of all it will install node dependencies, which in this case is the
[api-console-builder](https://www.npmjs.com/package/api-console-builder) module as defined in [package.json](package.json) file:

```yaml
before_script:
- npm install
```

After that it will execute [deploy.sh](deploy.sh) that will process your private key associated with GitHub account (read below), checkout latest version of your API, create the console and will publish it in `gh-pages` branch.

```yaml
script: bash ./deploy.sh
```

## Setting up keys

If you haven't already, open [Travis](https://travis-ci.org/) account and add  your API's repository.

Keys allows to authenticate the building script so it can push data to your GitHub repository (to the `gh-pages` branch).

You will need to generate and add SSH key to your repository and to your project (encrypted version so no one else will be able to use it).

If you already have generated key, go to step 5.

1.  Open terminal
2.  Execute following command, replacing email with your GitHub email address.

```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

3.  When prompted for location, change file name to `gh-travis_rsa`

```
Enter a file in which to save the key (/Users/you/.ssh/id_rsa): /Users/you/.ssh/gh-travis_rsa
```

We will use this filename in the build script

4.  Do not set password! When Travis runs the script there's no way to enter the password when prompted. Because of that do not use this key anywhere else. It wouldn't be safe. Also, keep the key safe so no one can access it.

5.  Add generated key to your repository as described in [GitHub help pages](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/). Remember that you're adding __public key__ (gh-travis_rsa.pub), not the private key.

__Well done!__ Last thing to do is to add encrypted key to your repository. We will use [Travis CLI](https://github.com/travis-ci/travis.rb).

6.  Copy the key to your project's location (follwing assumes that you are performing this steps in project's location)

```
cp ~/.ssh/gh-travis_rsa ./
```

6.  Install Travis CLI as described in [installation guide](https://github.com/travis-ci/travis.rb#installation) if you haven't done that already.

7.  Now, use Travis CLI to add encrypted key to your repository:

```
travis encrypt-file gh-travis_rsa --add
```

This will create a `gh-travis_rsa.enc` file which is encrypted and can only be accessed in your Travis account for this repository. The `--add` option will add an entry to your `.travis.yml` file, similar to the following:

```
before_install:
- openssl aes-256-cbc -K $encrypted_1234567890_key -iv $encrypted_1234567890_iv
  -in gh-travis_rsa.enc -out gh-travis_rsa -d
```

8.  __Remove unencrypted key from your project__

```
rm gh-travis_rsa
```

That's it! Your repo is ready to be deployed. Commit changes and push new version to your repository.

## TL;DR ;)

### How it works?

The `deploy.sh` script will setup generated and decoded key in the container so Travis will be able to push changes to `gh-pages` branch.

The script will clone the repository into the `api/` folder. This folder will serve as a source of the API spec and later to publish the console. Next, it will call the `build.js` which contains a script that will generate the API console using a node module.

__Note:__ Instead of calling another script (`build.js`) you may use the api-console CLI tool.

When new API console is ready, and build output is waiting in the `build/` directory (as defined in `build.js` script) the script will checkout `gh-pages` branch in the `api/` directory where the repository was cloned.
After removing its content (which is the old version of the console and the documentation) it will copy content from `build/` to `api/` directory. That is, to `gh-pages`.

Last thing left to do is to push changes to the `gh-pages` branch.

### Alternative ending

The [api-console-builder](https://www.npmjs.com/package/api-console-builder) allows you to build the API Console that uses separated JSON file with parsed RAML content as a data source for the documentation. The API Console CLI allows you to regenerate only the `api.json` file instead of whole console. With this approach you will speed up build time by a lot.

Right now `api-console` CLI tool is in private alpha test and soon will be released. Then this document will be updated to provide you with more information.
