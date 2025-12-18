# Magic: The Gathering Card Recognition

This is a [Next.js](https://nextjs.org) project designed to detect and recognize Magic: The Gathering (MTG) cards using a webcam. It leverages OpenCV.js for image processing to identify cards in real-time.

## Features

- **Real-time Card Detection:** Uses the webcam to detect cards.
- **OpenCV.js Integration:** Performs image processing directly in the browser.
- **Next.js Framework:** Built on top of the latest Next.js features.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Allow the browser to access your webcam to start detecting cards.

## Project Structure

- `src/app/components/webcam.tsx`: Contains the webcam capture and card detection logic.
- `src/app/services/cardDetectionService.ts`: Service for processing images and detecting cards (implied).
- `src/app/utils/loadOpenCV.ts`: Utility to load OpenCV.js.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
