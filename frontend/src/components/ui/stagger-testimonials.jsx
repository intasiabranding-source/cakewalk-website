import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "The Cardamom Saffron soaking in the Rasmalai Cake was pure heaven! It was the star of our anniversary party.",
    by: "Archana, Chennai",
    rating: 5
  },
  {
    tempId: 1,
    testimonial: "Indu designed a stunning multi-tiered custom cake for our baby shower. It tasted even better than it looked!",
    by: "Priya S., Besant Nagar",
    rating: 5
  },
  {
    tempId: 2,
    testimonial: "Best tin dream cake in town! The five layers of distinct chocolate textures with the crisp crack top are addictive.",
    by: "Karthik R., Mylapore",
    rating: 5
  },
  {
    tempId: 3,
    testimonial: "Our guests went absolutely crazy for the Lotus Biscoff Tres Leches cups. Spot-on delivery and beautiful presentation.",
    by: "Suresh, Adyar",
    rating: 5
  },
  {
    tempId: 4,
    testimonial: "The Double Chocolate Cake was rich, fudgy, and remarkably light. Best birthday cake we have ever had.",
    by: "Meera Sen, Chennai",
    rating: 5
  },
  {
    tempId: 5,
    testimonial: "Indu's Rose Milk Tres Leches is out of this world! Melt-in-your-mouth texture with the perfect sweetness.",
    by: "Aditi Nair, Nungambakkam",
    rating: 5
  },
  {
    tempId: 6,
    testimonial: "We ordered the Brownie Tower for my son's graduation and it was a masterpiece. Highly recommend Cake Walk!",
    by: "Rahul V., Chennai",
    rating: 5
  },
  {
    tempId: 7,
    testimonial: "If you want premium, high-quality ingredients and incredible custom designs, Indu is the absolute best.",
    by: "Shalini K., ECR",
    rating: 5
  }
];

const TestimonialCard = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out select-none flex flex-col justify-between",
        isCenter 
          ? "z-10 bg-[#9A0002] text-[#EFE6DE] border-[#9A0002]" 
          : "z-0 bg-[#EFE6DE] text-forestGreen border-forestGreen/20 hover:border-[#9A0002]/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.4) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px #DFD2C6" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-[#9A0002]/25"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      
      <div>
        {/* Star Rating Indicator */}
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={18} 
              className={cn(
                isCenter ? "fill-[#EFE6DE] text-[#EFE6DE]" : "fill-[#9A0002] text-[#9A0002]"
              )} 
            />
          ))}
        </div>

        <h3 className="text-base sm:text-lg font-serif font-bold leading-relaxed">
          "{testimonial.testimonial}"
        </h3>
      </div>

      <p className="mt-4 text-xs font-sans font-bold tracking-wider uppercase opacity-85">
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials = ({ reviews = [] }) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState([]);

  const handleMove = (steps) => {
    if (testimonialsList.length === 0) return;
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const formatted = (reviews || []).map((r, i) => ({
      ...r,
      tempId: r.tempId || r.id || `rev-${i}-${Date.now()}`
    }));
    setTestimonialsList(formatted);
  }, [reviews]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (testimonialsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#9A0002]/30 rounded-3xl bg-[#EFE6DE]/50 max-w-lg mx-auto text-center my-8 animate-fadeIn">
        <p className="font-serif italic text-lg text-forestGreen font-bold">No reviews posted yet.</p>
        <p className="font-sans text-xs text-forestGreen/70 mt-2 leading-relaxed">
          Sweet reviews from our lovely customers will appear here once added through the admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-transparent"
      style={{ height: 520 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      
      {/* Testimonial Nav Arrows */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 z-20">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-forestGreen transition-all",
            "bg-[#EFE6DE] border border-forestGreen/20 hover:bg-[#9A0002] hover:text-[#EFE6DE] hover:border-[#9A0002] shadow active:scale-95 cursor-pointer"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-forestGreen transition-all",
            "bg-[#EFE6DE] border border-forestGreen/20 hover:bg-[#9A0002] hover:text-[#EFE6DE] hover:border-[#9A0002] shadow active:scale-95 cursor-pointer"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
