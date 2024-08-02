document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const resultDiv = document.getElementById('result');

    uploadForm.onsubmit = async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const fileInput = uploadForm.querySelector('input[type="file"]');
        const submitButton = uploadForm.querySelector('button');

        // Disable the form and show a loading message
        fileInput.disabled = true;
        submitButton.disabled = true;
        submitButton.innerText = 'Uploading...';

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            // Display the result
            resultDiv.innerText = JSON.stringify(result, null, 2);
            resultDiv.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerText = 'An error occurred while processing your request. Please try again.';
            resultDiv.style.display = 'block';
        } finally {
            // Re-enable the form and reset the button text
            fileInput.disabled = false;
            submitButton.disabled = false;
            submitButton.innerText = 'Upload and Classify';
        }
    };
});
