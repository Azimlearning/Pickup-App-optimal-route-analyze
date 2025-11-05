
# Project Blueprint: Optimal Route KL

## Overview

This document outlines the structure, features, and development plan for the "Optimal Route KL" application. It serves as a single source of truth for the project's design and implementation. The project now includes a dedicated Python backend to handle route optimization logic.

## Implemented Features

### Core Features

*   **Multi-stop Route Optimization:** The application allows users to input multiple locations in Kuala Lumpur and calculates the most efficient route connecting them using a dedicated Python backend and the Google Maps API.
*   **Dynamic Location Input:** Users can add or remove location input fields as needed, providing a flexible and intuitive user experience.
*   **Interactive Route Display:** The optimized route is displayed on an interactive map, allowing users to visualize the path and turn-by-turn directions.
*   **Prominent Data Table Button:** The home page now features a prominent button for easy navigation to the sample data table, replacing the previous text link.
*   **Python Backend:** A Flask-based backend has been created to handle the route optimization logic, making the application more robust and scalable.

### Additional Features

*   **Sample Data Table:** A new page has been added to display a table of sample user data fetched from a public API. This demonstrates the application's ability to handle and display data from external sources.
    *   **Sorting:** Table columns can be sorted in ascending or descending order by clicking on the column headers.
    *   **Searching:** A search bar allows users to filter the data in real-time across all fields.
    *   **Pagination:** The data table now includes pagination to handle larger datasets efficiently.

## Project Structure

```
optimal-route-kl/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |   |-- DataTable.jsx
|   |   |-- pages/
|   |   |   |-- DataPage.jsx
|   |   |   |-- HomePage.jsx
|   |   |   |-- RoutePage.jsx
|   |   |-- App.jsx
|   |   |-- index.css
|   |   |-- main.jsx
|   |-- .gitignore
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   |-- vite.config.js
|-- backend/
|   |-- venv/
|   |-- main.py
|   |-- requirements.txt
|   |-- .gitignore
```

## Styling and Design

*   **Styling:** The application is styled using Tailwind CSS, a utility-first CSS framework that allows for rapid UI development.
*   **Color Palette:** The color scheme is based on a modern, dark theme with a focus on usability and readability.
*   **Typography:** The font is clean and modern, with a clear hierarchy for headings and body text.

## Development Plan

### Current Task: Backend Implementation

*   **Objective:** To create a dedicated backend to handle the route optimization logic.
*   **Status:** The backend has been created using Flask and integrated with the frontend. The backend is running in a virtual environment with the correct dependencies.

### Next Steps

*   **Refine UI/UX:** Further refine the UI and UX of the application, including the data table and the main route optimization interface.
*   **Improve Error Handling:** Enhance the error handling to provide more informative feedback to the user in case of API errors or other issues.
