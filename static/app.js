let mediaRecorder;
let audioChunks = [];

//NIGHT TIME 
document.getElementById("startRecord").addEventListener("click", function() {
    audioChunks = [];
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append("audio_data", audioBlob, "audio.wav");
                fetch("/process_speech", { method: "POST", body: formData })
                    .then(response => response.blob())
                    .then(data => {
                        // Play the response or handle it as needed
                        const audioUrl = URL.createObjectURL(data);
                        new Audio(audioUrl).play();
                    })
                    .catch(error => console.error(error));
            });
        })
        .catch(error => console.error(error));
});




document.getElementById("stopRecord").addEventListener("click", function() {
    mediaRecorder.stop();
    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append("audio_data", audioBlob, "audio.wav");
        fetch("/process_speech", {
            method: "POST",
            body: formData
        })
        .then(response => response.json()) // Expecting a JSON response now
        .then(data => {
            // Assuming 'data' contains 'audio_response' and 'text_response'
            // Create an audio element and play the audio response
            const audioResponse = data.audio_response;
            const audioBlob = b64toBlob(audioResponse, 'audio/mpeg'); // Convert base64 to blob
            const audioUrl = URL.createObjectURL(audioBlob);
            new Audio(audioUrl).play();
    
            // Update the gptResponseText with the returned text
            document.getElementById('gptResponseText').innerHTML = `<span class="gpt-prefix">PixelGPT:</span> ${data.text_response}`;
        })
        .catch(error => console.error('Error:', error));
    });
    
    // Helper function to convert base64-encoded data to a blob
    function b64toBlob(b64Data, contentType='', sliceSize=512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }   
        return new Blob(byteArrays, {type: contentType});
    }
    
    
});




//DAY TIME

document.getElementById("startRecordDay").addEventListener("click", function() {
    audioChunks = [];
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append("audio_data", audioBlob, "audio.wav");
                fetch("/process_speech", { method: "POST", body: formData })
                    .then(response => response.blob())
                    .then(data => {
                        // Play the response or handle it as needed
                        const audioUrl = URL.createObjectURL(data);
                        new Audio(audioUrl).play();
                    })
                    .catch(error => console.error(error));
            });
        })
        .catch(error => console.error(error));
});




document.getElementById("stopRecordDay").addEventListener("click", function() {
    mediaRecorder.stop();
    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append("audio_data", audioBlob, "audio.wav");
        fetch("/process_speech", {
            method: "POST",
            body: formData
        })
        .then(response => response.json()) // Expecting a JSON response now
        .then(data => {
            // Assuming 'data' contains 'audio_response' and 'text_response'
            // Create an audio element and play the audio response
            const audioResponse = data.audio_response;
            const audioBlob = b64toBlob(audioResponse, 'audio/mpeg'); // Convert base64 to blob
            const audioUrl = URL.createObjectURL(audioBlob);
            new Audio(audioUrl).play();
    
            // Update the gptResponseText with the returned text
            document.getElementById('gptResponseText').innerHTML = `<span class="gpt-prefix">PixelGPT:</span> ${data.text_response}`;
        })
        .catch(error => console.error('Error:', error));
    });
    
    // Helper function to convert base64-encoded data to a blob
    function b64toBlob(b64Data, contentType='', sliceSize=512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }   
        return new Blob(byteArrays, {type: contentType});
    }
    
    
});







//CHANGE BUTTONS

document.addEventListener('DOMContentLoaded', (event) => {
    const startNotPressed = document.getElementById('startRecord');
    const startPressed = document.getElementById('startPressed');
    const stopNotPressed = document.getElementById('stopRecord');
    const stopPressed = document.getElementById('stopPressed');
    const startPressedDay = document.getElementById('startPressedDay');
    const startNotPressedDay = document.getElementById('startRecordDay');
    const stopPressedDay = document.getElementById('stopPressedDay');
    const stopNotPressedDay = document.getElementById('stopRecordDay');
    
    // When the start button is not pressed, add logic to display the pressed version
    startNotPressed.addEventListener('click', function() {
        this.style.display = 'none';
        startPressed.style.display = 'inline';
        stopNotPressed.style.display = 'inline';
        stopPressed.style.display = 'none';
        // Add your start recording logic here
    });

    // When the start button is pressed, add logic to display the not pressed version
    startPressed.addEventListener('click', function() {
        this.style.display = 'none';
        startNotPressed.style.display = 'inline';
        stopNotPressed.style.display = 'inline';
        stopPressed.style.display = 'none';
        // Add logic here if needed when the start button is pressed again
    });

    // When the stop button is not pressed, add logic to display the pressed version
    stopNotPressed.addEventListener('click', function() {
        this.style.display = 'none';
        stopPressed.style.display = 'inline';
        startPressed.style.display = 'none';
        startNotPressed.style.display = 'inline';
        // Add your stop recording logic here
    });

    // When the stop button is pressed, add logic to display the not pressed version
    stopPressed.addEventListener('click', function() {
        this.style.display = 'none';
        stopNotPressed.style.display = 'inline';
        startPressed.style.display = 'none';
        startNotPressed.style.display = 'inline';
        // Add logic here if needed when the stop button is pressed again
    });



    // When the start button is not pressed, add logic to display the pressed version
    startNotPressedDay.addEventListener('click', function() {
        this.style.display = 'none';
        startPressedDay.style.display = 'inline';
        stopNotPressedDay.style.display = 'inline';
        stopPressedDay.style.display = 'none';
        // Add your start recording logic here
    });

    // When the start button is pressed, add logic to display the not pressed version
    startPressedDay.addEventListener('click', function() {
        this.style.display = 'none';
        startNotPressedDay.style.display = 'inline';
        stopNotPressedDay.style.display = 'inline';
        stopPressedDay.style.display = 'none';
        // Add logic here if needed when the start button is pressed again
    });

    // When the stop button is not pressed, add logic to display the pressed version
    stopNotPressedDay.addEventListener('click', function() {
        this.style.display = 'none';
        stopPressedDay.style.display = 'inline';
        startPressedDay.style.display = 'none';
        startNotPressedDay.style.display = 'inline';
        // Add your stop recording logic here
    });

    // When the stop button is pressed, add logic to display the not pressed version
    stopPressed.addEventListener('click', function() {
        this.style.display = 'none';
        stopNotPressedDay.style.display = 'inline';
        startPressedDay.style.display = 'none';
        startNotPressedDay.style.display = 'inline';
        // Add logic here if needed when the stop button is pressed again
    });
    
    
})
