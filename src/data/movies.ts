import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";

export interface Movie {
    id: number;
    title: string;
    poster: string;
    price: string;
    language: string;
    format: string;
    genre: string;
    description: string;
    location: string;
}

export const movies: Movie[] = [
    {
        id: 1,
        title: "Bahubali The Epic",
        poster: movie1,
        price: "2 APT",
        language: "Telugu",
        format: "2D",
        genre: "Action • Thriller",
        description: "In a world torn apart by conflict, an elite team of warriors must band together to stop an ancient threat from destroying everything they hold dear. With stunning action sequences and heart-pounding suspense, Shadow Warriors takes you on an unforgettable journey of courage, sacrifice, and redemption.",
        location: "Annapurna Theatre, Mangalagiri"
    },
    {
        id: 2,
        title: "Dude",
        poster: movie2,
        price: "1 APT",
        language: "Telugu",
        format: "2D",
        genre: "Romance • Drama",
        description: "Two strangers meet in the city of love and embark on a journey that changes their lives forever. A heartwarming tale of serendipity, passion, and the magic of Paris.",
        location: "Annapurna Theatre, Mangalagiri"
    },
    {
        id: 3,
        title: "Suzume",
        poster: movie3,
        price: "2 APT",
        language: "Telugu",
        format: "2D",
        genre: "Horror • Mystery",
        description: "When a family moves into an old mansion, they uncover secrets that were meant to stay buried. As the darkness closes in, they must fight to survive the terror that lurks within.",
        location: "Annapurna Theatre, Mangalagiri"
    },
    {
        id: 4,
        title: "Adventure Quest",
        poster: movie4,
        price: "1 APT",
        language: "Telugu",
        format: "2D",
        genre: "Adventure • Fantasy",
        description: "Join a group of unlikely heroes as they traverse mystical lands to recover a lost artifact. An epic adventure filled with magic, monsters, and mayhem.",
        location: "Annapurna Theatre, Mangalagiri"
    },
    {
        id: 5,
        title: "MAD",
        poster: movie5,
        price: "2 APT",
        language: "Telugu",
        format: "3D",
        genre: "Sci-Fi • Action",
        description: "The galaxy is at war. As rebel forces make their final stand against the empire, a young pilot discovers a power that could turn the tide of battle.",
        location: "Annapurna Theatre, Mangalagiri"
    },
    {
        id: 6,
        title: "DRAME",
        poster: movie6,
        price: "1 APT",
        language: "Telugu",
        format: "2D",
        genre: "Drama • Thriller",
        description: "A gripping story of a flight that goes missing and the investigation that follows. Unravel the mystery behind The Departure.",
        location: "Annapurna Theatre, Mangalagiri"
    }
];
