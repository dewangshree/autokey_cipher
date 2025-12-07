// DOM Elements - Encrypt Section
const encryptKeywordInput = document.getElementById('encrypt-keyword');
const encryptPlaintextInput = document.getElementById('encrypt-plaintext');
const encryptCiphertextOutput = document.getElementById('encrypt-ciphertext');
const encryptBtn = document.getElementById('encryptBtn');
const generateEncryptKeyBtn = document.getElementById('generateEncryptKeyBtn');
const encryptStepsSection = document.getElementById('encrypt-steps-section');
const encryptStepsContainer = document.getElementById('encrypt-steps-container');

// DOM Elements - Decrypt Section
const decryptKeywordInput = document.getElementById('decrypt-keyword');
const decryptCiphertextInput = document.getElementById('decrypt-ciphertext');
const decryptPlaintextOutput = document.getElementById('decrypt-plaintext');
const decryptBtn = document.getElementById('decryptBtn');
const generateDecryptKeyBtn = document.getElementById('generateDecryptKeyBtn');
const decryptStepsSection = document.getElementById('decrypt-steps-section');
const decryptStepsContainer = document.getElementById('decrypt-steps-container');

// Error message
const errorMessage = document.getElementById('error-message');

// Hide error message initially
errorMessage.classList.remove('show');

// Generate random key for encrypt section
generateEncryptKeyBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/generate_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        if (data.key) {
            encryptKeywordInput.value = data.key;
            showError(''); // Clear any errors
        }
    } catch (error) {
        showError('Error generating key: ' + error.message);
    }
});

// Generate random key for decrypt section
generateDecryptKeyBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/generate_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });
        
        const data = await response.json();
        if (data.key) {
            decryptKeywordInput.value = data.key;
            showError(''); // Clear any errors
        }
    } catch (error) {
        showError('Error generating key: ' + error.message);
    }
});

// Display encryption steps
function displayEncryptionSteps(steps, keystream) {
    encryptStepsContainer.innerHTML = `
        <div class="steps-header">
            <p><strong>Keystream:</strong> <code>${keystream}</code></p>
        </div>
    `;
    
    steps.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <div class="step-number">Step ${step.step}</div>
            <div class="step-details">
                <div class="step-row">
                    <span class="step-label">Plaintext Letter:</span>
                    <span class="step-value">${step.plaintext_letter} (${step.plaintext_num})</span>
                </div>
                <div class="step-row">
                    <span class="step-label">Key Letter:</span>
                    <span class="step-value">${step.key_letter} (${step.key_num})</span>
                </div>
                <div class="step-row">
                    <span class="step-label">Calculation:</span>
                    <span class="step-value calculation">${step.plaintext_letter} + ${step.key_letter} = ${step.ciphertext_letter}</span>
                    <span class="step-value calculation">(${step.plaintext_num} + ${step.key_num} = ${step.ciphertext_num} mod 26)</span>
                </div>
                <div class="step-row">
                    <span class="step-label">Ciphertext Letter:</span>
                    <span class="step-value result">${step.ciphertext_letter} (${step.ciphertext_num})</span>
                </div>
            </div>
        `;
        encryptStepsContainer.appendChild(stepDiv);
    });
    
    encryptStepsSection.style.display = 'block';
}

// Display decryption steps
function displayDecryptionSteps(steps, keystream) {
    decryptStepsContainer.innerHTML = `
        <div class="steps-header">
            <p><strong>Keystream:</strong> <code>${keystream}</code></p>
        </div>
    `;
    
    steps.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <div class="step-number">Step ${step.step}</div>
            <div class="step-details">
                <div class="step-row">
                    <span class="step-label">Ciphertext Letter:</span>
                    <span class="step-value">${step.ciphertext_letter} (${step.ciphertext_num})</span>
                </div>
                <div class="step-row">
                    <span class="step-label">Key Letter:</span>
                    <span class="step-value">${step.key_letter} (${step.key_num})</span>
                </div>
                <div class="step-row">
                    <span class="step-label">Calculation:</span>
                    <span class="step-value calculation">${step.ciphertext_letter} - ${step.key_letter} = ${step.plaintext_letter}</span>
                    <span class="step-value calculation">(${step.ciphertext_num} - ${step.key_num} = ${step.plaintext_num} mod 26)</span>
                </div>
                <div class="step-row">
                    <span class="step-label">Plaintext Letter:</span>
                    <span class="step-value result">${step.plaintext_letter} (${step.plaintext_num})</span>
                </div>
            </div>
        `;
        decryptStepsContainer.appendChild(stepDiv);
    });
    
    decryptStepsSection.style.display = 'block';
}

// Encrypt function
encryptBtn.addEventListener('click', async () => {
    const plaintext = encryptPlaintextInput.value.trim();
    const keyword = encryptKeywordInput.value.trim();
    
    if (!plaintext) {
        showError('Please enter a plaintext to encrypt.');
        return;
    }
    
    if (!keyword) {
        showError('Please enter a keyword.');
        return;
    }
    
    try {
        const response = await fetch('/encrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plaintext, keyword })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showError(data.error);
            encryptCiphertextOutput.value = '';
            encryptStepsSection.style.display = 'none';
        } else {
            encryptCiphertextOutput.value = data.ciphertext;
            showError(''); // Clear errors
            if (data.steps) {
                displayEncryptionSteps(data.steps, data.keystream);
            }
        }
    } catch (error) {
        showError('Error encrypting: ' + error.message);
    }
});

// Decrypt function
decryptBtn.addEventListener('click', async () => {
    const ciphertext = decryptCiphertextInput.value.trim();
    const keyword = decryptKeywordInput.value.trim();
    
    if (!ciphertext) {
        showError('Please enter ciphertext to decrypt.');
        return;
    }
    
    if (!keyword) {
        showError('Please enter a keyword.');
        return;
    }
    
    try {
        const response = await fetch('/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ciphertext: ciphertext, keyword })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showError(data.error);
            decryptPlaintextOutput.value = '';
            decryptStepsSection.style.display = 'none';
        } else {
            decryptPlaintextOutput.value = data.plaintext;
            showError(''); // Clear errors
            if (data.steps) {
                displayDecryptionSteps(data.steps, data.keystream);
            }
        }
    } catch (error) {
        showError('Error decrypting: ' + error.message);
    }
});

// Show/hide error message
function showError(message) {
    if (message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    } else {
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';
    }
}

// Allow Enter key to trigger encrypt/decrypt
encryptPlaintextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        encryptBtn.click();
    }
});

encryptKeywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        encryptBtn.click();
    }
});

decryptCiphertextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        decryptBtn.click();
    }
});

decryptKeywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        decryptBtn.click();
    }
});
