async function predict() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please upload an image.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file); // Ensure 'file' is the correct key

    try {
        // Send the image to the Hugging Face Space API for prediction
        const response = await axios.post('https://sakibrumu-food-image-classification.hf.space/run/predict?__theme=light', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Extract session_hash from the response
        const sessionHash = response.data.session_hash;

        // Poll for the result
        const eventSource = new EventSource(`https://sakibrumu-food-image-classification.hf.space/queue/data?session_hash=${sessionHash}`);

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.label) {
                document.getElementById('result').innerText = `Prediction: ${data.label}`;
                eventSource.close(); // Close the event source when done
            }
        };

        eventSource.onerror = function(error) {
            console.error('Error fetching prediction result:', error);
            document.getElementById('result').innerText = 'Error fetching prediction result';
            eventSource.close(); // Close the event source on error
        };

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
