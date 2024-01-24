# Java Exam Front-End

Java Exam Front-End is a React application that interfaces with the Java Exam Back-End. It provides a user-friendly interface for managing employees and utilizes GraphQL for efficient data querying.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/cruzmarkus4321/java-exam-front-end.git
    ```

2. Navigate to the project directory:

    ```bash
    cd java-exam-front-end
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

Configure the GraphQL endpoint in the `index.js` file:

```javascript
const httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
});
```

## Usage

1. Run the application using npm:

    ```bash
    npm start
    ```

2. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000)
