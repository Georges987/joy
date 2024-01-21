// forked from flashisobar's "three.js: skybox and cube reflection material demo" https://jsdo.it/flashisobar/8wd2
// forket form codepen

window.onload = function() {
    THREE.ExplodeModifier = function () {
};

THREE.ExplodeModifier.prototype.modify = function ( geometry ) {

	var vertices = [];

	for ( var i = 0, il = geometry.faces.length; i < il; i ++ ) {

		var n = vertices.length;

		var face = geometry.faces[ i ];

		var a = face.a;
		var b = face.b;
		var c = face.c;

		var va = geometry.vertices[ a ];
		var vb = geometry.vertices[ b ];
		var vc = geometry.vertices[ c ];

		vertices.push( va.clone() );
		vertices.push( vb.clone() );
		vertices.push( vc.clone() );

		face.a = n;
		face.b = n + 1;
		face.c = n + 2;

	}

	geometry.vertices = vertices;

};

    THREE.TessellateModifier = function ( maxEdgeLength ) {

	this.maxEdgeLength = maxEdgeLength;

};

THREE.TessellateModifier.prototype.modify = function ( geometry ) {

	var edge;

	var faces = [];
	var faceVertexUvs = [];
	var maxEdgeLengthSquared = this.maxEdgeLength * this.maxEdgeLength;

	for ( var i = 0, il = geometry.faceVertexUvs.length; i < il; i ++ ) {

		faceVertexUvs[ i ] = [];

	}

	for ( var i = 0, il = geometry.faces.length; i < il; i ++ ) {

		var face = geometry.faces[ i ];

		if ( face instanceof THREE.Face3 ) {

			var a = face.a;
			var b = face.b;
			var c = face.c;

			var va = geometry.vertices[ a ];
			var vb = geometry.vertices[ b ];
			var vc = geometry.vertices[ c ];

			var dab = va.distanceToSquared( vb );
			var dbc = vb.distanceToSquared( vc );
			var dac = va.distanceToSquared( vc );

			if ( dab > maxEdgeLengthSquared || dbc > maxEdgeLengthSquared || dac > maxEdgeLengthSquared ) {

				var m = geometry.vertices.length;

				var triA = face.clone();
				var triB = face.clone();

				if ( dab >= dbc && dab >= dac ) {

					var vm = va.clone();
					vm.lerp( vb, 0.5 );

					triA.a = a;
					triA.b = m;
					triA.c = c;

					triB.a = m;
					triB.b = b;
					triB.c = c;

					if ( face.vertexNormals.length === 3 ) {

						var vnm = face.vertexNormals[ 0 ].clone();
						vnm.lerp( face.vertexNormals[ 1 ], 0.5 );

						triA.vertexNormals[ 1 ].copy( vnm );
						triB.vertexNormals[ 0 ].copy( vnm );

					}

					if ( face.vertexColors.length === 3 ) {

						var vcm = face.vertexColors[ 0 ].clone();
						vcm.lerp( face.vertexColors[ 1 ], 0.5 );

						triA.vertexColors[ 1 ].copy( vcm );
						triB.vertexColors[ 0 ].copy( vcm );

					}

					edge = 0;

				} else if ( dbc >= dab && dbc >= dac ) {

					var vm = vb.clone();
					vm.lerp( vc, 0.5 );

					triA.a = a;
					triA.b = b;
					triA.c = m;

					triB.a = m;
					triB.b = c;
					triB.c = a;

					if ( face.vertexNormals.length === 3 ) {

						var vnm = face.vertexNormals[ 1 ].clone();
						vnm.lerp( face.vertexNormals[ 2 ], 0.5 );

						triA.vertexNormals[ 2 ].copy( vnm );

						triB.vertexNormals[ 0 ].copy( vnm );
						triB.vertexNormals[ 1 ].copy( face.vertexNormals[ 2 ] );
						triB.vertexNormals[ 2 ].copy( face.vertexNormals[ 0 ] );

					}

					if ( face.vertexColors.length === 3 ) {

						var vcm = face.vertexColors[ 1 ].clone();
						vcm.lerp( face.vertexColors[ 2 ], 0.5 );

						triA.vertexColors[ 2 ].copy( vcm );

						triB.vertexColors[ 0 ].copy( vcm );
						triB.vertexColors[ 1 ].copy( face.vertexColors[ 2 ] );
						triB.vertexColors[ 2 ].copy( face.vertexColors[ 0 ] );

					}

					edge = 1;

				} else {

					var vm = va.clone();
					vm.lerp( vc, 0.5 );

					triA.a = a;
					triA.b = b;
					triA.c = m;

					triB.a = m;
					triB.b = b;
					triB.c = c;

					if ( face.vertexNormals.length === 3 ) {

						var vnm = face.vertexNormals[ 0 ].clone();
						vnm.lerp( face.vertexNormals[ 2 ], 0.5 );

						triA.vertexNormals[ 2 ].copy( vnm );
						triB.vertexNormals[ 0 ].copy( vnm );

					}

					if ( face.vertexColors.length === 3 ) {

						var vcm = face.vertexColors[ 0 ].clone();
						vcm.lerp( face.vertexColors[ 2 ], 0.5 );

						triA.vertexColors[ 2 ].copy( vcm );
						triB.vertexColors[ 0 ].copy( vcm );

					}

					edge = 2;

				}

				faces.push( triA, triB );
				geometry.vertices.push( vm );

				for ( var j = 0, jl = geometry.faceVertexUvs.length; j < jl; j ++ ) {

					if ( geometry.faceVertexUvs[ j ].length ) {

						var uvs = geometry.faceVertexUvs[ j ][ i ];

						var uvA = uvs[ 0 ];
						var uvB = uvs[ 1 ];
						var uvC = uvs[ 2 ];

						// AB

						if ( edge === 0 ) {

							var uvM = uvA.clone();
							uvM.lerp( uvB, 0.5 );

							var uvsTriA = [ uvA.clone(), uvM.clone(), uvC.clone() ];
							var uvsTriB = [ uvM.clone(), uvB.clone(), uvC.clone() ];

						// BC

						} else if ( edge === 1 ) {

							var uvM = uvB.clone();
							uvM.lerp( uvC, 0.5 );

							var uvsTriA = [ uvA.clone(), uvB.clone(), uvM.clone() ];
							var uvsTriB = [ uvM.clone(), uvC.clone(), uvA.clone() ];

						// AC

						} else {

							var uvM = uvA.clone();
							uvM.lerp( uvC, 0.5 );

							var uvsTriA = [ uvA.clone(), uvB.clone(), uvM.clone() ];
							var uvsTriB = [ uvM.clone(), uvB.clone(), uvC.clone() ];

						}

						faceVertexUvs[ j ].push( uvsTriA, uvsTriB );

					}

				}

			} else {

				faces.push( face );

				for ( var j = 0, jl = geometry.faceVertexUvs.length; j < jl; j ++ ) {

					faceVertexUvs[ j ].push( geometry.faceVertexUvs[ j ][ i ] );

				}

			}

		}

	}

	geometry.faces = faces;
	geometry.faceVertexUvs = faceVertexUvs;

};

        var loader = new THREE.FontLoader();
		loader.load( 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function ( font ) {
            init(font)
		});
function init(font){


    // main
    var container;
    var stats;
    var camera, scene, renderer, light, sunLight;
    var cube;
    var text3d;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth * 0.5;
    var windowHalfY = window.innerHeight * 0.5;

    init();
    render();

    function init() {

        // create a div element to contain the render
        container = document.createElement('div');
        document.body.appendChild(container);

        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
        camera.position.set(0, 100, 500);
        camera.lookAt(scene.position);
        //scene.add(camera);

        // light
        sunLight = new THREE.DirectionalLight(0xffeedd, 1);
        sunLight.position.set(0.3, -1, -1).normalize();
        scene.add(sunLight);
        light = new THREE.PointLight(0xfffffe, 1.5);
        light.position.set(-500, 1000, 500);
        scene.add(light);
        // This light's color gets applied to all the objects in the scene globally. 
        scene.add(new THREE.AmbientLight(0x404040));

        // geometry text
        var myText = "Hello Joy";

        uniforms = {
            time: { type: "f", value: 0.0 }
        };

        var textGeometry = new THREE.TextGeometry(myText, {
            size: 100,
            height: 20,
            curveSegments: 2,
            font: font,
            bevelThickness: 2,
            bevelSize: 1,
            bevelEnabled: true
        });

        textGeometry.center();

        var tessellateModifier = new THREE.TessellateModifier(4);
        for (var i = 0; i < 6; i++) {
            tessellateModifier.modify(textGeometry);
        }

        var explodeModifier = new THREE.ExplodeModifier();
        explodeModifier.modify(textGeometry);

        var numFaces = textGeometry.faces.length;
        var bb = textGeometry.boundingBox;
            var vertices = textGeometry.vertices;
        textGeometry = new THREE.BufferGeometry().fromGeometry( textGeometry );

        
			var colors = new Float32Array( numFaces * 3 * 3 );
			var displacement = new Float32Array( numFaces * 3 * 3 );
			var color = new THREE.Color();
			for ( var f = 0; f < numFaces; f ++ ) {
				var index = 9 * f;
				var h = 0.2 * Math.random();
				var s = 0.5 + 0.5 * Math.random();
				var l = 0.5 + 0.5 * Math.random();
				color.setHSL( h, s, l );
				// var d = 10 * ( 0.5 - Math.random() );
                var x = Math.random() * (bb.max.x - bb.min.x);
                var y = Math.random() * (bb.max.y - bb.min.y) * 4;
                var z = Math.random() * (bb.max.z - bb.min.z) * 10;
				for ( var i = 0; i < 3; i ++ ) {
					colors[ index + ( 3 * i )     ] = color.b;
					colors[ index + ( 3 * i ) + 1 ] = color.g;
					colors[ index + ( 3 * i ) + 2 ] = color.r;
					displacement[ index + ( 3 * i )     ] = x;
					displacement[ index + ( 3 * i ) + 1 ] = y;
					displacement[ index + ( 3 * i ) + 2 ] = z;
				}
			}

			textGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
			textGeometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );

        var shaderMaterial = new THREE.ShaderMaterial( {
				uniforms:       uniforms,
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent
			});
			
			mesh = new THREE.Mesh( textGeometry, shaderMaterial );
			scene.add( mesh );

        //renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // add renderer
        container.appendChild(renderer.domElement);

        // stats
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        container.appendChild(stats.domElement);
        // addEventListener
        document.addEventListener('mousemove', onMouseMove, false);
        // stage resize
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize(e) {

        windowHalfX = window.innerWidth * 0.5;
        windowHalfY = window.innerHeight * 0.5;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(e) {
        mouseX = (e.clientX - windowHalfX) * 1;
        mouseY = (e.clientY - windowHalfY) * 1;
    }

    function render() {
        requestAnimationFrame(render);

        // text3d.rotation.x = mouseY * 0.001;
        // text3d.rotation.y = mouseX * 0.001;

        var time = Date.now() * 0.001;
        var interval = 10;
        
        uniforms.time.value = 1.0 + Math.sin(time * 0.5); //time % interval / interval;

        renderer.render(scene, camera);
        stats.update();
    }
};

};