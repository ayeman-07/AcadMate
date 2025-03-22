 "use client";

 import { useEffect, useRef } from "react";
 import gsap from "gsap";

 export default function GlassBackground() {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
     if (!containerRef.current) return;

     const container = containerRef.current;
     const glassElements = container.querySelectorAll(".glass-element");

     // Create a timeline for the glass animation
     const tl = gsap.timeline({
       repeat: -1,
       defaults: { ease: "power2.inOut" },
     });

     glassElements.forEach((element, index) => {
       tl.to(
         element,
         {
           duration: 3 + Math.random() * 2,
           x: (Math.random() - 0.5) * 100,
           y: (Math.random() - 0.5) * 100,
           rotation: (Math.random() - 0.5) * 30,
           scale: 1 + Math.random() * 0.2,
           opacity: 0.3 + Math.random() * 0.2,
           ease: "power2.inOut",
         },
         index * 0.5
       );
     });

     return () => {
       tl.kill();
     };
   }, []);

   return (
     <div
       ref={containerRef}
       className="fixed inset-0 -z-10 overflow-hidden bg-black"
     >
       {/* Glass elements */}
       <div className="glass-element absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
       <div className="glass-element absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
       <div className="glass-element absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
       <div className="glass-element absolute bottom-1/3 right-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

       {/* Gradient overlay */}
       <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black" />
     </div>
   );
 }