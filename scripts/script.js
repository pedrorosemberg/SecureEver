document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('passwordForm');
    const lengthInput = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const resultSpan = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthBarFill = document.getElementById('strengthBarFill');
    const strengthText = document.getElementById('strengthText');

    lengthInput.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const length = parseInt(lengthInput.value);
        const uppercase = document.getElementById('uppercase').checked;
        const lowercase = document.getElementById('lowercase').checked;
        const numbers = document.getElementById('numbers').checked;
        const symbols = document.getElementById('symbols').checked;
        
        if (!uppercase && !lowercase && !numbers && !symbols) {
            resultSpan.textContent = 'Por favor, selecione pelo menos um tipo de caractere.';
            passwordDisplay.classList.remove('hidden');
            copyButton.classList.add('hidden');
            strengthMeter.classList.add('hidden');
            return;
        }
        
        const password = generatePassword(length, uppercase, lowercase, numbers, symbols);
        
        resultSpan.textContent = password;
        passwordDisplay.classList.remove('hidden');
        copyButton.classList.remove('hidden');
        strengthMeter.classList.remove('hidden');
        
        const strengthResult = calculatePasswordStrength(password, uppercase, lowercase, numbers, symbols);
        updateStrengthBar(strengthResult);
    });

    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(resultSpan.textContent).then(() => {
            copyButton.textContent = 'Copiado!';
            copyButton.classList.add('copied');
            setTimeout(() => {
                copyButton.textContent = 'Copiar Senha';
                copyButton.classList.remove('copied');
            }, 2000);
        });
    });

    function generatePassword(length, uppercase, lowercase, numbers, symbols) {
        let chars = '';
        if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (numbers) chars += '0123456789';
        if (symbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        
        if (chars === '') {
            return 'Por favor, selecione pelo menos um tipo de caractere.';
        }
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return password;
    }

    function calculatePasswordStrength(password, uppercase, lowercase, numbers, symbols) {
        let strength = 0;
        let typesCount = 0;

        if (uppercase && password.match(/[A-Z]/)) typesCount++;
        if (lowercase && password.match(/[a-z]/)) typesCount++;
        if (numbers && password.match(/[0-9]/)) typesCount++;
        if (symbols && password.match(/[^A-Za-z0-9]/)) typesCount++;

        if (password.length >= 8) strength += 10;
        if (password.length >= 12) strength += 20;
        if (password.length >= 16) strength += 20;

        strength += typesCount * 15;

        return { score: Math.min(100, strength), typesCount: typesCount };
    }

    function updateStrengthBar(strengthResult) {
        let fillWidth, color, text;
        const { score, typesCount } = strengthResult;

        if (score < 15 || typesCount === 1) {
            fillWidth = '25%';
            color = '#ff4444'; // Vermelho
            text = 'Fraca';
        } else if ((score >= 16 && score <= 25) || typesCount === 2) {
            fillWidth = '50%';
            color = '#ffeb3b'; // Amarelo
            text = 'Média';
        } else if ((score >= 26 && score <= 89) || typesCount === 3) {
            fillWidth = '75%';
            color = '#2196F3'; // Azul
            text = 'Boa';
        } else if (score >= 90 && typesCount === 4) {
            fillWidth = '100%';
            color = '#4CAF50'; // Verde
            text = 'Forte e segura';
        } else {
            fillWidth = '75%';
            color = '#2196F3'; // Azul
            text = 'Boa';
        }

        strengthBarFill.style.width = fillWidth;
        strengthBarFill.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
});