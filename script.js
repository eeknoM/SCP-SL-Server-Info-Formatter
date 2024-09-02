function applyFormatting(startTag, endTag) {
    const inputTextArea = document.getElementById('inputText');
    const text = inputTextArea.value;
    const selectionStart = inputTextArea.selectionStart;
    const selectionEnd = inputTextArea.selectionEnd;
    const selectedText = text.substring(selectionStart, selectionEnd);

    if (!selectedText && startTag !== '<a href="') {
        showError("Please select some text to apply formatting.");
        return;
    }

    const beforeText = text.substring(0, selectionStart);
    const afterText = text.substring(selectionEnd);

    inputTextArea.value = beforeText + startTag + selectedText + endTag + afterText;
    updateFormattedText();
}

function applyCustomColor() {
    const color = document.getElementById('customColor').value.trim();
    if (!color) {
        showError("Please enter a valid color.");
        return;
    }
    applyFormatting(`<color=${color}>`, '</color>');
}

function applyCustomSize() {
    const size = document.getElementById('customSize').value.trim();
    if (!size || isNaN(size)) {
        showError("Please enter a valid size.");
        return;
    }
    applyFormatting(`<size=${size}>`, '</size>');
}

function applyGradient() {
    const gradientStart = document.getElementById('gradientStart').value.trim();
    const gradientMiddle = document.getElementById('gradientMiddle').value.trim();
    const gradientEnd = document.getElementById('gradientEnd').value.trim();

    if (!gradientStart || !gradientEnd) {
        showError("Please enter valid start and end colors for the gradient.");
        return;
    }

    let gradientTag;
    if (gradientMiddle) {
        gradientTag = `<gradient start="${gradientStart}" middle="${gradientMiddle}" end="${gradientEnd}">`;
    } else {
        gradientTag = `<gradient start="${gradientStart}" end="${gradientEnd}">`;
    }

    applyFormatting(gradientTag, '</gradient>');
}

function applyLink() {
    const url = document.getElementById('linkURL').value.trim();
    const inputTextArea = document.getElementById('inputText');
    const text = inputTextArea.value;
    const selectionStart = inputTextArea.selectionStart;
    const selectionEnd = inputTextArea.selectionEnd;
    const selectedText = text.substring(selectionStart, selectionEnd);

    if (!url) {
        showError("Please enter a URL.");
        return;
    }

    if (!selectedText) {
        showError("Please select some text to make it a link.");
        return;
    }

    const linkTag = `<a href="${url}">${selectedText}</a>`;
    const beforeText = text.substring(0, selectionStart);
    const afterText = text.substring(selectionEnd);

    inputTextArea.value = beforeText + linkTag + afterText;
    updateFormattedText();
}

function updateFormattedText() {
    const formattedText = document.getElementById('inputText').value;
    console.log("Formatted Text:", formattedText); // Debugging line
    document.getElementById('formattedText').innerText = formattedText;
    updatePreview(formattedText);
    clearError();
}

function updatePreview(text) {
    console.log("Updating Preview with text:", text); // Debugging line

    const Preview = document.getElementById('Preview');
    if (!Preview) {
        console.error("Preview element not found.");
        return;
    }

    let previewText = text;

    // Debug each replacement step
    previewText = previewText.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>');
    console.log("After bold replacement:", previewText);

    previewText = previewText.replace(/<i>(.*?)<\/i>/g, '<em>$1</em>');
    console.log("After italic replacement:", previewText);

    previewText = previewText.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>');
    console.log("After underline replacement:", previewText);

    previewText = previewText.replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>');
    console.log("After color replacement:", previewText);

    previewText = previewText.replace(/<size=(.*?)>(.*?)<\/size>/g, '<span style="font-size:$1px;">$2</span>');
    console.log("After size replacement:", previewText);

    previewText = previewText.replace(/<gradient start="(.*?)" middle="(.*?)" end="(.*?)">(.*?)<\/gradient>/g, function(_, start, middle, end, content) {
        return `<span style="background: linear-gradient(to right, ${start}, ${middle}, ${end}); -webkit-background-clip: text; color: transparent;">${content}</span>`;
    });
    console.log("After gradient replacement (3 colors):", previewText);

    previewText = previewText.replace(/<gradient start="(.*?)" end="(.*?)">(.*?)<\/gradient>/g, function(_, start, end, content) {
        return `<span style="background: linear-gradient(to right, ${start}, ${end}); -webkit-background-clip: text; color: transparent;">${content}</span>`;
    });
    console.log("After gradient replacement (2 colors):", previewText);

    previewText = previewText.replace(/<a href="(.*?)">(.*?)<\/a>/g, '<a href="$1">$2</a>');
    console.log("After link replacement:", previewText);

    // Align replacements
    previewText = previewText.replace(/<align=left>(.*?)<\/align>/g, '<div style="text-align: left;">$1</div>');
    console.log("After align left replacement:", previewText);

    previewText = previewText.replace(/<align=center>(.*?)<\/align>/g, '<div style="text-align: center;">$1</div>');
    console.log("After align center replacement:", previewText);

    previewText = previewText.replace(/<align=right>(.*?)<\/align>/g, '<div style="text-align: right;">$1</div>');
    console.log("After align right replacement:", previewText);

    Preview.innerHTML = previewText;
}

function showError(message) {
    document.getElementById('error').innerText = message;
}

function clearError() {
    document.getElementById('error').innerText = '';
}

document.getElementById('inputText').addEventListener('input', () => {
    updateFormattedText();
});
