import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, HeartPulse, Users } from 'lucide-react';
import heroImage from "../../assets/landing-hero.jpg";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      {/* ================= HERO SECTION ================= */}

<section
  id="home"
  className="relative h-screen overflow-hidden flex items-center"
>
  {/* Background Image */}
  <img
    src={heroImage}
    alt="Hospital"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/90 via-[#020817]/70 to-[#020817]/40" />

  {/* Blur Glow */}
  <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 blur-[160px] rounded-full" />
  <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full" />

  {/* Content */}
  <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .8 }}
      className="max-w-3xl"
    >

      {/* Badge */}

      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600/20 border border-blue-400/40 backdrop-blur-xl mb-8">

        <Building2 size={16} className="text-blue-400" />

        <span className="text-blue-300 text-sm font-medium">

          Smart Healthcare Platform

        </span>

      </div>

      {/* Heading */}

      <h1 className="text-6xl lg:text-7xl font-extrabold text-white leading-tight">

        Smart Hospital

        <br />

        <span className="text-blue-500">

          Management System

        </span>

      </h1>

      {/* Description */}

      <p className="mt-8 text-xl text-gray-300 leading-9 max-w-2xl">

        Manage Patients, Doctors, Pharmacy,
        Laboratory, Billing, Appointments,
        Wards and Reports from one modern
        cloud-based healthcare platform.

      </p>

      {/* Buttons */}

      <div className="flex flex-wrap gap-5 mt-10">

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold shadow-[0_0_40px_rgba(37,99,235,.45)]"
        >

          Get Started

        </button>

        <button
          className="px-8 py-4 rounded-full border border-white/30 backdrop-blur-xl text-white hover:bg-white/10 transition"
        >

          Explore Features

        </button>

      </div>

      {/* Bottom Info */}

      <div className="flex flex-wrap gap-10 mt-16">

        <div>

          <h4 className="text-white font-semibold">

            Secure & Reliable

          </h4>

          <p className="text-gray-400 text-sm">

            Advanced Data Security

          </p>

        </div>

        <div>

          <h4 className="text-white font-semibold">

            AI Powered

          </h4>

          <p className="text-gray-400 text-sm">

            Smart Healthcare Automation

          </p>

        </div>

        <div>

          <h4 className="text-white font-semibold">

            24 / 7 Support

          </h4>

          <p className="text-gray-400 text-sm">

            Always Available

          </p>

        </div>

      </div>

    </motion.div>

  </div>

</section>

{/* ================= FLOATING GLASS CARDS ================= */}

{/* Patients Card */}
<motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: .4, duration: .8 }}
  className="absolute top-28 right-20 hidden xl:block"
>
  <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-5 w-64 shadow-[0_20px_60px_rgba(0,0,0,.35)]">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-gray-300 text-sm">
          Total Patients
        </p>

        <h2 className="text-4xl font-bold text-white mt-2">
          3,248
        </h2>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
        <Users className="text-white" />
      </div>

    </div>

    <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="w-4/5 h-full bg-blue-500 rounded-full"></div>
    </div>

    <p className="text-green-400 text-sm mt-3">
      +18% this month
    </p>

  </div>
</motion.div>

{/* Emergency Card */}
<motion.div
  animate={{ y: [0, -12, 0] }}
  transition={{
    repeat: Infinity,
    duration: 5
  }}
  className="absolute bottom-32 right-40 hidden xl:block"
>
  <div className="backdrop-blur-xl bg-red-500/15 border border-red-400/30 rounded-3xl px-6 py-5">

    <div className="flex items-center gap-4">

      <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">

        <HeartPulse className="text-white" />

      </div>

      <div>

        <h3 className="text-white font-semibold">

          Emergency

        </h3>

        <p className="text-red-200 text-sm">

          24 / 7 Active

        </p>

      </div>

    </div>

  </div>

</motion.div>

{/* AI Card */}

