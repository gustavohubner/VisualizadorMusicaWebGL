var gl

var camPos = 30;
var resetPos = -95;
var value = 0.6;
var speed = 0.005;

objectList = []
meshList = []

var index = 2


var fpsElem = document.getElementById("fps");
// initAnaliser()

async function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */

  initAnaliser()

  const canvas = document.querySelector("#canvas");
  canvas.addEventListener('click', function() {
    console.log("click")
    audio.paused ? audio.play() : audio.pause();

   }, false);
  gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // compiles and links the shaders, looks up attribute and uniform locations
  const meshProgramInfo = webglUtils.createProgramInfo(gl, [vs, fs]);

  await initMeshes()
  console.log("ok!")

  obj = new Object3D(meshList[meshList.length - 1], [0, 0, 0], 1,)
  objectList.push(obj)

  for (var i = 0; i < 5; i++) {
    obj2 = new Object3D(meshList[6], [4, 0, -20 * i], 1, true, true)
    objectList.push(obj2)
    obj2 = new Object3D(meshList[6], [-4, 0, -20 * i -10], 1, true,)
    objectList.push(obj2)
  }

  for (var i = 0; i < 20; i++) {
    obj2 = new Object3D(meshList[parseInt(Math.random() * 6)], [8, 0, -5 * i], 1, true, true)
    objectList.push(obj2)
    obj2 = new Object3D(meshList[parseInt(Math.random() * 6)], [-8, 0, -5 * i -5], 1, true,)
    objectList.push(obj2)

  }

  for (var i = 0; i < 20; i++) {
    obj2 = new Object3D(meshList[parseInt(Math.random() * 6)], [12, 0, -5 * i], 2, true, true)
    objectList.push(obj2)
    obj2 = new Object3D(meshList[parseInt(Math.random() * 6)], [-12, 0, -5 * i -5], 2, true,)
    objectList.push(obj2)

  }


  const cameraTarget = [0, 0, -10000];
  var cameraPosition = [0, 2, camPos++ % 30]
  const zNear = 1;
  const zFar = 1000;


  let then = 0;
  function render(time) {
    updateAudioData()
    now = time * 0.001;                          // convert to seconds
    const deltaTime = now - then;          // compute time since last frame
    then = now;                            // remember time for next frame
    const fps = 1 / deltaTime;             // compute frames per second
    fpsElem.textContent = fps.toFixed(1);  // update fps display

    time *= speed;

    cameraPosition = [0, 2, -(time) % (value)];
    flag = cameraPosition[2] > camPos
    camPos = -(time) % (value);
    // console.log(camPos)

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);

    const fieldOfViewRadians = degToRad(90);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    const up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    const camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // Make a view matrix from the camera matrix.
    const view = m4.inverse(camera);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([0, 1, 1]),
      u_view: view,
      u_projection: projection,
      u_viewWorldPosition: cameraPosition,
    };

    gl.useProgram(meshProgramInfo.program);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // calls gl.uniform
    webglUtils.setUniforms(meshProgramInfo, sharedUniforms);

    objectList.forEach(obj => {
      if (obj.moving) {
        if (flag) obj.transforms.translateZ += value
        if (obj.transforms.translateZ > 5) obj.transforms.translateZ = resetPos
        obj.transforms.scaleY = 1 - dataArray[index] / 512
      }

      u_world = computeMatrix(obj);
      for (const { bufferInfo, material } of obj.mesh.parts) {
        webglUtils.setBuffersAndAttributes(gl, meshProgramInfo, bufferInfo);
        webglUtils.setUniforms(meshProgramInfo, {
          u_world,
        }, material);

        webglUtils.drawBufferInfo(gl, bufferInfo);
      }
    });

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}



main();
