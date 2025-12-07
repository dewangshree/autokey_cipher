from flask import Flask, render_template, request, jsonify
import string
import random

app = Flask(__name__)

ALPH = string.ascii_uppercase

def clean_text(text):
    """Remove non-alphabetic characters and convert to uppercase"""
    return ''.join(ch for ch in text.upper() if ch.isalpha())

def encrypt_autokey(plaintext, keyword):
    """Encrypt plaintext using autokey cipher"""
    P = clean_text(plaintext)
    K = clean_text(keyword)
    
    if not P:
        return {"error": "Plaintext cannot be empty"}
    if not K:
        return {"error": "Keyword cannot be empty"}
    
    # Keystream is keyword + plaintext
    keystream = K + P
    ciphertext = ""
    steps = []
    
    for i in range(len(P)):
        p = P[i]
        k = keystream[i]
        pnum = ord(p) - 65
        knum = ord(k) - 65
        cnum = (pnum + knum) % 26
        c = chr(cnum + 65)
        ciphertext += c
        
        steps.append({
            "step": i + 1,
            "plaintext_letter": p,
            "plaintext_num": pnum,
            "key_letter": k,
            "key_num": knum,
            "calculation": f"{pnum} + {knum} = {cnum}",
            "ciphertext_letter": c,
            "ciphertext_num": cnum
        })
    
    return {
        "ciphertext": ciphertext, 
        "keystream": keystream[:len(P)],
        "steps": steps
    }

def decrypt_autokey(ciphertext, keyword):
    """Decrypt ciphertext using autokey cipher"""
    C = clean_text(ciphertext)
    K = clean_text(keyword)
    
    if not C:
        return {"error": "Ciphertext cannot be empty"}
    if not K:
        return {"error": "Keyword cannot be empty"}
    
    plaintext = ""
    keystream = K
    steps = []
    
    for i in range(len(C)):
        c = C[i]
        k = keystream[i]
        cnum = ord(c) - 65
        knum = ord(k) - 65
        pnum = (cnum - knum) % 26
        p = chr(pnum + 65)
        plaintext += p
        # Append decrypted letter to keystream for next iteration
        keystream += p
        
        steps.append({
            "step": i + 1,
            "ciphertext_letter": c,
            "ciphertext_num": cnum,
            "key_letter": k,
            "key_num": knum,
            "calculation": f"{cnum} - {knum} = {pnum} (mod 26)",
            "plaintext_letter": p,
            "plaintext_num": pnum
        })
    
    return {
        "plaintext": plaintext, 
        "keystream": K + plaintext[:len(C)],
        "steps": steps
    }

def generate_random_key(length=None):
    """Generate a random key of specified length, or random length between 5-20"""
    if length is None:
        length = random.randint(5, 20)
    return ''.join(random.choice(ALPH) for _ in range(length))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.json
    plaintext = data.get('plaintext', '')
    keyword = data.get('keyword', '')
    
    result = encrypt_autokey(plaintext, keyword)
    return jsonify(result)

@app.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.json
    ciphertext = data.get('ciphertext', '')
    keyword = data.get('keyword', '')
    
    result = decrypt_autokey(ciphertext, keyword)
    return jsonify(result)

@app.route('/generate_key', methods=['POST'])
def generate_key():
    data = request.json
    # Generate random length between 5-20
    length = random.randint(5, 20)
    key = generate_random_key(length)
    return jsonify({"key": key, "length": length})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

