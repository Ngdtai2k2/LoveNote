uniform sampler2D uTex;
varying vec3 vColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = vColor;
  float strength = distance(uv, vec2(0.5, 0.65));
  strength *= 2.0;
  strength = 1.0 - strength;
  vec3 texture = texture2D(uTex, uv).rgb;
  gl_FragColor = vec4(texture * color * (strength + 0.3), 1.0);
}
