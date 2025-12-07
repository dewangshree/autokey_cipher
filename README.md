# Autokey Cipher Web Application

A beautiful web application for encrypting and decrypting messages using the Autokey Cipher algorithm.

## Features

- 🔐 **Encrypt** plaintext using autokey cipher
- 🔓 **Decrypt** ciphertext back to plaintext
- 🎲 **Random Key Generator** - Generate random keys with one click
- 📚 **Educational Explanation** - Learn how autokey cipher works
- 🎨 **Modern UI** - Beautiful, responsive design

## How Autokey Cipher Works

The Autokey Cipher is a polyalphabetic substitution cipher that uses the plaintext itself as part of the key. Unlike the Vigenère cipher which repeats a short keyword, the autokey cipher extends the key by appending the plaintext to the initial keyword.

### Encryption Process:
1. The keystream is formed by: `Keyword + Plaintext`
2. Each letter is encrypted using: `C = (P + K) mod 26`
3. Where P is the plaintext letter, K is the keystream letter, and C is the ciphertext letter

### Key Length Handling:
- **If key is shorter than plaintext**: The remaining keystream is automatically generated using the plaintext itself
- **If key is longer than plaintext**: Only the first N letters are used (where N is the plaintext length)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

## Usage

1. **Enter a Keyword**: Type your encryption key or click "Generate Random Key"
2. **Enter Plaintext**: Type the message you want to encrypt
3. **Click Encrypt**: The ciphertext will appear in the output field
4. **Click Decrypt**: Decrypt the ciphertext back to plaintext using the same keyword

## Project Structure

```
autokey-cipher-app/
├── app.py                 # Flask backend with encryption/decryption logic
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css    # Styling
│   └── js/
│       └── main.js      # Frontend JavaScript
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Modern CSS with gradients and animations

