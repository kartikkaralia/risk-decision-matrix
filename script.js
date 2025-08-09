// Initialize an empty array to store questions loaded from JSON
let questions = [];

// When the DOM content is fully loaded, start loading questions and set up event listener for the submit button
document.addEventListener("DOMContentLoaded", function() {
    loadQuestions();
    document.getElementById("submitBtn").addEventListener("click", calculateRisk);
});

// Fetch questions from a JSON file and handle loading/parsing errors
function loadQuestions() {
    console.log("[INFO] Starting to load questions.json...");

    fetch("questions.json")
        .then(response => {
            // Check if the HTTP response is successful
            if (!response.ok) {
                console.error(`[ERROR] HTTP error while fetching questions.json: ${response.status} ${response.statusText}`);
                throw new Error(`Failed to load questions.json (HTTP ${response.status})`);
            }
            // Parse response body as JSON
            return response.json();
        })
        .then(data => {
            try {
                // Validate that the data is an array
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format: Expected an array of questions.");
                }
                // Store the questions globally
                questions = data;
                console.log(`[INFO] Loaded ${questions.length} questions successfully.`);
                // Display questions on the page
                displayQuestions();
            } catch (parseError) {
                // Handle JSON parsing or validation errors
                console.error("[ERROR] Parsing error:", parseError);
                showErrorMessage("Error processing questions data. Please check the format.");
            }
        })
        .catch(fetchError => {
            // Handle network or fetch related errors
            console.error("[ERROR] Fetch error:", fetchError);
            showErrorMessage(`Failed to load questions. ${fetchError.message}`);
        });
}

// Display an error message inside the questions container element
function showErrorMessage(message) {
    const container = document.getElementById("questions-container");
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

// Render the loaded questions with their options as radio buttons
function displayQuestions() {
    try {
        const container = document.getElementById("questions-container");
        container.innerHTML = "";  // Clear any existing content

        // Loop through each question to create HTML markup
        questions.forEach((q, index) => {
            // Validate question structure: must have 'question' text and 'options' array
            if (!q.question || !Array.isArray(q.options)) {
                throw new Error(`Question format invalid at index ${index}`);
            }

            // Generate radio buttons for each option with their score as value
            let optionsHTML = q.options.map(option => `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question-${index}" value="${option.score}">
                    <label class="form-check-label">${option.text}</label>
                </div>
            `).join("");

            // Append the question block with all options to the container
            container.innerHTML += `
                <div class="question-card">
                    <h5>${q.question}</h5>
                    ${optionsHTML}
                </div>
            `;
        });

        console.log("[INFO] Questions rendered successfully.");
    } catch (displayError) {
        // Handle errors during rendering, e.g., malformed data
        console.error("[ERROR] Error rendering questions:", displayError);
        showErrorMessage("Failed to render questions. Check the data format.");
    }
}

// Calculate the total risk score based on selected options and display results with recommendations
function calculateRisk() {
    try {
        let totalScore = 0;          // Sum of all selected option scores
        let categoryScores = {};     // Scores grouped by question category
        let answered = 0;            // Count of answered questions

        // Iterate over all questions to gather selected answers
        questions.forEach((q, index) => {
            // Find the checked radio input for the current question
            let selected = document.querySelector(`input[name="question-${index}"]:checked`);
            if (selected) {
                let score = parseInt(selected.value, 10);
                totalScore += score;
                // Aggregate score per category, initialize if undefined
                categoryScores[q.category] = (categoryScores[q.category] || 0) + score;
                answered++;
            }
        });

        // Alert if not all questions have been answered
        if (answered < questions.length) {
            alert("Please answer all questions.");
            return;
        }

        // Determine overall risk level based on total score thresholds
        let riskLevel = "";
        if (totalScore <= 15) {
            riskLevel = "Low";
        } else if (totalScore <= 35) {
            riskLevel = "Medium";
        } else {
            riskLevel = "High";
        }

        // Generate category-specific recommendations based on scores
        let dynamicRecs = generateRecommendations(categoryScores);

        // Display the risk level, total score, and category insights in results container
        document.getElementById("results").innerHTML = `
            <div class="result-box risk-${riskLevel.toLowerCase()}">
                <h4>Overall Risk Level: ${riskLevel}</h4>
                <p><strong>Total Score:</strong> ${totalScore}</p>
                <hr>
                <h5>Category Insights:</h5>
                ${dynamicRecs}
            </div>
        `;
    } catch (error) {
        // Handle any unexpected errors during calculation
        console.error("[ERROR] Unexpected error during risk calculation:", error);
        showErrorMessage("An unexpected error occurred. Please try again.");
    }
}

// Create HTML recommendations for each category based on its risk score severity
function generateRecommendations(categoryScores) {
    let recs = "";

    // Iterate over each category and its accumulated score
    for (let [category, score] of Object.entries(categoryScores)) {
        let severity = "";
        let badgeClass = "";

        // Determine severity level and corresponding CSS badge class
        if (score <= 2) {
            severity = "Low";
            badgeClass = "badge-low";
        } else if (score <= 4) {
            severity = "Medium";
            badgeClass = "badge-medium";
        } else {
            severity = "High";
            badgeClass = "badge-high";
        }

        // Provide tailored advice text per category
        let advice = "";
        switch (category) {
            case "Data Sensitivity":
                advice = "Ensure encryption at rest and in transit. Review data classification policies.";
                break;
            case "Business Criticality":
                advice = "Implement business continuity and disaster recovery plans.";
                break;
            case "Vendor Security Posture":
                advice = "Request third-party audits, certifications, and security test reports.";
                break;
            case "Open Source Usage":
                advice = "Assess license compliance and maintain patch management processes.";
                break;
            case "Internet Exposure":
                advice = "Enable multi-factor authentication and web application firewalls.";
                break;
            case "Compliance Requirements":
                advice = "Engage compliance team to ensure legal obligations are met.";
                break;
            case "Incident Response":
                advice = "Ensure vendor conducts regular IR drills and communicates plans.";
                break;
            case "Vendor Location":
                advice = "Review cross-border data transfer agreements.";
                break;
            case "Contractual Protections":
                advice = "Add specific SLAs, penalties, and breach notification requirements.";
                break;
        }

        // Append HTML block for this category with advice and risk badge
        recs += `
            <div class="category-row">
                <div><strong>${category}</strong><br><small>${advice}</small></div>
                <div><span class="badge ${badgeClass}">${severity} Risk</span></div>
            </div>
        `;
    }

    return recs;
}
