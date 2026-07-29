export const fragmentShader = /* glsl */ `
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 41.1451))) * 43758.5453123);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  vec2 mouseOffset = uMouse * 0.22;
  vec2 st = uv - mouseOffset * 0.65;

  float timeSlow = uTime * 0.22;
  float n1 = snoise(st * 1.4 + vec2(timeSlow * 0.35, timeSlow * 0.18));
  float n2 = snoise(st * 2.2 - vec2(timeSlow * 0.28, timeSlow * 0.4) + uMouse * 0.15);
  float n3 = snoise(st * 0.8 + vec2(timeSlow * 0.12));
  float shadowTexture = (n1 * 0.5 + 0.5) * (n2 * 0.4 + 0.6);

  vec3 baseGray = vec3(0.235, 0.232, 0.228);
  vec3 midGray = vec3(0.285, 0.278, 0.268);
  vec3 warm = vec3(0.31, 0.295, 0.275);
  vec3 color = mix(baseGray, midGray, shadowTexture * 0.45 + 0.28);
  color = mix(color, warm, (n3 * 0.5 + 0.5) * 0.12);

  float breathe = sin(uTime * 0.4) * 0.015 + 0.015;
  color += vec3(breathe);

  vec2 normUv = gl_FragCoord.xy / uResolution.xy;
  float vignette = normUv.x * normUv.y * (1.0 - normUv.x) * (1.0 - normUv.y);
  color *= clamp(pow(16.0 * vignette, 0.42), 0.58, 1.0);
  color += vec3((rand(gl_FragCoord.xy + uTime) - 0.5) * 0.07);

  gl_FragColor = vec4(color, 1.0);
}
`;

export const vertexShader = /* glsl */ `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;
