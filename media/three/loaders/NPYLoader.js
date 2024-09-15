import { fromArrayBuffer } from 'numpy-parser';

(function() {
    async function parseNpy(buffer) {
        const { data,shape } = fromArrayBuffer(buffer);
        return data;
    }
    class NPYLoader  extends THREE.Loader  {
    load(url, onLoad, onProgress, onError) {
        const scope = this;
        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(url, function (buffer) {
        try {
          const array = parseNpy(buffer);
          onLoad(scope.parse(array));
        } catch (e) {
          if (onError) {
            onError(e);
          } else {
            console.error(e);
          }
          scope.manager.itemError(url);
        }
      }, onProgress, onError);
    }
    parse(array) {
      vertices = new Float32Array(array.length * 3);
      for (let i = 0; i < array.length; i++) {
        vertices[i * 3] = array[i][0];
        vertices[i * 3 + 1] = array[i][1];
        vertices[i * 3 + 2] = array[i][2];
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return geometry;
     }
    }
    THREE.NPYLoader = NPYLoader;
} )();