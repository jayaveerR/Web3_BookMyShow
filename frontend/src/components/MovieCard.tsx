import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  id: number;
  poster: string;
  title: string;
  price: string;
  language?: string;
  format?: string;
}

const MovieCard = ({ id, poster, title, price, language, format }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group cursor-pointer bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
      onClick={() => navigate(`/movie/${id}`)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-cinema-hero">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {price && (
          <div className="absolute top-2 right-2 bg-cinema-price text-cinema-price-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {price}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
          {title}
        </h3>
        
        {(language || format) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
            {language && <span>{language}</span>}
            {language && format && <span>•</span>}
            {format && <span>{format}</span>}
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movie/${id}`);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;
