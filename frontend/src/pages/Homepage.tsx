import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { movies } from "@/data/movies";

const trendingMovies = movies.slice(0, 4);
const currentMovies = [movies[4], movies[5], ...movies.slice(0, 4)];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Carousel */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trending Movies Section */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Trending Movies (1-2 APT)
            </h2>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
              {trendingMovies.map((movie) => (
                <div key={movie.id} className="flex-none w-[200px] sm:w-[240px] snap-start">
                  <MovieCard {...movie} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Theatre Badge */}
        <div className="my-8 p-4 bg-secondary rounded-lg border border-border text-center">
          <p className="text-muted-foreground">All shows at</p>
          <p className="text-xl font-semibold text-foreground">
            Annapurna Theatre, Mangalagiri
          </p>
        </div>

        {/* Current Movies Section */}
        <section className="py-12">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Now Showing
            </h2>
            <p className="text-muted-foreground">
              Book your favorite movies at Annapurna Theatre
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {currentMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
