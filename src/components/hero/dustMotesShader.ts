export const dustFragmentShader = /* glsl */ `
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 41.1451))) * 43758.5453123);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  vec2 mouse = uMouse * vec2(0.28, 0.22);
  float t = uTime * 0.35;

  float dust = 0.0;

  for (float i = 0.0; i < 36.0; i += 1.0) {
    vec2 seed = vec2(i * 17.3, i * 9.7);
    vec2 base = vec2(
      rand(seed) * 2.2 - 1.1,
      rand(seed + 1.7) * 1.8 - 0.9
    );
    vec2 drift = vec2(
      sin(t * (0.3 + rand(seed + 2.0) * 0.4) + i),
      cos(t * (0.25 + rand(seed + 3.0) * 0.35) + i * 0.7)
    ) * 0.08;
    vec2 pos = base + drift + mouse * (0.04 + rand(seed + 4.0) * 0.06);

    float size = 0.002 + rand(seed + 5.0) * 0.004;
    float d = length(uv - pos);
    float mote = smoothstep(size, size * 0.2, d);
    float twinkle = 0.55 + 0.45 * sin(t * 2.5 + i * 1.3);
    dust += mote * twinkle * (0.15 + rand(seed + 6.0) * 0.25);
  }

  vec3 color = vec3(0.97, 0.95, 0.91);
  gl_FragColor = vec4(color, dust * 0.55);
}
`;

export const dustVertexShader = /* glsl */ `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;
