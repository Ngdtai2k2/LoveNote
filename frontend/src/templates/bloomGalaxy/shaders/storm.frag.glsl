uniform float time;
uniform sampler2D baseTexture;
varying vec2 vUv;
void main() {
    vec2 uv = vUv;
    float angle = length(uv - vec2(0.5)) * 3.0;
    float twist = sin(angle * 3.0 + time) * 0.1;
    uv.x += twist * sin(time * 0.5);
    uv.y += twist * cos(time * 0.5);
    vec4 texColor = texture2D(baseTexture, uv);
    float noise = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time) * 0.1;
    texColor.rgb += noise * vec3(0.8, 0.4, 0.2);
    gl_FragColor = texColor;
}