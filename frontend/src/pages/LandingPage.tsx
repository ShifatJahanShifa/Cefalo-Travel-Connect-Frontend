import { useState, useEffect } from "react";
import { MapPin, Heart, Calendar, Search, Star, Users, Globe, Camera, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LandingPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) 
        {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);


    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const onClickHandler = () => {
        navigate('/signup')
    };

    const features = [
        {
            icon: <Camera className="w-8 h-8" />,
            title: "Travel Posts",
            description: "Share your adventures with stunning photos and inspiring stories",
            color: "from-purple-400 to-pink-400"
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Travel Plans",
            description: "Create detailed itineraries and organize your perfect journey",
            color: "from-blue-400 to-cyan-400"
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Wishlist",
            description: "Save your dream destinations and plan future adventures",
            color: "from-red-400 to-rose-400"
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            title: "Nearby Services",
            description: "Discover local attractions, restaurants, and hidden gems",
            color: "from-green-400 to-emerald-400"
        }
    ];


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            
            <div className="relative z-10 flex flex-col">
              
                <header className="p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Globe className="w-8 h-8 text-white" />
                        <span className="text-2xl font-bold text-white">Cefalo Travel Connect</span>
                    </div>
                    
                </header>

              
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className={`text-center max-w-4xl mx-auto`}>
                        <h1 className="text-5xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Your Journey Starts Here
                            
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Connect with fellow travelers, plan amazing adventures and discover the world's hidden gems
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button 
                                onClick={onClickHandler}
                                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-2"
                            >
                                <span>Start Your Adventure</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                           
                        </div>
                    </div>
                </div>
            </div>

       
            <section id="features" className="relative z-10 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Features 
                        </h2>
                        
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 cursor-pointer transform hover:scale-105 ${activeFeature === index ? 'ring-2 ring-blue-400 bg-white/20' : ''}`}
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-blue-100 group-hover:text-white transition-colors">
                                    {feature.description}
                                </p>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}