// page to display the popular services
import React from "react";

const services = [
    {
        title: "Web Development",
        description: "Build responsive and modern websites.",
        image:
            "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Mobile App Development",
        description: "Create high-quality mobile applications for iOS and Android.",
        image:
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Digital Marketing",
        description: "Boost your business with effective online marketing.",
        image:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "UI/UX Design",
        description: "Design user-friendly and attractive interfaces.",
        image:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "SEO Optimization",
        description: "Improve your website ranking on search engines.",
        image:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Content Writing",
        description: "Engage your audience with quality content.",
        image:
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Cloud Services",
        description: "Scale your business with reliable cloud solutions.",
        image:
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "E-commerce Solutions",
        description: "Launch and manage your online store with ease.",
        image:
            "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=800&q=80",
    },
];

const PopularServices = () => {
    return (
        <>
            <div className="relative w-fit ml-6 mt-10 mb-6">
                <h2 className="text-3xl font-bold text-left">Popular Services</h2>
                <div
                    className="absolute left-0 bottom-0 h-1 bg-purple-500 rounded"
                    style={{ width: "60%" }}
                />
            </div>

            {/* card components to display popular services with an image and hover effect */}
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

export default PopularServices;
