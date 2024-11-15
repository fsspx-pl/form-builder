# FSSPX Form Builder

...aka Google Forms without Google Forms, tailored for FSSPX Poland needs.

\+ Ad maiorem Dei gloriam! \+

## Development

1. Setup proper Node version with [nvm](https://github.com/nvm-sh/nvm):

    ```bash
    nvm use
    ```

1. Create `.env` file with required env vars. Use `.env.example` as a base. Don't forget to adjust/change the default values of secrets!
1. Make sure you have a running MongoDB instance, matching `DATABASE_URI` from `.env`. With Docker, you can achieve that quickly with:

    ```
    docker run --name form-builder-db -v form-builder-db:/data/db -d -p 27017:27017 mongo
    ```

    If you don't want to populate your own database, reach out to this repository maintainer for an URI used in the testing environment. This should be replaced soon with a local db seed to avoid overwriting the testing data. 

1. Run the development server:

    ```bash
    pnpm dev
    ```

1. Open [http://localhost:3000/admin](http://localhost:3000/admin) with your browser to reach the PayloadCMS Admin panel.

## Build

Nothing fancy, just:

`pnpm build && pnpm start`