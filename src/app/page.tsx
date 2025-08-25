"use client"
import { useRouter } from "next/navigation"
import { CheckCircle, Users, Settings, DollarSign, ArrowRight, Zap, Shield, Rocket, Star, Play, ChevronDown, BarChart3, Clock, Globe } from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    setIsVisible(true)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  type AnimatedSectionProps = {
    children: React.ReactNode
    delay?: number
  }

  const AnimatedSection = ({ children, delay = 0 }: AnimatedSectionProps) => (
    <div 
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )

  type ButtonProps = {
    children: React.ReactNode
    variant?: "primary" | "secondary" | "ghost"
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    size?: "default" | "large"
  }

  const Button = ({
    children,
    variant = "primary",
    onClick,
    className = "",
    size = "default"
  }: ButtonProps) => {
    const sizeClasses = {
      default: "px-6 py-3",
      large: "px-8 py-4"
    }
    
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
      secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm hover:shadow-md",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }
    
    return (
      <button
        onClick={onClick}
        className={`${sizeClasses[size]} font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Flowly</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Tarifs</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">À propos</a>
              <Button variant="ghost" onClick={() => router.push("/auth")}>Connexion</Button>
              <Button onClick={() => router.push("/auth")}>
                Essai gratuit
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-blue-700">Nouveau : Intégration IA</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Orchestrez vos{" "}
                  <span className="text-blue-600">workflows</span>{" "}
                  avec précision
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  La plateforme d'automatisation qui unifie vos processus métier. 
                  Transformez la complexité en simplicité avec des workflows intelligents 
                  qui s'adaptent à votre organisation.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="large" onClick={() => router.push("/auth")}>
                    <Rocket className="w-5 h-5 mr-2" />
                    Démarrer gratuitement
                  </Button>
                  <Button variant="secondary" size="large">
                    <Play className="w-5 h-5 mr-2" />
                    Voir la démo
                  </Button>
                </div>
                
                <div className="flex items-center space-x-8 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.9/5 sur 2,847 avis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Certifié ISO 27001</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
                  {/* Browser mockup header */}
                  <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 text-xs text-gray-400">app.flowly.io</div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Tableau de bord</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">En direct</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-700">Workflows</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">247</div>
                        <div className="text-xs text-green-600">+12% ce mois</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-700">Temps économisé</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">156h</div>
                        <div className="text-xs text-blue-600">Cette semaine</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-700">Équipes</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">12</div>
                        <div className="text-xs text-gray-600">Connectées</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Onboarding Client - Acme Corp</span>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">En cours</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Étape 3 sur 4</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Une architecture pensée pour l'entreprise
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des fonctionnalités robustes qui s'intègrent parfaitement dans votre écosystème technologique
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Automatisation Intelligente",
                description: "Moteur d'automatisation basé sur l'IA qui apprend de vos processus et optimise continuellement vos workflows pour maximiser l'efficacité.",
                delay: 0
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Collaboration Centralisée",
                description: "Hub collaboratif unifié avec assignation automatique, suivi en temps réel et notifications contextuelles pour maintenir l'alignement des équipes.",
                delay: 100
              },
              {
                icon: <Settings className="w-6 h-6" />,
                title: "Contrôle & Analytics",
                description: "Dashboard exécutif avec métriques avancées, rapports personnalisables et insights prédictifs pour pilotter vos opérations avec précision.",
                delay: 200
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={feature.delay}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Une tarification qui évolue avec vous
              </h2>
              <p className="text-xl text-gray-600">
                Choisissez la formule adaptée à votre organisation
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "0",
                period: "€/mois",
                description: "Idéal pour découvrir Flowly",
                features: [
                  "1 organisation",
                  "2 workflows maximum",
                  "5 étapes par workflow",
                  "Dashboard basique",
                  "Utilisateurs illimités",
                  "Support communautaire"
                ],
                popular: false,
                delay: 0
              },
              {
                name: "Professional",
                price: "49",
                period: "€/mois",
                description: "Pour les équipes qui veulent plus",
                features: [
                  "Workflows illimités",
                  "Étapes illimitées",
                  "Analytics avancés",
                  "Notifications multi-canaux",
                  "Jusqu'à 50 utilisateurs",
                  "Support prioritaire",
                  "API & intégrations",
                  "Exports de données"
                ],
                popular: true,
                delay: 100
              },
              {
                name: "Enterprise",
                price: "199",
                period: "€/mois",
                description: "Solution complète pour l'entreprise",
                features: [
                  "Toutes les fonctionnalités Pro",
                  "IA avancée & prédictions",
                  "Intégrations entreprise",
                  "Multi-organisations",
                  "Utilisateurs illimités",
                  "Support dédié 24/7",
                  "SSO & sécurité avancée",
                  "Formation & onboarding"
                ],
                popular: false,
                delay: 200
              }
            ].map((plan, index) => (
              <AnimatedSection key={index} delay={plan.delay}>
                <div className={`bg-white rounded-2xl p-8 shadow-sm border transition-all duration-300 hover:shadow-lg relative ${
                  plan.popular ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-100'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Recommandé
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-1">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => router.push("/auth")}
                    variant={plan.popular ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {plan.price === "0" ? "Commencer gratuitement" : `Choisir ${plan.name}`}
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Flowly</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                La plateforme d'automatisation qui transforme vos processus métier 
                en workflows intelligents et efficaces.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Flowly. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}