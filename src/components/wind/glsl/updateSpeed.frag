uniform sampler2D currentParticlesSpeed; // (u, v, w, normalization)
uniform sampler2D particlesWind;

// use to calculate the relative speed
uniform vec2 uSpeedRange; // (min, max);
uniform vec2 vSpeedRange;
uniform float pixelSize;
uniform float speedFactor;

varying vec2 v_textureCoordinates;

vec4 calcRelativeSpeed(vec3 speed) {
    vec3 percent = vec3(0.0);
    percent.x = (speed.x - uSpeedRange.x) / (uSpeedRange.y - uSpeedRange.x);
    percent.y = (speed.y - vSpeedRange.x) / (vSpeedRange.y - vSpeedRange.x);
	float normalization = length(percent);

    float minRelativeSpeed = -speedFactor * pixelSize;
    float maxRelativeSpeed = speedFactor * pixelSize;

	vec3 relativeSpeed = vec3(0.0);
    relativeSpeed.x = mix(minRelativeSpeed, maxRelativeSpeed, percent.x);
    relativeSpeed.y = mix(minRelativeSpeed, maxRelativeSpeed, percent.y);
	
	return vec4(relativeSpeed, normalization);
}
vec4 calcRelativeSpeedNew(vec3 speed) {
    vec3 percent = vec3(0.0);
    percent.x = (speed.x - uSpeedRange.x) / (uSpeedRange.y - uSpeedRange.x);
    percent.y = (speed.y - vSpeedRange.x) / (vSpeedRange.y - vSpeedRange.x);
	float normalization = length(percent);

    float m = max(max(abs(uSpeedRange.x),abs(uSpeedRange.y)),max(abs(vSpeedRange.x),abs(vSpeedRange.y)));

	vec3 relativeSpeed = vec3(0.0);
    relativeSpeed.x = speed.x / m * speedFactor *pixelSize;
    relativeSpeed.y = speed.y / m * speedFactor *pixelSize;
	
	return vec4(relativeSpeed, normalization);
}
void main() {
    // texture coordinate must be normalized
    vec3 currentSpeed = texture2D(currentParticlesSpeed, v_textureCoordinates).rgb;
	vec3 windVector = texture2D(particlesWind, v_textureCoordinates).rgb;
	
	vec4 nextSpeed = calcRelativeSpeedNew(windVector);//calcRelativeSpeed(windVector);
	gl_FragColor = nextSpeed;
}