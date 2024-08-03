async function predictImage() {
    const imageInput = document.getElementById('imageInput');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const labelElement = document.getElementById('label');
    const confidenceElement = document.getElementById('confidence');

    if (imageInput.files.length === 0) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Please select an image first.';
        resultDiv.style.display = 'none';
        return;
    }

    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/Sakibrumu/Food_Image_Classification', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_HUGGING_FACE_API_KEY'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Prediction request failed');
        }

        const result = await response.json();
        const label = result.label;
        const confidence = result.confidence;

        labelElement.textContent = `Label: ${label}`;
        confidenceElement.textContent = `Confidence: ${confidence}`;

        // Fetch and display dish details
        const dishDetailsResponse = await fetch('/path/to/dish_detail.json');
        const dishDetails = await dishDetailsResponse.json();

        if (dishDetails[label]) {
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = `Description: ${dishDetails[label].description}`;

            const ingredientsElement = document.createElement('p');
            ingredientsElement.textContent = `Ingredients: ${dishDetails[label].ingredients.join(', ')}`;

            resultDiv.appendChild(descriptionElement);
            resultDiv.appendChild(ingredientsElement);
        }

        resultDiv.style.display = 'block';
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Error: ${error.message}`;
        resultDiv.style.display = 'none';
    }
}
