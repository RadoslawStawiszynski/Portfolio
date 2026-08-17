// WHY: Provides seed data so a new user's portfolio is never empty on first login.

type BlockData = {
  portfolio: string;
  type: string;
  order: number;
  visible: boolean;
  [key: string]: unknown;
};

export function createPlaceholderBlocks(
  portfolioId: string,
  email: string
): BlockData[] {
  return [
    {
      portfolio: portfolioId,
      type: "hero",
      order: 10,
      visible: true,
      heroData: {
        title: "Imię Nazwisko",
        subtitle: "Twoje stanowisko",
      },
    },
    {
      portfolio: portfolioId,
      type: "about",
      order: 20,
      visible: true,
      aboutData: {
        bio: "Napisz tutaj kilka zdań o sobie. Kim jesteś, co robisz, co Cię wyróżnia.",
      },
    },
    {
      portfolio: portfolioId,
      type: "experience",
      order: 30,
      visible: true,
      experienceData: {
        items: [
          {
            company: "Twoja firma",
            role: "Twoje stanowisko",
            startDate: "2020-01",
            description: "Opisz swoje obowiązki i osiągnięcia.",
          },
        ],
      },
    },
    {
      portfolio: portfolioId,
      type: "skills",
      order: 40,
      visible: true,
      skillsData: {
        categories: [
          {
            name: "Umiejętności",
            skills: "Umiejętność 1\nUmiejętność 2\nUmiejętność 3",
          },
        ],
      },
    },
    {
      portfolio: portfolioId,
      type: "education",
      order: 50,
      visible: true,
      educationData: {
        items: [
          {
            school: "Twoja uczelnia",
            degree: "Tytuł",
            field: "Kierunek",
            startYear: 2016,
            endYear: 2020,
          },
        ],
      },
    },
    {
      portfolio: portfolioId,
      type: "contact",
      order: 60,
      visible: true,
      contactData: {
        email,
        showForm: true,
      },
    },
  ];
}
