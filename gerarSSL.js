const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(__dirname, "ssl");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const keyPath = path.join(outputDir, "key.pem");
const certPath = path.join(outputDir, "cert.pem");

const command = `openssl req -x509 -newkey rsa:2048 -nodes -keyout "${keyPath}" -out "${certPath}" -days 365 -subj "/C=BR/ST=SP/L=SaoPaulo/O=DevGame/CN=localhost"`;

console.log("🔐 Gerando certificado SSL...");
exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Erro ao gerar o certificado:", err.message);
    return;
  }

  console.log("✅ Certificado gerado com sucesso!");
  console.log(`📁 Arquivos criados em: ${outputDir}`);
});
