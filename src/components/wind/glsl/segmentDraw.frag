uniform sampler2D colorTable;

varying float speedNormalization;

void main() {
    gl_FragColor = texture2D(colorTable, vec2(speedNormalization, 0.0));
    //gl_FragColor = vec4(0.9,0.9,0.9,0.5);
}