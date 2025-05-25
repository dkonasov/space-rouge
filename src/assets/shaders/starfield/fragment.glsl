varying vec2 vUv;
uniform float u_time;

float random(in vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 random22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = smoothstep(0.,1.,f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 8
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

vec3 generateBackground(vec2 st) {
    float baseBrightness = 1.5;
    float ambientBrightness = 0.02;
    vec3 baseColor = vec3(0.0, 0.0546875, 0.09375) * baseBrightness;
    float magnitude = (1.0 - fbm(st / 400.0));

    return mix(vec3(ambientBrightness), baseColor, magnitude);
}

vec2 generateStars(vec2 st) {
    float density = 16.0;
    float maxRadius = 1.0;
    float alpha = 1.0;
    vec2 intPart = floor(st / density) * density;
    float radius = maxRadius * random(intPart + vec2(0.4, 0.1));
    float maxBrightness = random(intPart + vec2(4.1, 3.3));
    float haloSize = radius * (1.5 + maxBrightness);
    vec2 fractPart = mod(st, density);
    float brightness = 0.0;
    float color = 0.0;

    vec2 center = intPart + vec2(haloSize) + random22(intPart) * (density - haloSize * 2.0);

    float currentDistance = distance(center, st);

    if (currentDistance < radius) {
        color = maxBrightness;
    } else if(currentDistance < haloSize) {
        color = maxBrightness;
        alpha = 0.05;
    } else { color = 0.0; alpha = 0.0; }

    return vec2(color, alpha);
}

void main() {
    float scaleFactor = 12500.0;
    float speed = 65.0;

    vec2 pos = vec2(vUv * scaleFactor);
    pos.y += (u_time / 1000.0) * speed;

    vec2 brigtnessAndAlpha = generateStars(pos);
    vec3 bgTexel = generateBackground(pos);
    vec3 color = mix(bgTexel, vec3(brigtnessAndAlpha.x), brigtnessAndAlpha.y);


    gl_FragColor = vec4(color, 1.0);
}