<motion.div
  animate={{ y: [0, 10, 0] }}
  transition={{
    repeat: Infinity,
    duration: 4
  }}
  className="absolute top-[52%] right-[420px] hidden xl:block"
>

  <div className="backdrop-blur-xl bg-blue-600/20 border border-blue-400/30 rounded-3xl px-6 py-5">

    <h3 className="text-white font-bold">

      AI Powered

    </h3>

    <p className="text-blue-200 text-sm mt-2">

      Smart Reports

    </p>

  </div>

</motion.div>

{/* Scroll Down */}

<div className="absolute bottom-10 left-1/2 -translate-x-1/2">

  <motion.div

    animate={{
      y: [0, 12, 0]
    }}

    transition={{
      repeat: Infinity,
      duration: 1.8
    }}

    className="w-8 h-14 rounded-full border-2 border-white/40 flex justify-center"
  >

    <div className="w-2 h-2 rounded-full bg-white mt-3"></div>

  </motion.div>

</div>

{/* Decorative Glow */}

<div className="absolute top-24 right-60 w-40 h-40 bg-blue-500/20 blur-[120px] rounded-full"></div>

<div className="absolute bottom-10 left-40 w-60 h-60 bg-cyan-500/20 blur-[180px] rounded-full"></div>

{/* Medical Plus Icons */}

<div className="absolute top-40 left-20 text-white/20 text-5xl rotate-12">
  +
</div>

<div className="absolute top-64 right-96 text-blue-300/20 text-6xl">
  +
</div>

<div className="absolute bottom-28 left-1/3 text-cyan-300/20 text-4xl">
  +
</div>

{/* ================= BACKGROUND GRID ================= */}

<div
  className="absolute inset-0 opacity-[0.05]"
  style={{
    backgroundImage: `
      linear-gradient(to right,#ffffff 1px,transparent 1px),
      linear-gradient(to bottom,#ffffff 1px,transparent 1px)
    `,
    backgroundSize: "60px 60px",
  }}
/>

{/* ================= ECG LINE ================= */}

<div className="absolute bottom-24 left-0 w-full overflow-hidden opacity-25">

  <svg
    viewBox="0 0 1600 120"
    className="w-full h-24"
    fill="none"
  >
    <motion.path
      d="M0 60
         L140 60
         L180 60
         L205 20
         L225 100
         L245 60
         L380 60
         L520 60
         L545 35
         L565 95
         L585 60
         L820 60
         L845 15
         L870 100
         L895 60
         L1200 60
         L1230 35
         L1260 90
         L1285 60
         L1600 60"
      stroke="#3B82F6"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </svg>

</div>

{/* ================= FLOATING PARTICLES ================= */}

<div className="absolute top-24 left-1/4 w-3 h-3 rounded-full bg-blue-400/40 animate-ping" />
<div className="absolute top-40 right-1/3 w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
<div className="absolute bottom-40 left-20 w-2 h-2 rounded-full bg-white animate-pulse" />
<div className="absolute bottom-56 right-20 w-4 h-4 rounded-full bg-blue-500/30 animate-ping" />
<div className="absolute top-1/2 left-12 w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />

{/* ================= LEFT VERTICAL LABEL ================= */}

<div className="absolute left-8 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col items-center gap-4">

  <div className="w-px h-32 bg-white/20" />

  <span
    className="text-white/50 uppercase tracking-[8px] text-xs"
    style={{ writingMode: "vertical-rl" }}
  >
    MEDICORE
  </span>

  <div className="w-px h-32 bg-white/20" />

</div>

{/* ================= HERO IMAGE HOVER EFFECT ================= */}

<style>{`
.hero-image{

transition:.6s;

}

.hero-image:hover{

transform:scale(1.04);

}

.glass-card{

backdrop-filter:blur(22px);

background:rgba(255,255,255,.08);

border:1px solid rgba(255,255,255,.18);

box-shadow:0 20px 70px rgba(0,0,0,.35);

}
`}</style>
    </div>
  );
}

export default LandingPage;