
function buildRenderer () {
  const renderer = new THREE.WebGLRenderer({ antialias: true })

  renderer.setPixelRatio(window.devicePixelRatio || 1)
  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.setClearColor(0xAAAAAA, 1)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.soft = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  return renderer
}

function buildCamera () {
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 1000)
  camera.position.z = 200
  camera.position.x = 20
  camera.position.y = 20
  return camera
}

function buildGround () {
  var geometry = new THREE.PlaneGeometry(1000, 1000, 32 )
  var material = new THREE.MeshLambertMaterial({ color: 0xff6666 })

  var ground = new THREE.Mesh(geometry, material)
  ground.receiveShadow = true
  ground.rotateX(Math.PI * 3/2)

  return ground
}

function buildBall (radius) {
  var sphereGeo = new THREE.SphereGeometry(radius, 32, 32)
  var material = new THREE.MeshLambertMaterial({ color: 0x6666ff })
  var ball = new THREE.Mesh(sphereGeo, material)

  ball.position.y += radius * 2
  ball.castShadow = true

  return ball
}

function main () {
  var clock = new THREE.Clock()
  var renderer = buildRenderer()
  var camera = buildCamera()

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onWindowResize, false)

  var scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xAAAAAA, 300, 500)

  var ground = buildGround()
  scene.add(ground)

  var cameraControls = new THREE.OrbitControls(camera, renderer.domElement)

  var ballRadius = 10
  var ball = buildBall(ballRadius)
  scene.add(ball)

  var velocityY = 30
  var gravity = 60

  function updateBall (delta) {
    if (ball.position.y > ballRadius) {
      velocityY -= delta * gravity
    } else if (velocityY < 0) {
      velocityY *= -1
    }
    ball.position.y += delta * velocityY
  }

  var light = new THREE.DirectionalLight(0xFFFFFF, 1.5)
  light.position.set(30, 30, 30)
  light.castShadow = true
  scene.add(light)

  scene.add(new THREE.AmbientLight(0x222222))

  var container = document.getElementById('main')
  container.appendChild(renderer.domElement)

  function renderLoop () {
    requestAnimationFrame(renderLoop)
    var delta = clock.getDelta() % 0.03
    updateBall(delta)

    renderer.render(scene, camera)
  }
  renderLoop()
}

main()
