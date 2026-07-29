export const foregroundBokehFragment = /* glsl */ `
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

float softBlob(vec2 uv, vec2 center, float radius, float smoothness) {
  return smoothstep(radius, radius - smoothness, length(uv - center));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  vec2 mouseOffset = uMouse * 0.32;
  vec2 st = uv - mouseOffset * 0.65;

  float timeSlow = uTime * 0.18;
  float grain = snoise(uv * 3.5 + uTime * 0.05) * 0.5 + 0.5;

  // Large soft bokeh patches — mouse-reactive drift
  vec2 pos1 = vec2(sin(timeSlow * 0.7) * 0.45, cos(timeSlow * 0.55) * 0.35) + mouseOffset * 0.44;
  vec2 pos2 = vec2(cos(timeSlow * 0.45) * 0.55, sin(timeSlow * 0.65) * 0.42) + mouseOffset * 0.28;
  vec2 pos3 = vec2(sin(timeSlow * 0.35 + 1.2) * 0.38, cos(timeSlow * 0.8) * 0.28) + mouseOffset * 0.1;
  vec2 pos4 = uMouse * vec2(0.42, 0.37);
  vec2 pos5 = vec2(cos(timeSlow * 0.25 + 3.0) * 0.3 - 0.2, sin(timeSlow * 0.5) * 0.25 + 0.15) + mouseOffset * 0.15;

  float b1 = softBlob(st, pos1, 1.35, 1.15);
  float b2 = softBlob(st, pos2, 1.55, 1.25);
  float b3 = softBlob(st, pos3, 1.05, 0.95);
  float b4 = softBlob(uv, pos4, 0.78, 0.68);
  float b5 = softBlob(st, pos5, 1.2, 1.05);

  float light = b1 * 0.28 + b2 * 0.32 + b3 * 0.22 + b4 * 0.4 + b5 * 0.18;
  light *= 0.65 + grain * 0.35;

  vec3 bokeColor = vec3(0.98, 0.97, 0.94);
  float alpha = light * 0.72;

  gl_FragColor = vec4(bokeColor, alpha);
}
`;

export const foregroundBokehVertex = /* glsl */ `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;
