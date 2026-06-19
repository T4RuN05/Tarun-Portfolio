# Cinematic 3D Developer Portfolio

A high-performance, visually striking interactive portfolio built to showcase creative development, 3D web rendering, and modern UI/UX principles. This application is engineered with a heavy emphasis on dynamic motion, glassmorphism, and hardware-accelerated performance across all devices.

## ✨ Key Features

- **Cinematic Aesthetic**: Dark, electric-blue theme with editorial-grade typography and immersive parallax scrolling.
- **Hardware-Accelerated Motion**: Complex animations powered by Framer Motion, fully optimized with dedicated VRAM compositor layers (`translateZ(0)`) for buttery smooth 60fps rendering on mobile devices.
- **Interactive 3D Engine**: Features an ASCII-rendered Black Hole canvas simulation (with optimized mobile fallbacks) and physics-based 3D tilting project cards.
- **Custom Music Player**: A fully functional, hidden audio player with custom crossfading, play/pause logic, and dynamic audio-visualizer UI.
- **Dynamic Island Navigation**: A floating, reactive navigation bar inspired by modern mobile OS paradigms.
- **Smooth Scrolling**: Implements Lenis scroll on desktop for a fluid, continuous scrolling experience, seamlessly reverting to native momentum scrolling on touch devices.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Scroll Engine**: [Lenis](https://lenis.studiofreight.com/)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Mobile Performance Architecture

This portfolio utilizes an adaptive rendering engine to ensure optimal performance across devices:
- **Responsive Blur Radiuses**: Dynamically scales down heavy `backdrop-filter` calculations on mobile screens to preserve battery and GPU limits.
- **Physics Throttling**: Heavy `useSpring` and `useMotionValue` tracking are aggressively disabled on touch devices to prevent layout thrashing.
- **Conditional Rendering**: Expensive Canvas/WebGL elements fall back to highly optimized CSS/Static equivalents on small viewports.

## 👨‍💻 Developer

**Tarun Asthana**
- [GitHub](https://github.com/T4RuN05)
- [LinkedIn](https://www.linkedin.com/in/tarun-asthana)
