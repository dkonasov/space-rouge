varying vec3 coords;
varying vec2 vUv;

void main()	{
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

	coords = position;
    vUv = uv;

	gl_Position = projectionMatrix * mvPosition;
}