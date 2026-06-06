## paste this into a brower console
(async () => {
    const password = "BETWIXT";
    const message = "<h1 style='color: #0f9d58;'>🎉 You Win!</h1><p>Success! You entered the correct password.</p>";
    
    // Hash the password to create the encryption key
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const key = await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, ['encrypt']);
    
    // Encrypt the message
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, encoder.encode(message));
    
    // Output the variables for your script.js file
    console.log("const IV_B64 = '" + btoa(String.fromCharCode(...iv)) + "';");
    console.log("const PAYLOAD_B64 = '" + btoa(String.fromCharCode(...new Uint8Array(encrypted))) + "';");
})();
