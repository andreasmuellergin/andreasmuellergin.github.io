document.addEventListener('DOMContentLoaded', () => {
    const surveyContainer =     document.getElementById('survey-container');

    var humhubUrl = "https://devel.unser-nb.de"; // 
    var accessToken = "Bearer jhYBUKbyD89_RzzQBn0Efcz4x1LrPOvC7KV2FdnLaBVHVe4YnRSC6siiDroTsMhBOv_bgj_tlLllGq_mSDKuLq"; // Optional: If your HumHub API requires authentication, set your token here

    // Replace with your actual API endpoint for global surveys
    // Make sure to configure CORS on your HumHub instance if accessing from a different domain!
    const API_SURVEYS_PATH = '/survey';
    // Replace with your actual API endpoint for survey answers6
    const API_ANSWERS_PATH = '/survey/{id}/survey-answer'; // {id} will be replaced

    fetchAndDisplaySurveys();
    async function fetchAndDisplaySurveys() {

        if (!humhubUrl) {
            alert('Please enter your HumHub Base URL.');
            return;
        }

        surveyContainer.innerHTML = '<p class="loading-message">Loading surveys...</p>';

        try {
            const url = `${humhubUrl}/api/v1${API_SURVEYS_PATH}`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            };

            const response = await fetch(url,  { headers: headers });

            if (!response.ok) {
                // Check if the error is due to CORS or API key issues
                if (response.status === 401 || response.status === 403) {
                     throw new Error(`Authentication/Authorization error (${response.status}). Please check your Access Token and HumHub API permissions. Also ensure CORS is configured on your HumHub instance.`);
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched surveys:', data);

            if (data.length === 0) {
                surveyContainer.innerHTML = '<p class="loading-message">No surveys found.</p>';
                return;
            }

            surveyContainer.innerHTML = ''; // Clear loading message

            data.forEach(survey => {
                const surveyTile = document.createElement('div');
                surveyTile.classList.add('survey-tile');
                surveyTile.dataset.surveyId = survey.id; // Store survey ID for fetching answers

                // Basic display of survey info - adjust based on actual API response structure
                surveyTile.innerHTML = `
                    <h2>${survey.question}</h2>
                    <p><strong>Created:</strong> ${new Date(survey.created_at).toLocaleDateString()}</p>
                    <p>${survey.description || 'No description available.'}</p>
                    <div class="survey-answers">
                        <p class="answers-loading">Click to load answers...</p>
                    </div>
                `;

                surveyTile.addEventListener('click', async () => {
                    // Toggle expanded state
                    surveyTile.classList.toggle('expanded');

                    const answersDiv = surveyTile.querySelector('.survey-answers');
                    if (surveyTile.classList.contains('expanded')) {
                        // If expanded, fetch answers (only if not already loaded)
                        if (answersDiv.dataset.loaded !== 'true') {
                            await fetchAndDisplayAnswers(survey.id, answersDiv);
                        }
                    } else {
                        // If collapsing, clear answers or simply let max-height transition hide them
                        // For this example, we'll let max-height handle the visual hiding
                    }
                });

                surveyContainer.appendChild(surveyTile);
            });

        } catch (error) {
            console.error('Error fetching surveys:', error);
            surveyContainer.innerHTML = `<p class="loading-message error">Error loading surveys: ${error.message}. Please check your HumHub URL, Access Token, and ensure CORS is correctly configured on your HumHub instance for API access.</p>`;
        }
    }

    async function fetchAndDisplayAnswers(surveyId, answersDiv) {

        answersDiv.innerHTML = '<p class="answers-loading">Loading answers...</p>';

        try {
            const url = `${humhubUrl}/api/v1${API_ANSWERS_PATH.replace('{id}', surveyId)}`;
            const headers = {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            };

            const response = await fetch(url, { headers });

            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                     throw new Error(`Authentication/Authorization error (${response.status}). Please check your Access Token and HumHub API permissions.`);
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Fetched answers for survey ${surveyId}:`, data);

            if (data.length === 0) {
                answersDiv.innerHTML = '<p>No answers found for this survey.</p>';
                answersDiv.dataset.loaded = 'true';
                return;
            }

            const answersList = document.createElement('ul');
            data.forEach(answer => {
                const listItem = document.createElement('li');
                // Adjust based on the actual structure of a survey-answer object
                // The Swagger docs show `answer` as a string, but a real survey might have more structured answers
                listItem.innerHTML = `
                    <strong>User ${answer.created_by_id || 'Unknown'}:</strong>
                    <span>${answer.answer || 'No answer content provided'}</span>
                    <br>
                    <small>Answered on: ${new Date(answer.created_at).toLocaleString()}</small>
                `;
                answersList.appendChild(listItem);
            });

            answersDiv.innerHTML = ''; // Clear loading message
            answersDiv.appendChild(answersList);
            answersDiv.dataset.loaded = 'true'; // Mark as loaded
        } catch (error) {
            console.error(`Error fetching answers for survey ${surveyId}:`, error);
            answersDiv.innerHTML = `<p class="error">Error loading answers: ${error.message}</p>`;
        }
    }
});