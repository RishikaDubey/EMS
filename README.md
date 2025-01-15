# Employee Management System (EMS)

## Overview

The **Employee Management System** is a web application built using **Angular 16**. The application was developed as part of an assignment to manage employee information and provide features such as adding, editing, and deleting employee records. The project was designed based on a **Figma** design [link](https://www.figma.com/design/JYuw7GtpDzTrUDVjUGAT08/Developer-Assignment-2?node-id=1-4399&t=FY2RlnahhoGCV5uA-0), ensuring a user-friendly, mobile-first and responsive interface. The app is hosted on **Firebase** for easy access and deployment.

## Live App

[Employee Management System App](https://rd-ems.web.app)

## Features

- **View Employees**: Display a list of all employees with their details.
- **Add New Employee**: Form to add a new employee with essential details (e.g., name, role, etc.).
- **Edit Employee Details**: Modify existing employee information.
- **Delete Employee**: Remove an employee record from the system.
- **Responsive UI**: The user interface is responsive and adjusts across devices (desktop, tablet, mobile).
- **IndexedDB**: Data is stored locally in the user's browser using IndexedDB.
- **Firebase Hosting**: App is hosted using the Firebase.
- **Unit Testing**: App has over 60% test coverage.

## Technologies Used

- **Frontend**:
  - **Angular 16**: The application is developed using Angular 16 for its reactive features, performance improvements, and enhanced developer experience.
  - **Angular Signals**: Used for managing reactive state changes, enabling automatic updates in components.
  - **RxJS**: For managing asynchronous operations and handling reactive forms.
  - **PrimeNG**: For UI components such as forms, buttons, modals, and tables.
  - **Firebase**: Used hosting the app.
  - **SCSS**: Used for styling the application to match the Figma design.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/RishikaDubey/EMS.git
cd employee-management-system
```

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Setup Firebase Project and Run Locally

To configure Firebase, ensure you have Firebase set up.

- Create a Firebase project
- Run the Application Locally

```bash
ng serve
```

This will start the application on http://localhost:4200.

## 5. Deploy to Firebase

To deploy to Firebase:

1. **Install Firebase CLI globally (if not installed):**
   ```bash
   npm install -g firebase-tools
   ```
   
2. **Login to Firebase:**
    ```bash
    firebase login
    ```

3. **Deploy to Firebase:**
    ```bash
      npm run deploy
    ```

Once deployed, the app will be live at your Firebase hosting URL.
