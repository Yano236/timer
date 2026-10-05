console.clear();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setClearColor(0xff5555);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 竖屏（手机）时把相机往后拉，保证爱心左右完整显示（爱心半宽约 0.48，两边各留一点余量）
function fitCamera() {
  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
  const distance = Math.max(1, 0.62 / (Math.tan(halfFov) * camera.aspect));
  camera.position.setLength(distance);
}
camera.position.z = 1;
fitCamera();

const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.maxDistance = 3;
controls.minDistance = 0.7;

const group = new THREE.Group();
scene.add(group);

let heart = null;
let sampler = null;
let originHeart = null;
// 本地生成立体爱心（原先从 codepen 加载 OBJ，被跨域拦截导致心脏不显示）
// 标准三维爱心隐函数（Taubin heart）：x 宽、y 高、z 厚度，F < 0 为内部；底部天然收成一个尖点
function heartField(x, y, z) {
  const a = x * x + 2.25 * z * z + y * y - 1;
  return a * a * a - x * x * y * y * y - 0.1125 * z * z * y * y * y;
}

const TIP_BOTTOM = -1; // 方程的最低点（正下方射线与曲面的交点）
const TIP_START = 0; // 从这个高度开始往下收尖

// 从中心向各方向发射射线，取第一次穿出曲面的位置作为网格顶点
function createHeartGeometry(uSegments = 128, vSegments = 96) {
  const vertices = [];
  const indices = [];
  for (let j = 0; j <= vSegments; j++) {
    const phi = (j / vSegments) * Math.PI; // 从正上方到正下方
    for (let i = 0; i <= uSegments; i++) {
      const theta = (i / uSegments) * Math.PI * 2;
      const dx = Math.sin(phi) * Math.cos(theta);
      const dy = Math.cos(phi);
      const dz = Math.sin(phi) * Math.sin(theta);
      let inside = 0;
      let outside = 0.02;
      while (heartField(dx * outside, dy * outside, dz * outside) < 0 && outside < 2) {
        inside = outside;
        outside += 0.02;
      }
      for (let k = 0; k < 30; k++) {
        const mid = (inside + outside) / 2;
        if (heartField(dx * mid, dy * mid, dz * mid) < 0) inside = mid;
        else outside = mid;
      }
      // 下半部收尖：方程本身的底部是圆钝的（截面半径 ∝ √高度），越靠近底部水平方向收得越多，
      // 让截面半径 ∝ 高度，形成圆锥尖；k 从底部 0 到收尖起点 1，k(2-k) 保证衔接处平滑
      const y = dy * inside;
      const k = Math.min(Math.max((y - TIP_BOTTOM) / (TIP_START - TIP_BOTTOM), 0), 1);
      const taper = Math.sqrt(k * (2 - k));
      vertices.push(dx * inside * taper, y, dz * inside * taper);
    }
  }
  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = j * (uSegments + 1) + i;
      const b = a + uSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  // 居中并缩放到原来的大小（宽约 0.96）
  geometry.center();
  geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new THREE.Vector3());
  const scale = 0.96 / size.x;
  geometry.scale(scale, scale, scale);
  return geometry;
}

heart = new THREE.Mesh(createHeartGeometry(), new THREE.MeshBasicMaterial({
  color: 0xff5555
}));
group.add(heart);
originHeart = Array.from(heart.geometry.attributes.position.array);
sampler = new THREE.MeshSurfaceSampler(new THREE.Mesh(heart.geometry.toNonIndexed())).build();

let positions = [];
const geometry = new THREE.BufferGeometry();
const material = new THREE.LineBasicMaterial({
  color: 0xffffff
});
const lines = new THREE.LineSegments(geometry, material);
group.add(lines);

const simplex = new SimplexNoise();
const pos = new THREE.Vector3();
class Grass {
  constructor () {
    sampler.sample(pos);
    this.pos = pos.clone();
    this.scale = Math.random() * 0.01 + 0.001;
    this.one = null;
    this.two = null;
  }
  update (a) {
    const noise = simplex.noise4D(this.pos.x*1.5, this.pos.y*1.5, this.pos.z*1.5, a * 0.0005) + 1;
    this.one = this.pos.clone().multiplyScalar(1.01 + (noise * 0.15 * beat.a));
    this.two = this.one.clone().add(this.one.clone().setLength(this.scale));
  }
}

let spikes = [];
function init (a) {
  positions = [];
  for (let i = 0; i < 20000; i++) {
    const g = new Grass();
    spikes.push(g);
  }
}

const beat = { a: 0 };
gsap.timeline({
  repeat: -1,
  repeatDelay: 0.3
}).to(beat, {
  a: 1.2,
  duration: 0.6,
  ease: 'power2.in'
}).to(beat, {
  a: 0.0,
  duration: 0.6,
  ease: 'power3.out'
});
gsap.to(group.rotation, {
  y: Math.PI * 2,
  duration: 12,
  ease: 'none',
  repeat: -1
});

function render(a) {
  positions = [];
  spikes.forEach(g => {
    g.update(a);
    positions.push(g.one.x, g.one.y, g.one.z);
    positions.push(g.two.x, g.two.y, g.two.z);
  });
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  
  const vs = heart.geometry.attributes.position.array;
  for (let i = 0; i < vs.length; i+=3) {
    const v = new THREE.Vector3(originHeart[i], originHeart[i+1], originHeart[i+2]);
    const noise = simplex.noise4D(originHeart[i]*1.5, originHeart[i+1]*1.5, originHeart[i+2]*1.5, a * 0.0005) + 1;
    v.multiplyScalar(1 + (noise * 0.15 * beat.a));
    vs[i] = v.x;
    vs[i+1] = v.y;
    vs[i+2] = v.z;
  }
  heart.geometry.attributes.position.needsUpdate = true;
  
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  fitCamera();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 依赖上面的 Grass / beat / render，放在文件末尾启动
init();
renderer.setAnimationLoop(render);
