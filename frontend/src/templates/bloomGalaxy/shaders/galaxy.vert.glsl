uniform float uSize;
uniform float uTime;
uniform float uRippleTime;
uniform float uRippleSpeed;
uniform float uRippleWidth;

varying vec3 vColor;

void main() {
    vColor = color;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    if (uRippleTime > 0.0) {
        float rippleRadius = (uTime - uRippleTime) * uRippleSpeed;
        float particleDist = length(modelPosition.xyz);

        float strength = 1.0 - smoothstep(rippleRadius - uRippleWidth, rippleRadius + uRippleWidth, particleDist);
        strength *= smoothstep(rippleRadius + uRippleWidth, rippleRadius - uRippleWidth, particleDist);

        if (strength > 0.0) {
            vColor += vec3(strength * 2.0);
        }
    }

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize / -viewPosition.z;
}
