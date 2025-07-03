import { Utensils, Truck, Heart } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: <Utensils className="w-12 h-12" />,
      title: "Donate Food",
      description: "Contribute excess food from your home, restaurant, or event. We accept all types of non-perishable items and fresh produce."
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: "We Collect & Deliver",
      description: "Our volunteers will pick up your donation and ensure it reaches local food banks, shelters, and families in need."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Feed the Hungry",
      description: "Your donation helps provide nutritious meals to individuals and families experiencing food insecurity in our community."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600">Making a difference is easy. Follow these three simple steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-lime-600 mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;