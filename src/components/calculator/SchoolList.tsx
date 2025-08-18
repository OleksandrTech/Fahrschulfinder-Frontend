// src/components/calculator/SchoolList.tsx

// Update the School type to include the prices
interface School {
    name: string;
    address: string;
    theory_price: number;
    driving_price: number;
}

// Update the props to accept the lesson counts
interface SchoolListProps {
    schools: School[];
    lessons: {
        theory: number;
        driving: number;
    };
}

export default function SchoolList({ schools, lessons }: SchoolListProps) {
    if (schools.length === 0) {
        return <p className="text-gray-500 mt-8 pt-6 border-t text-center">No schools found for this city.</p>;
    }

    // A helper function to format the price as currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
    };

    return (
        <div className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Estimated Cost for {lessons.theory} Theory & {lessons.driving} Driving Lessons
            </h2>
            <ul className="space-y-3">
                {schools.map((school, index) => {
                    // Calculate the total price for each school
                    const totalPrice = (school.theory_price * lessons.theory) + (school.driving_price * lessons.driving);

                    return (
                        <li key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-900">{school.name}</p>
                                <p className="text-sm text-gray-500">{school.address}</p>
                            </div>
                            {/* Display the calculated price */}
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</p>
                                <p className="text-xs text-gray-500">Total estimated cost</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}