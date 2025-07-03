import { Users, Home, Heart, TrendingUp } from 'lucide-react';

function Impact() {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "50,000+",
      label: "Meals Provided"
    },
    {
      icon: <Home className="w-8 h-8" />,
      number: "10,000+",
      label: "People Served"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      number: "100+",
      label: "Partner Organizations"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: "90%",
      label: "Reduction in Food Waste"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Impact</h2>
          <p className="mt-4 text-xl text-gray-600">Together, we're making a significant difference in our community.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:transform hover:-translate-y-1 transition-transform">
              <div className="text-lime-600 mb-4 flex justify-center">{stat.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Impact;