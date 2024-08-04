async function predict() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please upload an image.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file); // Ensure this matches the expected field name by the API

    try {
        // Use your Hugging Face Space API endpoint
        const response = await axios.post('https://sakibrumu-food-image-classification.hf.space/run/predict?__theme=light', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const label = response.data.label; // Adjust based on the actual API response
        document.getElementById('result').innerText = `Prediction: ${label}`;

        // Fetch dish details
        const detailsResponse = await fetch('dish_details.json');
        const detailsData = await detailsResponse.json();
        const dishDetails = detailsData[label]; // Adjust based on how your JSON is structured

        displayDishDetails(dishDetails);
    } catch (error) {
        console.error('Error making prediction:', error);
        document.getElementById('result').innerText = 'Error making prediction';
    }
}

function previewImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imgElement = document.createElement('img');
        imgElement.src = event.target.result;
        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '300px';
        
        const imagePreviewDiv = document.getElementById('imagePreview');
        imagePreviewDiv.innerHTML = ''; // Clear previous previews
        imagePreviewDiv.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
}

function displayDishDetails(details) {
    const detailsDiv = document.getElementById('dish-details');
    if (!details) {
        detailsDiv.innerText = 'No details available for this dish.';
        return;
    }
    
    detailsDiv.innerHTML = `
        <p><strong>Name:</strong> ${details.label}</p>
        <p><strong>Description:</strong> ${details.description}</p>
    `;
}
