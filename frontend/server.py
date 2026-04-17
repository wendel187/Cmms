#!/usr/bin/env python3
"""
Servidor HTTP simples para CMMS Frontend
Serve arquivos estáticos na porta 3000 com suporte a CORS
"""

import http.server
import socketserver
import os
from urllib.parse import urlparse
import json

PORT = 3000
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
}

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adicionar headers CORS
        for key, value in CORS_HEADERS.items():
            self.send_header(key, value)
        super().end_headers()

    def log_message(self, format, *args):
        # Log customizado
        print(f"[{self.log_date_time_string()}] {format % args}")

    def do_GET(self):
        # Se for arquivo, serve normalmente
        if '.' in self.path or self.path == '/':
            super().do_GET()
        else:
            # Redirecionar para index.html para SPA
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('index.html', 'rb') as f:
                self.wfile.write(f.read())

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print(f"🚀 Servidor frontend iniciado!")
        print(f"📍 http://localhost:{PORT}")
        print(f"🔗 Backend: http://localhost:8080")
        print(f"⌨️  Pressione Ctrl+C para parar\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✓ Servidor parado")
