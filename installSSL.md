🛠️ Guia: Gerar e Usar SSL com Node.js no Windows
✅ Requisitos
PowerShell (pré-instalado no Windows)

Node.js (instalado)

Chocolatey (para instalar OpenSSL)

🔹 1. Instalar o Chocolatey (se ainda não tiver)
Abra o PowerShell como Administrador e cole o comando abaixo:

powershell
Copiar
Editar
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
Depois que o processo terminar, feche e reabra o PowerShell.

🔹 2. Instalar o OpenSSL
Com o Chocolatey instalado, execute:

powershell
Copiar
Editar
choco install openssl -y
Verifique a instalação:
powershell
Copiar
Editar
openssl version
Se aparecer algo como OpenSSL 3.x.x, está tudo certo.

🔹 3. Gerar certificados .pem com OpenSSL
No terminal, vá até o diretório do seu projeto:

powershell
Copiar
Editar
cd "C:\Users\Marku\OneDrive\Área de Trabalho\dev\gameShot"
Gere o certificado e a chave com o comando abaixo:

bash
Copiar
Editar
openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365
Você verá prompts como:

pgsql
Copiar
Editar
Country Name (2 letter code) [AU]: BR
State or Province Name (full name) [Some-State]: SP
Locality Name (eg, city) []: SaoPaulo
Organization Name (eg, company) []: GameShot
Common Name (e.g. server FQDN or YOUR name) []: localhost




### mkcert
1. Instalar o Chocolatey (se não tiver)
Chocolatey é um gerenciador de pacotes para Windows, facilita instalar programas.

Abra o PowerShell como administrador e execute:

powershell
Copiar
Editar
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = `
[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
Depois, feche e abra um novo terminal para o Chocolatey funcionar.

2. Instalar o mkcert
No terminal (PowerShell) admin, rode:

powershell
Copiar
Editar
choco install mkcert
Espere instalar.

3. Instalar o CA local do mkcert
No terminal, execute:

powershell
Copiar
Editar
mkcert -install
Isso cria e instala uma autoridade certificadora local confiável no seu Windows, para o navegador confiar nos certificados gerados por ele.

4. Gerar certificados para seu IP local
Rode:

powershell
Copiar
Editar
mkcert 192.168.1.108 localhost 127.0.0.1
Troque o IP pelo IP do seu servidor (que você usa no WebSocket).

Esse comando gera dois arquivos na pasta atual, por exemplo:

192.168.1.108+2.pem (certificado)

192.168.1.108+2-key.pem (chave privada)

O +2 aparece porque tem 3 nomes: IP + localhost + 127.0.0.1