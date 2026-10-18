# Storytime: Three Little Pigs

A text-based web game inspired by "The Three Little Pigs." Players turn the story page by page, choose building decisions at key moments, and try to complete a sturdy house before the big bad wolf arrives.

## Features

- Branching story pages with meaningful choices
- Multiple endings, including a safe winning path and retry endings
- House progress, wolf status, and story-state summaries
- Responsive layout for desktop and mobile

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Next.js in your browser.

## Scripts

- `npm run dev` - start the Next.js development server
- `npm run build` - create a production build
- `npm run start` - run the production build
- `npm run lint` - run ESLint

## Deploy on Northflank

This repository is configured for Northflank with:

- `Dockerfile` - builds the Next.js app and runs the standalone production server
- `.dockerignore` - keeps local build artifacts and dependencies out of the Docker build context
- `northflank.json` - optional GitOps template for creating a project and public combined service

### Dockerfile deployment

1. Create a Northflank combined service from this GitHub repository.
2. Choose **Dockerfile** as the build type.
3. Use `/` as the build context and `/Dockerfile` as the Dockerfile path.
4. Expose port `3000` as a public HTTP port. Northflank can detect this from the Dockerfile `EXPOSE 3000`.

The container sets `PORT=3000` and `HOSTNAME=0.0.0.0`, so it is ready for Northflank's HTTP routing.

### GitOps template deployment

Import `northflank.json` as a Northflank template. Override the template arguments if you want a different project name, region, service name, plan, repository URL, or branch.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
