//src/app/page.tsx

'use client';

import Link from 'next/link';
import { BookOpen, Search, User, Star, TrendingUp, Users, Award, ArrowRight, Sparkles, Heart, BookMarked } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Búsqueda Avanzada",
      description: "Encuentra cualquier libro usando nuestra potente búsqueda con filtros inteligentes",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Star,
      title: "Reseñas Detalladas",
      description: "Comparte y descubre opiniones detalladas de una comunidad apasionada por la lectura",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: BookMarked,
      title: "Biblioteca Personal",
      description: "Organiza tu colección, marca favoritos y lleva un registro de tu progreso de lectura",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Libros catalogados", icon: BookOpen },
    { number: "12K+", label: "Lectores activos", icon: Users },
    { number: "85K+", label: "Reseñas publicadas", icon: Star },
    { number: "4.9", label: "Valoración promedio", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200/50 dark:border-blue-700/50">
              <Sparkles className="w-4 h-4" />
              <span>La comunidad de lectores más grande</span>
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              Descubre tu próxima
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
                gran lectura
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Únete a miles de lectores que comparten, descubren y reseñan los mejores libros. 
              Tu próxima aventura literaria te está esperando.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                href="/search" 
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-1 min-w-[200px]"
              >
                <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Explorar libros</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link 
                href="/profile" 
                className="group inline-flex items-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl shadow-slate-900/10 dark:shadow-slate-900/25 hover:shadow-2xl hover:shadow-slate-900/20 dark:hover:shadow-slate-900/40 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1 min-w-[200px]"
              >
                <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Mi biblioteca</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl mb-4 mx-auto">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm lg:text-base text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Características principales</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Todo lo que necesitas para
                <span className="block text-blue-600 dark:text-blue-400">gestionar tu lectura</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Herramientas poderosas diseñadas para lectores apasionados que quieren más de su experiencia literaria.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30 transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Descubrir más</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Heart className="w-4 h-4" />
              <span>Únete a la comunidad</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              ¿Listo para comenzar tu
              <span className="block">aventura literaria?</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Miles de lectores ya han encontrado su próximo libro favorito. 
              Es tu turno de descubrir historias increíbles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/search" 
                className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Comenzar ahora</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
