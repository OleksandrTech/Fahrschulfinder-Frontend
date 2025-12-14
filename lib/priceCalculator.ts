// src/lib/priceCalculator.ts

export interface DrivingSchoolPrices {
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
}

export const experienceLevels = {
    beginner: {
        label: "Beginner",
        drivingLessons: 30,
        theoryExams: 2,
        practicalExams: 2,
    },
    someExperience: {
        label: "Some Experience",
        drivingLessons: 20,
        theoryExams: 1,
        practicalExams: 2,
    },
    advanced: {
        label: "Advanced",
        drivingLessons: 12,
        theoryExams: 1,
        practicalExams: 1,
    },
    veryExperienced: {
        label: "Very Experienced",
        drivingLessons: 6,
        theoryExams: 1,
        practicalExams: 1,
    },
};

export type ExperienceLevel = keyof typeof experienceLevels;

export const calculatePrice = (
    prices: DrivingSchoolPrices,
    level: ExperienceLevel
): number => {
    const { drivingLessons, theoryExams, practicalExams } = experienceLevels[level];
    const totalPrice =
        prices.grundgebuehr +
        drivingLessons * prices.driving_price +
        theoryExams * prices.theorypruefung +
        practicalExams * prices.praxispruefung;

    return totalPrice;
};