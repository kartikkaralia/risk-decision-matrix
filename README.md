# Risk Decision Matrix

A simple interactive web application that helps assess and visualize risk levels based on user responses to a customizable set of questions. The tool calculates an overall risk score, breaks down risk by categories, and provides actionable recommendations.

---

## Features

- Dynamically loads risk assessment questions from a JSON file.
- Displays questions with multiple-choice answers (radio buttons).
- Calculates overall risk level (Low / Medium / High) based on user inputs.
- Shows category-wise insights and tailored recommendations.
- Responsive, clean UI styled with Bootstrap.
- Basic error handling for data loading, parsing, and input validation.

---

## Demo


<img width="1898" height="865" alt="image" src="https://github.com/user-attachments/assets/a8cc9d3a-e9a8-44be-be75-c54d25004fde" />


---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari).
- A simple HTTP server to serve the files (optional but recommended for fetch to work properly).

### Usage

1. Create/run local server. You can either use the following methods or some other method of your choice.

   a. Use XAMPP server

   b. Use python 3:
      ```code
      python3 -m http.server 8000
      ```

2. Open index.html in your browser or navigate to http://localhost:8000 if using a local server. (The link may vary based on the type of server being used)

---

## Project Structure

```text
risk-decision-matrix
├── index.html            # Main HTML page
├── style.css             # Custom styles
├── script.js             # JavaScript logic for loading questions and calculating risk
├── questions.json        # JSON file containing risk assessment questions and options
├── README.md             # This file
├── LICENSE               # License file
```

---

## How to Use

- The app loads a list of questions dynamically from questions.json.
- Select one answer per question.
- Click Calculate Risk to see the overall risk score and category-specific recommendations.
- If any question is unanswered, an alert will prompt to complete all questions.

---

## Customizing Questions

- Edit questions.json to add, remove, or modify questions and their options. Each question should have:
  - question: The question text.
  - category: The risk category it belongs to.
  - options: Array of possible answers, each with:
    - text: Display text for the option.
    - score: Numeric value assigned for risk calculation.

---

## Technologies Used

- HTML5
- CSS3 and Bootstrap 5 for styling and layout
- JavaScript

---

## Error Handling

- Displays error messages if questions fail to load or are improperly formatted.
- Validates that all questions have an answer before calculating risk.
- Logs errors to the browser console for debugging.
