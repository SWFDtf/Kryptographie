import os
from flask import Flask, request

app = Flask(__name__)

@app.route('/<path:endpoint>')
def handle_api(endpoint):
    # Logik für 'tetra'
    if endpoint == 'tetra':
        return "nein", 200
    
    # Logik für 'delta'
    elif endpoint == 'delta':
        return "Bad Request", 400
    
    # Standard-Antwort für alles andere
    return "Endpoint nicht definiert", 404

if __name__ == '__main__':
    # Nutzt den Port des Servers oder Standard 8943 für lokal
    port = int(os.environ.get("PORT", 8943))
    # host='0.0.0.0' ist wichtig, damit der Server von außen erreichbar ist
    app.run(host='0.0.0.0', port=port)
