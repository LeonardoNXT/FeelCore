type EmotionType =
  | "Feliz"
  | "Muito feliz"
  | "Triste"
  | "Muito triste"
  | "Indiferente"
  | "Com raiva"
  | "Furioso"
  | "Cansado"
  | "Ansioso"
  | "Envergonhado"
  | "Péssimo"
  | "Animado";

export interface MoodDiaryEntry {
  emotion: EmotionType;
  intensity: number; // 1-10
  description: string; // max 500 chars
  createdAt: string | Date;
  _id?: string;
}

interface EmotionCount {
  emotion: EmotionType;
  count: number;
  percentage: number;
}

interface CombinationCount {
  emotion: EmotionType;
  intensity: number;
  count: number;
  percentage: number;
}

interface DescriptionCount {
  description: string;
  count: number;
  percentage: number;
}

interface AnalysisResult {
  total: number;
  emotions: EmotionCount[];
  combinations: CombinationCount[];
  descriptions: DescriptionCount[];
  mostFrequent: {
    emotion: EmotionCount;
    combination: CombinationCount;
    description: DescriptionCount;
  };
}

export default function analisarEmocoes(
  moodDiary: MoodDiaryEntry[]
): AnalysisResult {
  const total = moodDiary.length;

  // Contadores
  const emotionMap = new Map<EmotionType, number>();
  const combinationMap = new Map<
    string,
    { emotion: EmotionType; intensity: number; count: number }
  >();
  const descriptionMap = new Map<string, number>();

  // Processa cada entrada
  moodDiary.forEach((entry) => {
    // Conta emoções
    emotionMap.set(entry.emotion, (emotionMap.get(entry.emotion) || 0) + 1);

    // Conta combinações (emoção + intensidade)
    const combKey = `${entry.emotion}|${entry.intensity}`;
    const existing = combinationMap.get(combKey);
    if (existing) {
      existing.count++;
    } else {
      combinationMap.set(combKey, {
        emotion: entry.emotion,
        intensity: entry.intensity,
        count: 1,
      });
    }

    // Conta descrições
    if (entry.description) {
      descriptionMap.set(
        entry.description,
        (descriptionMap.get(entry.description) || 0) + 1
      );
    }
  });

  // Converte para arrays e ordena
  const emotions: EmotionCount[] = Array.from(emotionMap.entries())
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: parseFloat(((count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);

  const combinations: CombinationCount[] = Array.from(combinationMap.values())
    .map((item) => ({
      emotion: item.emotion,
      intensity: item.intensity,
      count: item.count,
      percentage: parseFloat(((item.count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);

  const descriptions: DescriptionCount[] = Array.from(descriptionMap.entries())
    .map(([description, count]) => ({
      description,
      count,
      percentage: parseFloat(((count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    emotions,
    combinations,
    descriptions,
    mostFrequent: {
      emotion: emotions[0],
      combination: combinations[0],
      description: descriptions[0],
    },
  };
}
