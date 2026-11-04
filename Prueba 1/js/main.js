
document.addEventListener("DOMContentLoaded", () => {
    
    if (!localStorage.getItem("nutrivida_servicios")) {
        const serviciosPorDefecto = [
            {
                id: 1, 
                nombre: "Evaluación Nutricional Pediátrica",
                categoria: "evaluaciones",
                doctor: "Valentina Rojas",
                precio: 30000,
                descripcion: "Acompañamos el crecimiento y desarrollo saludable de tus hijos desde la primera infancia hasta la adolescencia. Este servicio incluye la evaluación de curvas de crecimiento (peso y talla según la OMS), diagnóstico del estado nutricional y educación en hábitos saludables."
            },
            {
                id: 2, 
                nombre: "Evaluación Nutricional Integral del Adulto",
                categoria: "evaluaciones",
                doctor: "Valentina Rojas",
                precio: 30000,
                descripcion: "Mejora tu salud, energía y bienestar general con una atención diseñada para tu etapa de vida. Este servicio incluye una evaluación antropométrica completa, análisis de hábitos actuales y el diseño de un plan alimentario personalizado."
            },
            {
                id: 3, 
                nombre: "Plan de Nutrición para Deportistas",
                categoria: "evaluaciones",
                doctor: "Tamara Pizarro",
                precio: 40000,
                descripcion: "Optimiza tu rendimiento, potencia tu masa muscular y acelera tu recuperación con un plan 100% adaptado a tu disciplina deportiva. Incluye evaluación de composición corporal por bioimpedancia y estrategias de hidratación."
            },
            {
                id: 4, 
                nombre: "Plan de Control de Peso 100% Plant-Based",
                categoria: "planes",
                doctor: "Tamara Pizarro",
                precio: 45000,
                descripcion: "Realizamos un análisis integral de salud para revisar marcadores clave como los niveles de vitamina B12, hierro, vitamina D, zinc, perfil tiroideo y lípidos. Esto asegura que la pérdida de peso se realice sobre una base biológica óptima y saludable."
            }
        ];
        

        localStorage.setItem("nutrivida_servicios", JSON.stringify(serviciosPorDefecto));
    }
});
