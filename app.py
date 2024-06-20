import speech_recognition as sr
from pydub import AudioSegment
from pydub.playback import play
from openai import OpenAI
import elevenlabs, os, json, io, requests
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, send_file, render_template, Response
from io import BytesIO
from base64 import b64encode
from gtts import gTTS 


app = Flask(__name__)



load_dotenv()
# Load API keys from environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

def convert_audio_to_wav(audio_path):
    sound = AudioSegment.from_file(audio_path)
    wav_path = audio_path.rsplit('.', 1)[0] + ".wav"
    sound.export(wav_path, format="wav")
    return wav_path

def listen(audio_path):
    wav_path = convert_audio_to_wav(audio_path)
    recognizer = sr.Recognizer()
    with sr.AudioFile(wav_path) as source:
        audio_data = recognizer.record(source)
    try:
        # Assuming you're using Google's speech recognition
        text = recognizer.recognize_google(audio_data)
        return text
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
    
    return None

def process_command_with_gpt(text):
    response = client.completions.create(model= "gpt-3.5-turbo-instruct",
    prompt = text,
    max_tokens = 4000,
    n=1,
    stop=None,
    )
    return response.choices[0].text

def tts_with_gtts(text):
    tts = gTTS(text=text, lang='en')  # Assuming you want English
    audio_io = BytesIO()
    tts.write_to_fp(audio_io)
    audio_io.seek(0)  # Rewind the buffer to the beginning.
    return audio_io

def tts_with_eleven_labs(text):
    url = "https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9"

    querystring = {"optimize_streaming_latency":"3"}

    payload = {
        "voice_settings": {
            "similarity_boost": 0.5,
            "stability": 0.5
        },
        "text": text,
        "model_id": "eleven_monolingual_v1"
    }
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    if response.status_code == 200:
        # Assuming the response content is audio data, save it to a file
        audio_data = response.content
        audio_file = io.BytesIO(audio_data)  # Use a BytesIO object as an in-memory file
        return audio_file

    else:
        print(f"Failed to get audio. Status code: {response.status_code}")
        print(f"Response: {response.text}")


@app.route('/process_speech', methods=['POST'])
def process_speech():
    # Receive the audio file from the POST request
    audio_file = request.files['audio_data']
    
    # Save the audio file temporarily or process directly from memory
    audio_path = "./temp_audio.wav"
    audio_file.save(audio_path)
    
    # Use your existing `listen()` function logic to process the saved audio
    # You might need to adjust the listen function to accept a file path or file object
    command = listen(audio_path)  # Adjusted to accept a file path
    
    if command:
        response_text = process_command_with_gpt(command)
        print(f"You said: {command}")
        print(response_text)
        # Instead of Eleven Labs, use gTTS
        audio_response = tts_with_gtts(response_text)
        if audio_response:
            # Convert audio response to base64 string
            audio_response_base64 = b64encode(audio_response.read()).decode('utf-8')
            # Return both the audio and text in JSON format
            return jsonify({
                "audio_response": audio_response_base64,
                "text_response": response_text
            })
    else:
        return jsonify({"error": "Could not process the audio"}), 400
    
@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)


