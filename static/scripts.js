async function predictImage() {
    const fileInput = document.getElementById('imageInput');
    const resultDiv = document.getElementById('result');
    const labelP = document.getElementById('label');
    const confidenceP = document.getElementById('confidence');
    const errorDiv = document.getElementById('error');
    
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    if (fileInput.files.length === 0) {
        errorDiv.innerText = 'Please select an image file.';
        errorDiv.style.display = 'block';
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/predict', { // Use relative path for Heroku deployment
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const result = await response.json();

        if (result.error) {
            errorDiv.innerText = result.error;
            errorDiv.style.display = 'block';
            return;
        }

        resultDiv.style.display = 'block';
        labelP.innerText = `Label: ${result.label}`;
        confidenceP.innerText = `Confidence: ${(result.confidences[0].confidence * 100).toFixed(2)}%`;
    } catch (error) {
        errorDiv.innerText = `An error occurred while predicting the image: ${error.message}`;
        errorDiv.style.display = 'block';
    }
}
