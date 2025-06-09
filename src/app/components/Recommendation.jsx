import React from "react";

// Example services array
const services = [
    {
        title: "Web Development",
        description: "Build responsive and modern websites.",
        image:
            "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Graphic Design",
        description: "Create stunning visuals for your brand.",
        image:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    // Add more services as needed
];

const Recommendation = () => {
    return (
        <>
            <div className="relative w-fit ml-6 mt-10 mb-6">
                <h2 className="text-3xl font-bold text-left">Our Recommendations</h2>
                <div
                    className="absolute left-0 bottom-0 h-1 bg-purple-500 rounded"
                    style={{ width: "60%" }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {services.map((service, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-200 transition-shadow duration-300"
                    >
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Recommendation;
