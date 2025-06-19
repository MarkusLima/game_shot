let mira, raycaster, alvos = [], cena, camera, renderer;

function init() {
  cena = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Luz ambiente
  const luz = new THREE.AmbientLight(0xffffff);
  cena.add(luz);

  // Chão
  const planoGeo = new THREE.PlaneGeometry(100, 100);
  const planoMat = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
  const plano = new THREE.Mesh(planoGeo, planoMat);
  plano.rotation.x = Math.PI / 2;
  cena.add(plano);

  // Mira
  const miraGeo = new THREE.RingGeometry(0.1, 0.2, 32);
  const miraMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
  mira = new THREE.Mesh(miraGeo, miraMat);
  mira.position.z = -2;
  camera.add(mira);
  cena.add(camera);

  // Alvos
  for (let i = 0; i < 3; i++) {
    const alvoGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const alvoMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const alvo = new THREE.Mesh(alvoGeo, alvoMat);
    alvo.position.set((i - 1) * 3, 1, -5);
    cena.add(alvo);
    alvos.push(alvo);
  }

  raycaster = new THREE.Raycaster();
  camera.position.set(0, 1.5, 0);
}

function animar() {
  requestAnimationFrame(animar);
  renderer.render(cena, camera);
}

function conectarWebSocket() {
  const socket = new WebSocket('wss://192.168.1.108:3000');

  socket.onopen = () => {
    console.log("✅ Conectado ao WebSocket");
  };

  socket.onmessage = (event) => {
    let dados;
    try {
      dados = JSON.parse(event.data);
    } catch {
      console.warn("Mensagem não JSON:", event.data);
      return;
    }

    if (typeof dados.x === 'number' && typeof dados.y === 'number') {
      const offsetX = THREE.MathUtils.clamp(dados.x / 20, -1, 1);
      const offsetY = THREE.MathUtils.clamp(dados.y / 20, -1, 1);
      mira.position.x = offsetX;
      mira.position.y = offsetY;

      document.getElementById('status').textContent = `x: ${offsetX.toFixed(2)}, y: ${offsetY.toFixed(2)}`;
    }
  };

  socket.onerror = (e) => console.error("❌ WebSocket error", e);
}

function configurarTiro() {
  window.addEventListener('click', () => {
    raycaster.setFromCamera(new THREE.Vector2(mira.position.x, mira.position.y), camera);
    const intersec = raycaster.intersectObjects(alvos);
    if (intersec.length > 0) {
      const alvo = intersec[0].object;
      cena.remove(alvo);
      alvos = alvos.filter(a => a !== alvo);
    }
  });
}

init();
animar();
conectarWebSocket();
configurarTiro();