uniform vec3 positions[36];
varying vec3 vPosition;
varying vec3 vNormal;
uniform float scale;
uniform vec3 cubePosition;
uniform vec3 points[62];
uniform float u_time;
uniform float animationCompletion;

vec4 getColor(vec3 pos, float animationCompletion) {
    float radius = 0.004;
    float pointsDistance = length(points[0]);
    float maxDistance = pointsDistance + radius;
    float minDistance = pointsDistance - radius;

    float currentDistance = length(pos);

    if (currentDistance > maxDistance || currentDistance < minDistance) {
        return vec4(0.);
    }


    for (int i = 0; i < 62; i++) {
        float distanceToCenter = distance(pos, points[i]);
        if (distanceToCenter < radius) {
            return vec4(.6, .6, .6, 1.);
        }
    }

    return vec4(0.);
}

bool isPointInsideTriangle(vec3 a, vec3 b, vec3 c, vec3 point) {
    vec3 normal = normalize(cross(b - a, c - a));
    float d1 = dot(normal, cross(b - a, point - a));
    float d2 = dot(normal, cross(c - b, point - b));
    float d3 = dot(normal, cross(a - c, point - c));
    return d1 >= 0. && d2 >= 0. && d3 >= 0.;
}

float[2] getRaySphereIntersection(vec3 direction) {
    float[2] result = float[2](-1., -1.);
    float radius = .5;
    vec3 l = cameraPosition;

    float tca = dot(l, direction);

    float d2 = length(l) * length(l) - tca * tca;

    if (d2 > radius * radius) return result;
    float thc = sqrt(radius * radius - d2);

    result[0] = abs(tca) - thc;
    result[1] = abs(tca) + thc;
    
    return result;
}

void main(){
    // if (u_time < duration) {
    //     animationCompletion = u_time / duration;
    // }

    // Possibly, we don't need translation shift for pseudo 2d
    vec3 direction = normalize((vPosition / scale) + cubePosition - cameraPosition);
    vec3 scaledPosition = (vPosition) / scale;
    vec3 outPoint;
    /**
    * Searching out point
    */
    for (int i = 2; i < 36; i+=3) {
        vec3 a = (positions[i-2]) / scale;
        vec3 b = (positions[i-1]) / scale;
        vec3 c = (positions[i]) / scale;

        vec3 normal = normalize(cross(b - a, c - a));
        /**
        * Skip current face
        * Positions uniform values has reversed normals, so same plane normal will have opposite direction
        */
        if (dot(normal, vNormal) < -.5) {
            continue;
        }

        float absoluteDistanceToPlane = 0. - dot(normal, a);
        float distanceToPlane = 0. - (dot(normal, scaledPosition) + absoluteDistanceToPlane) / dot(normal, direction);
        vec3 intersectionPoint = scaledPosition + direction * distanceToPlane;

        if (isPointInsideTriangle(a, b, c, intersectionPoint)) {
            outPoint = intersectionPoint;
            break;
        }
    }

    float[2] inters = getRaySphereIntersection(direction);

    if (inters[0] < 0.) {
        gl_FragColor = vec4(0.);
        return;
    }

    vec3 start = cameraPosition + direction * inters[0];
    vec3 end = cameraPosition + direction * inters[1];

    float rayLength = distance(start, end);

    int steps = 80;
    float stepLength = rayLength / float(steps);
    float accumulatedDistance = stepLength;
    gl_FragColor = getColor(start, animationCompletion);
    float accumulatedAlpha = gl_FragColor.a;

    for(int i = 0; i < steps; i++) {
        vec3 pos = start + direction * accumulatedDistance;
        vec4 color = getColor(pos, animationCompletion);
        gl_FragColor.rgb = mix(color.rgb, gl_FragColor.rgb, gl_FragColor.a);
        accumulatedAlpha += color.a;

        if (accumulatedAlpha >= 1.) {
            gl_FragColor.a = 1.;
            break;
        }

        gl_FragColor.a = accumulatedAlpha;
        accumulatedDistance += stepLength;
    }
}