#ifdef USE_INSTANCING_SECTOR_INDIRECT
  uniform ivec3 trackedSectorLow;
  uniform ivec3 trackedSectorHigh;
  uniform vec3 worldOffset;

  vec3 getSectorOffset() {
    int size = textureSize( matricesTexture, 0 ).x;
    int j = int( instanceIndex ) * 6;
    int x = j % size;
    int y = j / size;
    ivec3 sectorLow = floatBitsToInt( texelFetch( matricesTexture, ivec2( x + 4, y ), 0 ).rgb );
    vec3 sectorDelta = vec3( sectorLow - trackedSectorLow );
    return ( sectorDelta * 128.0 ) - worldOffset;
  }
#endif
