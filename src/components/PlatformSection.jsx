const PlatformSection = () => {
  const platforms = [
    {
      id: 1,
      name: "Coursera",
      description: "Learn from world-class universities and companies",
      courses: "5,000+",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/1200px-Coursera-Logo_600x600.svg.png"
    },
    {
      id: 2,
      name: "Udemy",
      description: "Access a vast library of hands-on courses",
      courses: "185,000+",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/2560px-Udemy_logo.svg.png"
    },
    {
      id: 3,
      name: "edX",
      description: "Quality education from leading institutions",
      courses: "3,500+",
      logo: "https://www.edx.org/images/logos/edx-logo-elm.svg"
    }
  ];

  return (
    <div className="bg-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Find Courses From <span className="text-blue-600">Top Platforms</span>
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            We search and compare courses from the world's leading platforms to help you find the best learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform) => (
            <div key={platform.id} className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
              <div className="h-16 mb-4 flex items-center">
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{platform.name}</h3>
              <p className="text-gray-600 mb-4">{platform.description}</p>
              <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {platform.courses} courses
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformSection; 