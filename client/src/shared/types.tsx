export interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  }
  
  export interface Castaway {
    id: string;
    name: string;
    age?: number;
    hometown?: string;
    occupation?: string;
    tribe?: string;
    imageUrl?: string;
  }
  
  export interface Pick {
    id: string;
    userId: string;
    castawayId: string;
    week: number;
    points: number;
  }
  
  export interface League {
    id: string;
    name: string;
    season: number;
  }
  
  export interface WeeklyResult {
    id: string;
    weekNumber: number;
    points: number;
    castawayId: string;
    castaway: Castaway;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }