import * as React from 'react';

export const Chest = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M30,30 Q50,20 70,30 L70,50 Q50,60 30,50 Z M30,55 Q50,45 70,55 L70,75 Q50,85 30,75 Z" fill="currentColor" /></svg>
);
export const Back = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M30,20 L70,20 L70,80 L55,90 L45,90 L30,80 Z" fill="currentColor" /></svg>
);
export const Shoulders = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M20,40 Q50,20 80,40 L90,50 L70,60 L30,60 L10,50 Z" fill="currentColor" /></svg>
);
export const Biceps = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M40,30 C20,50 40,90 40,90 L60,90 C60,90 80,50 60,30 A20,20 0 0,0 40,30 Z" fill="currentColor" /></svg>
);
export const Triceps = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M60,30 C80,50 60,90 60,90 L40,90 C40,90 20,50 40,30 A20,20 0 0,1 60,30 Z" fill="currentColor" /></svg>
);
export const Legs = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M30,20 L45,20 L45,80 L30,90 Z M55,20 L70,20 L70,90 L55,80 Z" fill="currentColor" /></svg>
);
export const Glutes = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M50,50 C20,50 20,90 50,90 C80,90 80,50 50,50 Z M50,50 C20,50 20,10 50,10 C80,10 80,50 50,50" fill="currentColor" /></svg>
);
export const Abs = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M35,30 h30 v15 h-30 z M35,50 h30 v15 h-30 z M35,70 h30 v15 h-30 z" fill="currentColor" /></svg>
);
export const Calves = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}><path d="M40,70 C30,80 30,95 40,95 L60,95 C70,95 70,80 60,70 Z" fill="currentColor" /></svg>
);
