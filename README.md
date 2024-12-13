# E-commerce Admin Panel

![Products Screenshot](https://res.cloudinary.com/dvovo1lfg/image/upload/v1726221727/admin/udjqqe1zbtdbutdrffcu.png)
![Login Screenshot](https://res.cloudinary.com/dvovo1lfg/image/upload/v1734070901/projects/admin/t7kooq30zcaunhdk7g5v.png)
![Categories Management](https://res.cloudinary.com/dvovo1lfg/image/upload/v1726221727/admin/z8kqbvdcp08kb0a5vmlb.png)
![Size Screenshot](https://res.cloudinary.com/dvovo1lfg/image/upload/v1734070901/projects/admin/seu0xrxx494wtdmpfju4.png)
![Colors Page](https://res.cloudinary.com/dvovo1lfg/image/upload/v1726221726/admin/bxe1jq3jvu4plo7kzspd.png)
![Billboard Report](https://res.cloudinary.com/dvovo1lfg/image/upload/v1734071097/projects/admin/ki52m5jlrmxinkeebfzj.png)

This is the e-commerce admin panel that allows administrators to manage their available stock and the store website directly from here. Administrators can create and manage billboards, categories, sizes, colors, products, and even view and manage orders. All changes in the admin panel are directly reflected on the store website. This admin panel is designed to simplify the management of multiple stores, offering powerful reporting and customization features.

## Features 🎉

- 🏬 **Multiple Store Creation**: Administrators can manage multiple stores from a single dashboard.
- 📊 **Sales Report**: View detailed sales reports.
- 📦 **Inventory Report**: Keep track of stock levels with inventory reports.
- 🖼️ **Billboard Management**: Create, read, update, and delete multiple billboards that are displayed on the store website.
- 🗂️ **Categories Management**: Manage multiple product categories with ease.
- 📏 **Sizes Management**: Define and manage multiple available product sizes.
- 🎨 **Colors Management**: Add and manage multiple available colors for products.
- 🛍️ **Products Management**: Add, update, and manage multiple products with advanced options for each.
- 📑 **Orders Report**: Track and manage customer orders efficiently.
- ⚡ **Data Caching with Redis**: Leverage Redis for efficient caching to improve app performance and response times.
- 🌗 **Light and Dark Theme**: Toggle between light and dark modes for better user experience.
- ⭐ **Featured Products**: Mark products as featured to display them on the store website's homepage.
- 🗄️ **Archived Products**: Archive products without deleting them from the system.

### Challenging Feature

One of the most challenging features was adding **multiple sizes with multiple images** for each product. The CRUD operations for managing these relationships became difficult but were successfully implemented.

## Tech Stack ⚙️

- **Frontend & Backend**: [Next.js](https://nextjs.org/) (Handles both frontend and backend)
- **Language**: TypeScript
- **Database**: MongoDB
- **Caching**: Redis
- **State Management**: Zustand
- **Styling**: Tailwind CSS, Shadcn UI
- **Authentication**: Next-Auth (Google and GitHub OAuth)

## Deployment on AWS ☁️

This application is deployed using AWS Amplify. You can view the live demo here:

[**Live Demo**](https://main.d7vgb4pcf2b53.amplifyapp.com/)

## Contribution Guidelines 🤝

We welcome contributions to improve this project! Please follow the below steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

We appreciate any contributions that help improve the platform.

You can explore the admin panel and contribute to the project. We're excited to see what you build with it!
