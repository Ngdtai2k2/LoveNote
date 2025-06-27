#define M_PI 3.1415926535897932384626433832795
uniform float uTime;
uniform float uSize;
attribute float aScale;
attribute vec3 aColor;
attribute float phi;
attribute float random;
attribute float random1;
varying vec3 vColor;
varying vec2 vUv;

void main() {
  float t = 0.01 * uTime + 12.0;
  float angle = phi;
  t = mod((-uTime + 100.0) * 0.06 * random1 + random * 2.0 * M_PI, 2.0 * M_PI);
  vec3 myOffset = vec3(
    5.85 * cos(angle * t),
    2.0 * (t - M_PI),
    3.0 * sin(angle * t / t)
  );
  vec4 modelPosition = modelMatrix * vec4(myOffset, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  viewPosition.xyz += position * aScale * uSize;
  gl_Position = projectionMatrix * viewPosition;

  vColor = aColor;
  vUv = uv;
}
