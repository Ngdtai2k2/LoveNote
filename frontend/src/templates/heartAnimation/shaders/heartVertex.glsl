#define M_PI 3.1415926535897932384626433832795
uniform float uTime;
uniform float uSize;
attribute float aScale;
attribute vec3 aColor;
attribute float random;
attribute float random1;
attribute float aSpeed;
varying vec3 vColor;
varying vec2 vUv;

void main() {
  float sign = 2.0 * (step(random, 0.5) - 0.5);
  float t = sign * mod(-uTime * aSpeed * 0.005 + 10.0 * aSpeed * aSpeed, M_PI);
  float a = pow(t, 2.0) * pow((t - sign * M_PI), 2.0);
  float radius = 0.08;
  vec3 myOffset = vec3(
    radius * 16.0 * pow(sin(t), 2.0) * sin(t),
    radius * (13.0 * cos(t) - 5.0 * cos(2.0 * t) - 2.0 * cos(3.0 * t) - cos(4.0 * t)),
    0.15 * (a * (random1 - 0.5)) * sin(abs(10.0 * (sin(0.2 * uTime + 0.2 * random))) * t)
  );
  vec4 modelPosition = modelMatrix * vec4(myOffset, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  viewPosition.xyz += position * aScale * uSize * pow(a, 0.5) * 0.5;
  gl_Position = projectionMatrix * viewPosition;

  vColor = aColor;
  vUv = uv;
}
