const text = `
// the size of UV textures: width = lon, height = lat*lev
uniform sampler2D U; // eastward wind 
uniform sampler2D V; // northward wind
uniform sampler2D LON; 
uniform sampler2D LAT; 

uniform sampler2D currentParticlesPosition; // (lon, lat, lev)

uniform vec3 dimension; // (lon, lat, lev)
uniform vec3 minimum; // minimum of each dimension
uniform vec3 maximum; // maximum of each dimension
uniform vec3 interval; // interval of each dimension

varying vec2 v_textureCoordinates;

vec2 mapPositionToNormalizedIndex2D(vec3 lonLatLev) {
    // ensure the range of longitude and latitude
    //lonLatLev.x = mod(lonLatLev.x, 360.0);
	lonLatLev.x = mod(lonLatLev.x + 180.0, 360.0) - 180.0; // -180.0 -> 180.0
    lonLatLev.y = clamp(lonLatLev.y, -90.0, 90.0);

    vec3 index3D = vec3(0.0);
    index3D.x = (lonLatLev.x - minimum.x) / interval.x;
    index3D.y = (lonLatLev.y - minimum.y) / interval.y;
    index3D.z = (lonLatLev.z - minimum.z) / interval.z;

    // the st texture coordinate corresponding to (col, row) index
    // example
    // data array is [0, 1, 2, 3, 4, 5], width = 3, height = 2
    // the content of texture will be
    // t 1.0
    //    |  3 4 5
    //    |
    //    |  0 1 2
    //   0.0------1.0 s

    vec2 index2D = vec2(index3D.x, index3D.z * dimension.y + index3D.y);
    vec2 normalizedIndex2D = vec2(index2D.x / dimension.x, index2D.y / (dimension.y * dimension.z));
    return normalizedIndex2D;
}

float getWind(sampler2D windTexture, vec3 lonLatLev) {
    vec2 normalizedIndex2D = mapPositionToNormalizedIndex2D(lonLatLev);
    float result = texture2D(windTexture, normalizedIndex2D).r;
    return result;
}

const mat4 kernelMatrix = mat4(
    0.0, -1.0, 2.0, -1.0, // first column
    2.0, 0.0, -5.0, 3.0, // second column
    0.0, 1.0, 4.0, -3.0, // third column
    0.0, 0.0, -1.0, 1.0 // fourth column
);
float oneDimensionInterpolation(float t, float p0, float p1, float p2, float p3) {
    vec4 tVec4 = vec4(1.0, t, t * t, t * t * t);
    tVec4 = tVec4 / 2.0;
    vec4 pVec4 = vec4(p0, p1, p2, p3);
    return dot((tVec4 * kernelMatrix), pVec4);
}

float calculateB(sampler2D windTexture, float t, float lon, float lat, float lev) {
    float lon0 = floor(lon) - 1.0 * interval.x;
    float lon1 = floor(lon);
    float lon2 = floor(lon) + 1.0 * interval.x;
    float lon3 = floor(lon) + 2.0 * interval.x;

    float p0 = getWind(windTexture, vec3(lon0, lat, lev));
    float p1 = getWind(windTexture, vec3(lon1, lat, lev));
    float p2 = getWind(windTexture, vec3(lon2, lat, lev));
    float p3 = getWind(windTexture, vec3(lon3, lat, lev));

    return oneDimensionInterpolation(t, p0, p1, p2, p3);
}

float interpolateOneTexture0(sampler2D windTexture, vec3 lonLatLev) {
    float lon = lonLatLev.x;
    float lat = lonLatLev.y;
    float lev = lonLatLev.z;

    float lat0 = floor(lat) - 1.0 * interval.y;
    float lat1 = floor(lat);
    float lat2 = floor(lat) + 1.0 * interval.y;
    float lat3 = floor(lat) + 2.0 * interval.y;

    vec2 coef = lonLatLev.xy - floor(lonLatLev.xy);
    float b0 = calculateB(windTexture, coef.x, lon, lat0, lev);
    float b1 = calculateB(windTexture, coef.x, lon, lat1, lev);
    float b2 = calculateB(windTexture, coef.x, lon, lat2, lev);
    float b3 = calculateB(windTexture, coef.x, lon, lat3, lev);

    return oneDimensionInterpolation(coef.y, b0, b1, b2, b3);
}

float getWindOfIndex(sampler2D windTexture, vec3 index3D) {
    vec2 index2D = vec2(index3D.x, index3D.z * dimension.y + index3D.y);
    vec2 normalizedIndex2D = vec2(index2D.x / dimension.x, index2D.y / (dimension.y * dimension.z));

    float result = texture2D(windTexture, normalizedIndex2D).r;
    return result;
}
float calculateWindOfIndex(sampler2D windTexture, float t, float x, float y, float z) {
    float x0 = x - 1.0;
    float x1 = x;
    float x2 = x + 1.0 ;
    float x3 = x + 2.0 ;
    if(x0 < 0.0) 
        x0 = 0.0;
    if(x2 > dimension.x - 1.0) 
        x2 = dimension.x - 1.0;
    if(x3 > dimension.x - 1.0) 
        x3 = dimension.x - 1.0;

    float p0 = getWindOfIndex(windTexture, vec3(x0, y, z));
    float p1 = getWindOfIndex(windTexture, vec3(x1, y, z));
    float p2 = getWindOfIndex(windTexture, vec3(x2, y, z));
    float p3 = getWindOfIndex(windTexture, vec3(x3, y, z));

    return oneDimensionInterpolation(t, p0, p1, p2, p3);
}

float interpolateOneTexture(sampler2D windTexture, vec3 lonLatLev) {

    lonLatLev.x = mod(lonLatLev.x + 180.0, 360.0) - 180.0; // -180.0 -> 180.0
    lonLatLev.y = clamp(lonLatLev.y, -90.0, 90.0);

    vec3 index3D = vec3(0.0);
    index3D.x = floor((lonLatLev.x - minimum.x) / interval.x);
    index3D.y = floor((lonLatLev.y - minimum.y) / interval.y);
    index3D.z = floor((lonLatLev.z - minimum.z) / interval.z);

    vec2 index2D = vec2(index3D.x, index3D.z * dimension.y + index3D.y);
    vec2 normalizedIndex2D = vec2(index2D.x / dimension.x, index2D.y / (dimension.y * dimension.z));

    float lon = texture2D(LON, normalizedIndex2D).r;
    float lat = texture2D(LAT, normalizedIndex2D).r;
    vec2 lonLatGrid = vec2(lon,lat);
    vec2 coef = lonLatLev.xy - lonLatGrid;

    float x = index3D.x;
    float y = index3D.y;
    float z = index3D.z;

    float y0 =  y - 1.0;
    float y1 = y;
    float y2 = y + 1.0 ;
    float y3 = y + 2.0 ;
    if(y0 < 0.0) 
        y0 = 0.0;
    if(y2 > dimension.y - 1.0) 
        y2 = dimension.y - 1.0;
    if(y3 > dimension.y - 1.0) 
        y3 = dimension.y - 1.0;

    float b0 = calculateWindOfIndex(windTexture, coef.x, x, y0, z);
    float b1 = calculateWindOfIndex(windTexture, coef.x, x, y1, z);
    float b2 = calculateWindOfIndex(windTexture, coef.x, x, y2, z);
    float b3 = calculateWindOfIndex(windTexture, coef.x, x, y3, z);

    return oneDimensionInterpolation(coef.y, b0, b1, b2, b3);
}
vec3 bicubic(vec3 lonLatLev) {
    // https://en.wikipedia.org/wiki/Bicubic_interpolation#Bicubic_convolution_algorithm
    float u = interpolateOneTexture(U, lonLatLev);
    float v = interpolateOneTexture(V, lonLatLev);
    float w = 0.0;
    return vec3(u, v, w);
}

void main() {
    // texture coordinate must be normalized
    vec3 lonLatLev = texture2D(currentParticlesPosition, v_textureCoordinates).rgb;
    vec3 windVector = bicubic(lonLatLev);
	gl_FragColor = vec4(windVector, 0.0);
}
`
export default text
