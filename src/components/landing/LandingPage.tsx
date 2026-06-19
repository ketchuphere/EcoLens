import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Leaf, 
  ArrowRight, 
  Menu, 
  X, 
  Globe, 
  Car, 
  Sun, 
  RefreshCw, 
  LayoutDashboard, 
  Sparkles, 
  CheckSquare, 
  FileText, 
  Award, 
  Zap,
  ShieldCheck,
  Smartphone,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for header background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* 9. Navigation Bar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-slate-200/55 shadow-xs py-3' 
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Frame */}
          <div 
            onClick={() => handleScrollToSection('hero')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="nav_brand"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-900 font-extrabold shadow-sm transition-transform group-hover:scale-105">
              <Leaf className="w-5.5 h-5.5 fill-current text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block font-sans">EcoLens</span>
              <span className="text-[9px] text-emerald-650 font-black uppercase tracking-widest block leading-none">Carbon Intelligence</span>
            </div>
          </div>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-semibold text-xs text-slate-600">
            <button 
              onClick={() => handleScrollToSection('hero')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => handleScrollToSection('features')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => handleScrollToSection('how-it-works')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <Link 
              to="/app/dashboard"
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Dashboard
            </Link>
            <Link 
              to="/app/calculator"
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Calculator
            </Link>
          </nav>

          {/* Desktop Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/app/calculator"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wide py-2.5 px-5 rounded-full transition-all shadow-sm hover:shadow-emerald-200"
            >
              Start Tracking
            </Link>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu expanded container */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200/60 p-6 shadow-md flex flex-col gap-4 font-bold text-sm text-slate-700 z-50"
          >
            <button 
              onClick={() => handleScrollToSection('hero')} 
              className="text-left py-2 hover:text-emerald-600 cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => handleScrollToSection('features')} 
              className="text-left py-2 hover:text-emerald-600 cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => handleScrollToSection('how-it-works')} 
              className="text-left py-2 hover:text-emerald-600 cursor-pointer"
            >
              How It Works
            </button>
            <Link 
              to="/app/dashboard" 
              className="text-left py-2 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/app/calculator" 
              className="text-left py-2 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calculator
            </Link>
            <Link 
              to="/app/calculator"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center py-3 rounded-xl transition-all shadow-sm mt-2 block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Tracking
            </Link>
          </motion.div>
        )}
      </header>

      {/* 1. Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-radial from-emerald-50/50 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/50 rounded-full text-[10px] font-black tracking-widest text-emerald-800 uppercase animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              🌱 Introducing EcoLens Carbon Tracker
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-sans">
              Understand Your <span className="text-emerald-600 underline decoration-emerald-200 decoration-wavy">Carbon Footprint</span>. <br />
              Take Actions. Protect The Planet.
            </h1>

            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-medium">
              Track your daily emissions, discover sustainable habits, and reduce your environmental impact with simple actions and diagnostic models.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/app/calculator"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wide py-4 px-8 rounded-full transition-all shadow-md hover:shadow-emerald-200 flex items-center justify-center gap-2 group"
              >
                <span>Start Tracking</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => handleScrollToSection('features')}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-sm border border-slate-200 py-4 px-8 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* 2. Hero Visual Section */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              
              {/* Spinning outer decorative circle */}
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-300/40 animate-spin" style={{ animationDuration: '40s' }} />
              
              {/* Static background circle glow */}
              <div className="absolute inset-4 rounded-full bg-emerald-100/30 blur-2xl -z-10" />

              {/* Middle circular planetary SVG */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                className="absolute inset-6 rounded-full bg-white border border-slate-200/50 shadow-md flex items-center justify-center overflow-hidden"
              >
                <svg className="w-full h-full p-8 text-emerald-600/80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid lines */}
                  <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
                  <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                  
                  {/* Planetary continents */}
                  <path d="M45,100 C45,65 65,45 100,45 C115,45 130,55 140,70 C145,80 135,90 120,90 C110,90 100,100 100,115 C100,130 85,145 70,145 C55,145 45,130 45,100 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M110,130 C125,115 145,110 160,120 C170,130 155,150 140,155 C125,160 115,145 110,130 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.5" />
                  
                  {/* Flowing carbon cycles lines helper */}
                  <path d="M30,100 A70,70 0 0,1 170,100" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M170,100 A70,70 0 0,1 30,100" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </motion.div>

              {/* Interactive bento badges sitting around original globe graphic */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-2 -right-4 bg-white/90 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl shadow-md flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Leaf className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-800 leading-tight uppercase">CO₂ Footprint</p>
                  <p className="text-xs font-bold text-emerald-600 number-font">-35% saved</p>
                </div>
              </motion.div>

              {/* Interactive bento badges sitting around original globe graphic */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-6 -left-8 bg-white/90 backdrop-blur-md border border-slate-200/60 p-3 rounded-2xl shadow-md flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 animate-spin" style={{ animationDuration: '10s' }}>
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-800 leading-tight uppercase">Clean Energy</p>
                  <p className="text-xs font-bold text-amber-600 number-font">1.5kW Grid</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-1/2 -translate-y-1/2 -left-12 bg-white/90 backdrop-blur-md border border-slate-200/60 p-2 text-center rounded-3xl shadow-md flex flex-col justify-center items-center gap-1"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-[10px] shadow-inner">
                  20%
                </div>
                <span className="text-[7px] font-black uppercase text-slate-400">Target</span>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Problem Section */}
      <section id="problem" className="py-20 md:py-28 bg-white border-y border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Carbon Tracking Matters?
            </h2>
            <p className="text-sm text-slate-400 font-medium font-sans">
              Human-caused emissions are driving climate change. Uncovering your footprint elements is the essential first tier towards net-zero recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Rising Emissions */}
            <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200/70 p-6 rounded-[24px] transition-all group flex flex-col justify-between hover:translate-y-[-2px] duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center">
                  <Globe className="w-5.5 h-4.5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Rising Emissions</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                  The atmosphere is filling with carbon dioxide faster than forests can absorb, driving extreme patterns worldwide.
                </p>
              </div>
            </div>

            {/* Card 2: Transportation Impact */}
            <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200/70 p-6 rounded-[24px] transition-all group flex flex-col justify-between hover:translate-y-[-2px] duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center animate-pulse">
                  <Car className="w-5.5 h-4.5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Transportation</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                  Average single vehicles and short aviation flights contribute massive pollutants per mile traveled.
                </p>
              </div>
            </div>

            {/* Card 3: Energy Consumption */}
            <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200/70 p-6 rounded-[24px] transition-all group flex flex-col justify-between hover:translate-y-[-2px] duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-5.5 h-5.5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Energy Usage</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                  Heating, ventilation, and appliances rely heavily on coal or oil grids, raising baseline housing footprint indexes.
                </p>
              </div>
            </div>

            {/* Card 4: Lifestyle Choices */}
            <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200/70 p-6 rounded-[24px] transition-all group flex flex-col justify-between hover:translate-y-[-2px] duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Lifestyle Choices</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                  Food production, shopping habits, and food landfill waste accumulate rapidly. Minor changes prompt immense relief.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. How EcoLens Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#F8FAF8]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto space-y-4 mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black tracking-widest text-emerald-800 uppercase">
              How EcoLens Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Simple 3-Step Process
            </h2>
            <p className="text-sm text-slate-400 font-medium font-sans">
              No accounts. Pure dashboard simplicity. Learn how to diagnose and act.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-[32px] space-y-4 relative shadow-xs">
              <div className="absolute -top-6 right-8 h-12 w-12 rounded-2xl bg-emerald-600 font-black text-white flex items-center justify-center number-font text-lg shadow">
                01
              </div>
              <h3 className="text-lg font-black text-slate-900">Calculate</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium font-sans">
                Enter your monthly activities: car travel, flights count, electricity bills, and meal patterns through our rule-based forms.
              </p>
              <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure & Client-Side</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-[32px] space-y-4 relative shadow-xs">
              <div className="absolute -top-6 right-8 h-12 w-12 rounded-2xl bg-emerald-600 font-black text-white flex items-center justify-center number-font text-lg shadow">
                02
              </div>
              <h3 className="text-lg font-black text-slate-900">Understand</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium font-sans">
                Review detailed data analytics. See how your transport, home utilities, food, and shopping split compare to planetary baselines.
              </p>
              <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dynamic Charts Included</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-[32px] space-y-4 relative shadow-xs">
              <div className="absolute -top-6 right-8 h-12 w-12 rounded-2xl bg-emerald-600 font-black text-white flex items-center justify-center number-font text-lg shadow">
                03
              </div>
              <h3 className="text-lg font-black text-slate-900">Reduce</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium font-sans">
                Engage what-if scenarios. Toggle rooftop solar installs, try eco challenges, log habits checklist items and secure badge honors.
              </p>
              <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Earn Eco Badges & Points</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Feature Showcase */}
      <section id="features" className="py-20 md:py-28 bg-white border-t border-slate-200/30">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Interactive Tools Overview
            </h2>
            <p className="text-sm text-slate-400 font-medium font-sans">
              Explore the core modules crafted to assist your ecological journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[28px] hover:shadow-xs hover:border-slate-300 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-150 mb-5 shadow-xs">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 font-sans">Carbon Calculator</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                Comprehensive rule-based checklist to evaluate monthly car travel, cooking LPG, home AC hours, and shopping volumes with live footprint calculations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[28px] hover:shadow-xs hover:border-slate-300 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center border border-indigo-150 mb-5 shadow-xs">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 font-sans">Personal Dashboard</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                Review dynamic pie distributions, comparative goal baselines, historical logs trends and streak tracking parameters in a highly polished interface.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[28px] hover:shadow-xs hover:border-slate-300 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-150 mb-5 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 font-sans">What-If Reduction Simulator</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                Toggle residential solar setups, slash weekly car commutes, shift diets veg tiers, and preview immediate planetary offset metrics visually.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[28px] hover:shadow-xs hover:border-slate-300 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-650 flex items-center justify-center border border-rose-150 mb-5 shadow-xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 font-sans">Eco Habits Checklist</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                Commit to micro habits such as waste composting or boarding public transit. Accumulate environment points to unlock authoritative profile badge awards.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[28px] hover:shadow-xs hover:border-slate-300 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-150 mb-5 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 font-sans">Diagnostic reports</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                Audit carbon distributions, compare households with sibling or roommate groups, explore educational circular economies and resolve sustainability quizzes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[28px] hover:shadow-xs hover:border-slate-300 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-150 mb-5 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 font-sans">Gamified Milestones</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                Keep daily log streaks alive, gather welcome reward quotas, complete local challenges lists and secure a suite of verified honor medals.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Impact Section */}
      <section id="impact" className="py-20 md:py-28 bg-[#094037] text-white relative">
        <div className="absolute inset-0 bg-radial from-emerald-800/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[9px] font-black tracking-widest text-emerald-300 uppercase">
              Planetary Metrics
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.25]">
              Every single habit change <br />has massive global sway
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/70 font-medium leading-relaxed font-sans">
              Decarbonization is not an abstract governmental duty. When single households implement smart energy adjustments or audit local transit miles, emission indexes collapse immediately.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-6">
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans">Rule-Based Diagnostic</h4>
                  <p className="text-[10px] text-emerald-205/60 mt-0.5 leading-normal font-sans">Matches peer-reviewed carbon factors directly.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans">Offline-First Design</h4>
                  <p className="text-[10px] text-emerald-205/60 mt-0.5 leading-normal font-sans">Zero personal telemetry ever exits your browser.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Stat Box 1 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-3 relative overflow-hidden backdrop-blur-xs">
              <div className="text-emerald-400 font-extrabold text-[10px] tracking-wider uppercase font-sans">Transportation Yield</div>
              <div className="text-4xl font-black text-white leading-none number-font">10 kg</div>
              <p className="text-xs text-white/90 font-black tracking-tight leading-tight uppercase relative">CO₂ Emissions Saved</p>
              <div className="h-px bg-white/10 my-2" />
              <p className="text-[10px] text-emerald-200/60 leading-normal font-sans">Equals walking instead of taking standard gasoline vehicles for typical short trips.</p>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-3 relative overflow-hidden backdrop-blur-xs">
              <div className="text-emerald-400 font-extrabold text-[10px] tracking-wider uppercase font-sans">Target Reductions</div>
              <div className="text-4xl font-black text-white leading-none number-font">20%</div>
              <p className="text-xs text-white/90 font-black tracking-tight leading-tight uppercase relative">Target Reduction Index</p>
              <div className="h-px bg-white/10 my-2" />
              <p className="text-[10px] text-emerald-200/60 leading-normal font-sans">Standard yearly reduction goal required to successfully match global climate accord parameters.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Sustainability Quote Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/40">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-lg font-black font-sans">
            “
          </div>
          <blockquote className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-relaxed max-w-2xl mx-auto font-sans">
            "The future depends on what we do today."
          </blockquote>
          <cite className="block text-[11px] font-black uppercase text-slate-400 tracking-widest font-sans font-medium">
            — Mahatma Gandhi
          </cite>
        </div>
      </section>

      {/* 8. Call-To-Action Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-emerald-50/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="h-12 w-12 rounded-3xl bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/10 animate-bounce">
            <Zap className="w-5.5 h-5.5 fill-current text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Ready to start your sustainability journey?
            </h2>
            <p className="text-sm text-slate-500 font-bold max-w-lg mx-auto">
              Measure your footprint today. Discover custom insights immediately. Zero friction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/app/calculator"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wide py-4 px-8 rounded-full transition-all shadow-md hover:shadow-emerald-200 inline-block text-center"
            >
              Calculate My Footprint
            </Link>
            <Link 
              to="/app/dashboard"
              className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-sm tracking-wide py-4 px-8 rounded-full transition-all inline-block text-center"
            >
              Visit Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Basic Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/50 py-12 text-center text-[11px] text-slate-400">
        <div className="max-w-5xl mx-auto px-6 space-y-4">
          <p className="font-extrabold text-slate-600 uppercase tracking-wide">EcoLens © 2026</p>
          <p className="font-medium max-w-md mx-auto leading-normal">
            A rule-based mathematical simulator. Environment indexes mapped from typical European and Global environmental protection agency averages.
          </p>
          <div className="pt-2 flex justify-center gap-6 font-bold text-slate-500">
            <button onClick={() => handleScrollToSection('hero')} className="hover:text-slate-800 cursor-pointer">Home</button>
            <button onClick={() => handleScrollToSection('features')} className="hover:text-slate-800 cursor-pointer">Features</button>
            <button onClick={() => handleScrollToSection('how-it-works')} className="hover:text-slate-800 cursor-pointer">How It Works</button>
            <Link to="/app/dashboard" className="hover:text-slate-800">Dashboard</Link>
            <Link to="/app/calculator" className="hover:text-slate-800">Calculator</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
