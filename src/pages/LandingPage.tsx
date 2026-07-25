import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen, Code2, BrainCircuit, Trophy, Zap, Target, ChevronRight, Lock } from "lucide-react";

interface Route {
  id: string;
  title: string;
  description: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  totalLessons: number;
  available: boolean;
  tags: string[];
  iconName: string;
}

const ROUTES: Route[] = [
  {
    id: "python",
    iconName: "code",
    title: "Python desde Cero",
    description: "Domina Python con una base solida. Aprende tipos de datos, bucles, funciones, POO, colecciones y ficheros paso a paso.",
    color: "#3b82f6",
    accentColor: "rgba(59,130,246,0.15)",
    bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.08) 100%)",
    totalLessons: 24,
    available: true,
    tags: ["Fundamentos", "POO", "Colecciones", "Ficheros", "Excepciones"],
  },
  {
    id: "poo-proyectos",
    iconName: "trophy",
    title: "Proyectos POO Avanzada",
    description: "Retos tipo examen universitario. Implementa sistemas reales usando Factory Method, Observer y principios SOLID.",
    color: "#f59e0b",
    accentColor: "rgba(245,158,11,0.15)",
    bgGradient: "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(239,68,68,0.08) 100%)",
    totalLessons: 2,
    available: true,
    tags: ["Factory Method", "Observer", "SOLID", "Proyectos"],
  },
  {
    id: "algoritmos",
    iconName: "brain",
    title: "Algoritmos y Estructuras",
    description: "Busqueda binaria, ordenamiento, recursion, pilas y colas. La base para entrevistas tecnicas.",
    color: "#10b981",
    accentColor: "rgba(16,185,129,0.15)",
    bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(6,182,212,0.08) 100%)",
    totalLessons: 8,
    available: true,
    tags: ["Busqueda", "Ordenamiento", "Recursion", "Pilas/Colas"],
  },
  {
    id: "javascript",
    iconName: "zap",
    title: "JavaScript Moderno",
    description: "ES6+, async/await, Promises, DOM, fetch API. Construye la logica de aplicaciones web modernas.",
    color: "#eab308",
    accentColor: "rgba(234,179,8,0.15)",
    bgGradient: "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(251,146,60,0.08) 100%)",
    totalLessons: 4,
    available: true,
    tags: ["ES6+", "Async/Await", "DOM", "APIs"],
  },
];

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate("/sign-in");
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-darker)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 24px",
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px", maxWidth: "620px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            borderRadius: "18px", padding: "16px",
            boxShadow: "0 0 50px rgba(59,130,246,0.5)",
          }}>
            <BookOpen size={38} color="white" />
          </div>
        </div>
        <h1 style={{
          fontSize: "2.6rem", fontWeight: 900, margin: "0 0 16px",
          background: "linear-gradient(135deg, #f8fafc 30%, #94a3b8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontFamily: "var(--font-sans)", lineHeight: 1.15,
        }}>
          Que quieres aprender hoy?
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, margin: 0 }}>
          Elige tu ruta. Cada una tiene teoria, ejemplos interactivos y retos con revision de IA.
        </p>
      </div>

      {/* Grid */}
      <div className="responsive-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
        gap: "22px",
        maxWidth: "860px",
        width: "100%",
      }}>
        {ROUTES.map((route) => (
          <div
            key={route.id}
            onClick={() => route.available && navigate(`/editor?ruta=${route.id}`)}
            style={{
              backgroundImage: route.available ? route.bgGradient : "none",
              background: route.available ? undefined : "rgba(255,255,255,0.02)",
              border: `2px solid ${route.available ? route.color + "44" : "rgba(255,255,255,0.06)"}`,
              borderRadius: "20px",
              padding: "28px",
              cursor: route.available ? "pointer" : "not-allowed",
              transition: "all 0.22s ease",
              opacity: route.available ? 1 : 0.45,
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!route.available) return;
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(-5px)";
              el.style.boxShadow = `0 20px 48px ${route.color}30`;
              el.style.borderColor = route.color + "88";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
              el.style.borderColor = route.available ? route.color + "44" : "rgba(255,255,255,0.06)";
            }}
          >
            {!route.available && (
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.07)", borderRadius: "8px",
                padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px",
              }}>
                <Lock size={12} color="var(--text-secondary)" />
                <span style={{ fontSize: "0.68rem", color: "var(--text-secondary)", fontWeight: 700 }}>Proximo</span>
              </div>
            )}

            {/* Color badge */}
            <div style={{
              width: "52px", height: "52px",
              background: route.accentColor,
              border: `2px solid ${route.color}44`,
              borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: route.color, marginBottom: "18px",
              fontSize: "1.5rem", fontWeight: 900,
            }}>
              {route.id === "python" && <Code2 size={28} />}
              {route.id === "poo-proyectos" && <Trophy size={28} />}
              {route.id === "algoritmos" && <BrainCircuit size={28} />}
              {route.id === "javascript" && <Zap size={28} />}
            </div>

            <h2 style={{
              fontSize: "1.2rem", fontWeight: 800, margin: "0 0 10px",
              color: "var(--text-primary)", fontFamily: "var(--font-sans)",
            }}>
              {route.title}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 18px" }}>
              {route.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "20px" }}>
              {route.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: "0.7rem", fontWeight: 700,
                  padding: "3px 9px", borderRadius: "20px",
                  background: route.accentColor, color: route.color,
                  border: `1px solid ${route.color}33`,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Target size={14} color="var(--text-secondary)" />
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {route.available ? `${route.totalLessons} lecciones` : "En desarrollo"}
                </span>
              </div>
              {route.available && (
                <div style={{ display: "flex", alignItems: "center", gap: "3px", color: route.color, fontSize: "0.83rem", fontWeight: 700 }}>
                  Comenzar <ChevronRight size={15} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "44px", textAlign: "center" }}>
        Tu progreso se guarda automaticamente en este dispositivo.
      </p>
    </div>
  );
}
