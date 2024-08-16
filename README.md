# Project Name

## Description

This project is a web-based application designed to allow users to use chatGPT with speech recognition capabilities directly from their browsers. The application features a user-friendly interface for starting and stopping audio recordings, and it supports both day and night modes for enhanced usability in different lighting conditions. The frontend is developed using HTML, CSS, and JavaScript, with a backend component to handle more complex processing and storage requirements, using Python and Flask.

## Features
- Audio recording with start and stop functionality.
- Dynamic theme switching between day and night modes.
- Text to speech recognition using Eleven Labs Api and Google Text-To-Speech

# Prerequisites
- Node.js and npm (for the frontend)
- Python3 (for the backend)
- OpenAI API: https://platform.openai.com/docs/overview

# First Install Pip and Python3
This website contains the installation instructions for pip:
    - https://pip.pypa.io/en/stable/installation/
This website contains the installation instructions for python3:
    - https://www.python.org/downloads/


# Next install all of the required packages to run the application
- pip install SpeechRecognition
- pip install pydub
- pip install OpenAI
- pip install elevenlabs
- pip install python-dotenv
- pip install flask
- pip install Python-IO
- pip install pybase64
- pip install gtts

## Starting Guide
- First clone the repository
- Once you have cloned the repository start the flask app by using: flask run
- now once the app is open click start and ask whatever you wish
- Once you are done speaking click stop and the app will speak the answer back to you as well as displaying it in the the text box in the middle of the screen
