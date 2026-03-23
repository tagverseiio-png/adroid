# Contributing Guidelines - Adroit Design

Adroit Design is an evolving project. These guidelines will help you maintain consistency and quality in the codebase.

## Code Style

### Frontend
- **React**: Use functional components and hooks.
- **Styling**: Always use Tailwind CSS utilities. Avoid custom CSS in `index.css` unless for global resets or global keyframes.
- **Modularity**: Break down large components into smaller, reusable ones and store them in the `src/components/` directory.

### Backend
- **ES6+**: Use modern ES6 features (e.g., async/await, arrow functions).
- **Controllers**: Keep the routes clean; all business logic should be in the controllers.
- **Error Handling**: Use consistent error formats across the API.

---

## Development Workflow

1.  **Pull latest changes**: Always ensure you're working on the latest version of the code.
    ```bash
    git pull origin main
    ```

2.  **Create a branch**: For any new feature or bug fix.
    ```bash
    git checkout -b feature/your-feature-name
    ```

3.  **Local Testing**: Run the backend and frontend locally and verify your changes.
    ```bash
    # Backend
    cd backend
    npm run dev

    # Frontend
    cd ..
    npm run dev
    ```

4.  **Formatting**: Ensure your code is properly formatted before committing.
    ```bash
    npm run lint
    ```

---

## Best Practices

- **Environment Variables**: Never hardcode API keys or database credentials. Use `.env` files and access them using `process.env`.
- **API Responses**: Maintain a consistent structure for API responses, including status codes and error messages.
- **Performance**: Optimize images using the `Sharp` library in the backend before serving them.
- **Security**: Use `Helmet` and `CORS` in the backend to secure your API and implement rate limiting on sensitive endpoints.
- **Responsiveness**: Ensure all new UI components are fully responsive and work across various screen sizes.
