"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./ambientLightShader";

const MOUSE_LERP = 0.04;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function AmbientLightCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uMouse: { value: mouse },
      },
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    const setPointer = (x: number, y: number) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = ((x - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = -((y - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    };

    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      mouse.x = lerp(mouse.x, targetMouse.x, MOUSE_LERP);
      mouse.y = lerp(mouse.y, targetMouse.y, MOUSE_LERP);
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uMouse.value.copy(mouse);
      renderer.render(scene, camera);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      material.dispose();
      renderer.dispose();
      container.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0" aria-hidden />
  );
}
