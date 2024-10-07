import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/Addons.js'; // Cargador de fuentes
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

@Component({
  selector: 'app-three-canvas',
  standalone: true,
  imports: [],
  templateUrl: './three-canvas.component.html',
  styleUrl: './three-canvas.component.css'
})

export class ThreeCanvasComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  controls!: OrbitControls

  textMesh!: THREE.Mesh;

  ngOnInit() {
    this.createScene()
  }


  createTable(){
    // Crear el tablero de la mesa (BoxGeometry)
    const tableTopGeometry = new THREE.BoxGeometry(2, 0.1, 1)  // Ancho 2, Altura 0.1 (delgado), Profundidad 1
    const tableTopMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })  // Color marrón simulando madera
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial)
  
    // Colocamos el tablero en el centro de la habitación y un poco elevado del suelo
    tableTop.position.set(0, 0.55, 0)  // Y = 0.55 para dejar espacio para las patas debajo
    this.scene.add(tableTop);
  
    // Crear las patas de la mesa (CylinderGeometry)
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32)  // Cilindro delgado, altura de 0.5
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  
    // Posiciones de las patas en las esquinas del tablero
    const legPositions = [
      [-0.9, 0.25, -0.45],  // Esquina superior izquierda
      [0.9, 0.25, -0.45],   // Esquina superior derecha
      [-0.9, 0.25, 0.45],   // Esquina inferior izquierda
      [0.9, 0.25, 0.45]     // Esquina inferior derecha
    ];
  
    // Crear y agregar las 4 patas
    legPositions.forEach(position => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(position[0], position[1], position[2]);  // Colocar las patas en las esquinas del tablero
      this.scene.add(leg);
    });
  }
  add3DText() {
    const loader = new FontLoader();
  
    // Cargar la fuente y crear el texto 3D
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('CIANWARE', {
        font: font,
        size: 0.3,       // Tamaño del texto
        height: 0.1,     // Grosor del texto
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      });
  
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })  // Color verde para el texto
      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
  
      // Calcular bounding box para centrar el texto
      textGeometry.computeBoundingBox()  // Asegurarse de calcular la bounding box
  
      if (textGeometry.boundingBox) {
        const boundingBox = textGeometry.boundingBox
        const textWidth = boundingBox.max.x - boundingBox.min.x
        const textHeight = boundingBox.max.y - boundingBox.min.y
    
        // Centrar el texto usando una traslación de geometría
        textGeometry.translate(-textWidth / 2, -textHeight / 2, 0)
      }
  
      //textMesh.rotation.y = Math.PI / 4;  // Rotación inicial
  
      textMesh.position.set(0, 0.85, 0)  // Ajustar la posición para colocarlo sobre la mesa
      this.scene.add(textMesh)
      // Guardar el texto como propiedad para animarlo
      this.textMesh = textMesh
    });
  }
  

  createScene() {
    // Crear la escena
    this.scene = new THREE.Scene()

    // Crear la camara
    this.camera = new THREE.PerspectiveCamera(
      75, // angulo de vision 
      window.innerWidth / window.innerHeight, 
      0.1, //plano cercano
      1000 // plano lejano
    )
    this.camera.position.set(0, 1.6, 3) // Posición de la camara en la habitacion

    // Crear el renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)

    // Controles de la cámara (OrbitControls para mover la vista)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true  // Suaviza el movimiento de la cámara
    this.controls.dampingFactor = 0.05

    // Agregar luces a la habitación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)  // Luz ambiental tenue
    this.scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(0, 3, 0)  // Colocar la luz en el centro del techo
    this.scene.add(pointLight)

    // Crear las paredes, suelo y techo de la habitación
    this.createRoom()
    
    // Crear a mesa
    this.createTable()
    
    //Agregar terxto
    this.add3DText()

    // Agregar un "cuadro" a la pared
    this.addPaintingToWall()
    
    // Animar la escena
    const animate = () => {
      requestAnimationFrame(animate)
      this.controls.update()  // Actualizar los controles
      
      // Rotar el texto si existe
      if (this.textMesh) {
       // this.textMesh.rotation.x += 0.001
        this.textMesh.rotation.y += 0.01
        
      }

    
      this.renderer.render(this.scene, this.camera)  // Renderizar la escena
    }
    
    animate()
  }

  // Función para crear una pared con una geometría de caja (box)
  createWall(width: number, height: number): THREE.Mesh {
    const wallGeometry = new THREE.PlaneGeometry(width, height)
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const wall = new THREE.Mesh(wallGeometry, wallMaterial)
    return wall
  }

  // Función para crear la habitación (paredes, suelo, techo)
  createRoom() {
    // Suelo
    const floorGeometry = new THREE.PlaneGeometry(10, 15)
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2  // Para que sea horizontal
    floor.position.set(0, 0, 0)
    this.scene.add(floor)

    // Pared frontal
    const frontWall = this.createWall(10, 6);
    frontWall.position.set(0, 3, -7.5);  // Colocar la pared frontal en el fondo
    this.scene.add(frontWall);

    // Pared trasera
    const backWall = this.createWall(10, 6);
    backWall.position.set(0, 3, 7.5);  // Pared trasera
    backWall.rotation.y = Math.PI;
    this.scene.add(backWall);

    // Pared lateral izquierda
    const leftWall = this.createWall(15, 6);
    leftWall.position.set(-5, 3, 0);
    leftWall.rotation.y = Math.PI / 2;  // Rotar para hacerla lateral
    this.scene.add(leftWall);

    // Pared lateral derecha
    const rightWall = this.createWall(15, 6);
    rightWall.position.set(5, 3, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.scene.add(rightWall);

    // Techo
    const ceilingGeometry = new THREE.PlaneGeometry(10, 15);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000});
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.set(0, 6, 0);  // Altura del techo
    ceiling.rotation.x = Math.PI / 2;
    this.scene.add(ceiling);
  }

  // Función para agregar un "cuadro" en la pared
  addPaintingToWall() {
    // Cargar una textura para el cuadro
    const loader = new THREE.TextureLoader()
    loader.load('monaLisa.png', (texture) => {
      // Crear geometría para el cuadro
      const paintingGeometry = new THREE.PlaneGeometry(3, 2)  // Tamaño del cuadro
      const paintingMaterial = new THREE.MeshBasicMaterial({ map: texture })  // Aplicar la textura
      const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);

      // Posicionar el cuadro en la pared frontal
      painting.position.set(0, 3.5, -7.4)  // Cerca de la pared frontal
      this.scene.add(painting)
    });
  }
}